//  RECIPE SUGGESTIONS  //

//  LOAD SAVED DATA
let favorites= JSON.parse(localStorage.getItem("favorites")) || [];
let bmiCategory= localStorage.getItem("category");
let goal= localStorage.getItem("goal");

let baseUrl= "https://www.themealdb.com/api/json/v1/1/";


//  GET RECIPE TYPES FOR THE BMI GOAL
function getPreferredCategories(){

    if(bmiCategory === "Underweight"){
        return ["Beef", "Pasta", "Lamb", "Chicken"];
    } else if(bmiCategory === "Overweight" || bmiCategory === "Obese"){
        return ["Seafood", "Vegetarian", "Vegan", "Chicken"];
    }

    // NORMAL = NO FILTER
    return [];
}


//  FETCH JSON
async function getJSON(url){

    let response= await fetch(url);

    if(!response.ok){
        throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
}


//  FIND RECIPES THAT USE ONE FOOD
async function findByIngredient(food){

    let words= food.toLowerCase().trim().split(/\s+/);
    let lastWord= words[words.length - 1];

    // TRY: "brown_rice", THEN "rice", THEN SINGULAR OF THE LAST WORD
    let tries= [words.join("_"), lastWord, lastWord.replace(/s$/, "")];

    for(let name of tries){
        let data= await getJSON(baseUrl + "filter.php?i=" + encodeURIComponent(name));

        if(data.meals){
            return data.meals;
        }
    }

    return [];
}


//  GET IDS OF RECIPES THAT FIT THE BMI GOAL
async function getGoalIds(){

    let categories= getPreferredCategories();
    let ids= new Set();

    for(let category of categories){
        let data= await getJSON(baseUrl + "filter.php?c=" + encodeURIComponent(category));

        if(data.meals){
            data.meals.forEach(meal => ids.add(meal.idMeal));
        }
    }

    return ids;
}


//  SHOW RECIPE CARDS
function showRecipes(list){

    let box= document.getElementById("recipes");
    box.innerHTML= "";

    list.forEach(recipe => {

        let card= document.createElement("div");
        card.className= "recipe-card";

        // PICTURE
        let img= document.createElement("img");
        img.src= recipe.thumb + "/preview";
        img.alt= recipe.name;
        img.addEventListener("error", function(){
            img.hidden= true;
        });

        // NAME
        let title= document.createElement("h3");
        title.textContent= recipe.name;

        // WHICH STARRED FOODS IT USES
        let uses= document.createElement("p");
        uses.className= "uses";
        uses.textContent= "Uses: " + recipe.matches.join(", ");

        // GOAL BADGE
        let badge= document.createElement("span");
        badge.className= "badge";

        if(getPreferredCategories().length > 0 && recipe.fits){
            badge.textContent= "✔ Fits your goal";
            card.appendChild(badge);
        }

        // DETAILS (HIDDEN UNTIL CLICKED)
        let details= document.createElement("div");
        details.className= "details";
        details.hidden= true;

        // VIEW BUTTON
        let viewBtn= document.createElement("button");
        viewBtn.type= "button";
        viewBtn.textContent= "View Recipe";
        viewBtn.addEventListener("click", function(){
            toggleDetails(recipe.id, details, viewBtn);
        });

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(uses);
        card.appendChild(viewBtn);
        card.appendChild(details);
        box.appendChild(card);
    });
}


//  SHOW / HIDE RECIPE DETAILS
async function toggleDetails(id, details, button){

    // HIDE IF ALREADY OPEN
    if(!details.hidden){
        details.hidden= true;
        button.textContent= "View Recipe";
        return;
    }

    // LOAD ONLY ONCE
    if(details.childNodes.length === 0){
        try{
            let data= await getJSON(baseUrl + "lookup.php?i=" + id);
            let meal= data.meals[0];

            // INGREDIENTS
            let list= document.createElement("ul");

            for(let i= 1; i <= 20; i++){
                let ingredient= meal["strIngredient" + i];
                let measure= meal["strMeasure" + i];

                if(ingredient && ingredient.trim() !== ""){
                    let li= document.createElement("li");
                    li.textContent= (measure || "").trim() + " " + ingredient;
                    list.appendChild(li);
                }
            }

            // STEPS RECIPES
            let steps= document.createElement("p");
            steps.className= "steps";
            steps.textContent= meal.strInstructions;

            details.appendChild(list);
            details.appendChild(steps);

        } catch(error){
            console.error("DETAILS ERROR:", error);
            details.textContent= "Failed to load the recipe.";
        }
    }

    details.hidden= false;
    button.textContent= "Hide Recipe";
}


//  LOAD RECIPES
async function loadRecipes(){

    let status= document.getElementById("status");
    let goalText= document.getElementById("goalText");

    // CHECK BMI
    if(bmiCategory === null){
        status.innerHTML= "";
        status.textContent= "Calculate your BMI first so we can match recipes to your goal.";
        return;
    }

    // CHECK STARRED FOODS
    if(favorites.length === 0){
        status.textContent= "No starred foods yet. Press ☆ on a food in the Nutrient Checker.";
        return;
    }

    goalText.textContent= "Your BMI: " + bmiCategory + "  |  Goal: " + goal;
    status.textContent= "Finding recipes...";

    try{
        // GET RECIPES FOR EVERY STARRED FOOD, AND THE GOAL LIST
        let lists= await Promise.all(favorites.map(item => findByIngredient(item.search)));
        let goalIds= await getGoalIds();
        let noGoalFilter= getPreferredCategories().length === 0;

        let recipes= {};
        let missing= [];

        favorites.forEach((item, index) => {

            if(lists[index].length === 0){
                missing.push(item.search);
                return;
            }

            lists[index].forEach(meal => {

                // ADD RECIPE THE FIRST TIME WE SEE IT
                if(!recipes[meal.idMeal]){
                    recipes[meal.idMeal]= {
                        id: meal.idMeal,
                        name: meal.strMeal,
                        thumb: meal.strMealThumb,
                        matches: [],
                        fits: noGoalFilter || goalIds.has(meal.idMeal)
                    };
                }

                recipes[meal.idMeal].matches.push(item.search);
            });
        });

        // SORT: FITS GOAL FIRST, THEN MOST STARRED FOODS USED
        let sorted= Object.values(recipes).sort((a, b) => {
            if(a.fits !== b.fits){
                return a.fits ? -1 : 1;
            }
            return b.matches.length - a.matches.length;
        });

        // SHOW TOP 12
        showRecipes(sorted.slice(0, 12));

         // STATUS MESSAGE
        if(sorted.length === 0){
            // SOME STARRED FOODS HAD NO RECIPES FROM THE API
            if(missing.length > 0){
                status.textContent= "No recipes found for: " + missing.join(", ") + ".";

            // NOTHING FOUND AT ALL
            } else{
                status.textContent= "No recipes found for your starred foods.";
            }
        } else{
            status.textContent= "Top " + Math.min(sorted.length, 12) + " recipes from your starred foods.";

            if(missing.length > 0){
                status.textContent += " No recipes found for: " + missing.join(", ") + ".";
            }
        }
    
        //IF ANY ERROR OCCUR IN API
    } catch(error){
        console.error("ERROR:", error);
        status.textContent= "Failed to load recipes.";
    }
}


//  MAIN  //
loadRecipes();