//  LOAD SAVED FOODS
let favorites= JSON.parse(localStorage.getItem("favorites")) || [];

//  FOOD CURRENTLY ON SCREEN
let currentFood= null;


//  CHECK IF FOOD IS SAVED
function isSaved(description){
    return favorites.some(item => item.description === description);
}


//  SAVE / REMOVE STAR
function toggleFavorite(){
    if(currentFood === null){
        return;
    }

    if(isSaved(currentFood.description)){
        // REMOVE SAVED / TARRED FOOD
        favorites= favorites.filter(item => item.description !== currentFood.description);
    } else{
        // SAVE FOOD
        favorites.push(currentFood);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    // UPDATE STAR
    updateStar();
}


//  UPDATE STAR ICON
function updateStar(){
    let star= document.getElementById("starBtn");

    if(star === null || currentFood === null){
        return;
    }

    if(isSaved(currentFood.description)){
        star.textContent= "★";
        star.title= "Remove from saved";
    } else{
        star.textContent= "☆";
        star.title= "Save this food";
    }
}



//  GET FOOD ILLUSTRATOR (GIPHY API)
async function getFoodImage(food){

    // NO KEY = NO IMAGE
    if(giphyKey === ""){
        return null;
    }

    try{
        let response= await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=${encodeURIComponent(food + " food")}&limit=1&rating=g&lang=en`
        );

        if(!response.ok){
            throw new Error(`HTTP Error: ${response.status}`);
        }

        let data= await response.json();

        // CHECK RESULT
        if(!data.data || data.data.length === 0){
            return null;
        }

        return {
            url: data.data[0].images.fixed_height.url,
            title: data.data[0].title
        };

    } catch(error){
        console.error("IMAGE ERROR:", error);
        return null;
    }
}


//  SEARCH FOOD (by feching from APIs)
async function searchFood(){
    // GET INPUT IN THE RIGHT FILED AND REMOVE EXTRA SPACE
    let food= document.getElementById("food").value.trim();
    let result= document.getElementById("result");

    // CHECK INPUT
    // if empty
    if(food === ""){
        result.textContent= "Please enter a food name.";
        return;
    }

    try{
        result.textContent= "Loading...";

        // GET NUTRITION AND GIF AT THE SAME TIME
        let [response, image]= await Promise.all([
            // INFO API FROOM USDAFOOD DATA CENTER
            fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(food)}&api_key=${usdaKey}`),
            getFoodImage(food)
        ]);

        if(!response.ok){
            throw new Error(`HTTP Error: ${response.status}`);
        }

        let data= await response.json();

        // CHECK RESULT
        if(!data.foods || data.foods.length === 0){
            result.textContent= "Food not found.";
            return;
        }

        let foodData= data.foods[0];


// WHAT BEEN FETCH FROM USDA FOOD DATA CENTER API
        let calories= "N/A";
        let protein= "N/A";
        let fat= "N/A";
        let carbs= "N/A";

        // GET NUTRIENTS
        foodData.foodNutrients.forEach(nutrient => {
            if(nutrient.nutrientName === "Energy" && nutrient.unitName === "KCAL"){
                calories= nutrient.value;
            } else if(nutrient.nutrientName === "Protein"){
                protein= nutrient.value;
            } else if(nutrient.nutrientName === "Total lipid (fat)"){
                fat= nutrient.value;
            } else if(nutrient.nutrientName === "Carbohydrate, by difference"){
                carbs= nutrient.value;
            }
        });

        // REMEMBER THE FOOD FOR SAVED/STAR)
        currentFood= {
            search: food,
            // IDEntiFied of FOOD
            description: foodData.description,
            calories: calories,
            protein: protein,
            fat: fat,
            carbs: carbs
        };

        // OUTPUT
        result.innerHTML= `
            <div class="food-result">
                <button type="button" id="starBtn" class="star-btn">☆</button>
                <img id="foodImage" class="food-image" alt="" hidden>
                <p id="photoCredit" class="photo-credit" hidden>Powered by GIPHY</p>
                <h3></h3>
                <p>Calories: ${calories} kcal</p>
                <p>Protein: ${protein} g</p>
                <p>Fat: ${fat} g</p>
                <p>Carbohydrates: ${carbs} g</p>
            </div>
        `;
        result.querySelector("h3").textContent= foodData.description;

        // STAR BUTTON
        document.getElementById("starBtn").addEventListener("click", toggleFavorite);
        updateStar();

        // SHOW GIF (ONLY IF FOUND)
        if(image){
            let img= document.getElementById("foodImage");
            img.src= image.url;
            img.alt= image.title || food;
            img.hidden= false;

            // HIDE IF THE GIF FAILS TO LOAD
            img.addEventListener("error", function(){
                img.hidden= true;
            });

            // GIPHY ATTRIBUTION
            document.getElementById("photoCredit").hidden= false;
        }

    } catch(error){
        console.error("ERROR:", error);
        result.textContent= "Failed to connect to the food database.";
    }
}



// search button
document.getElementById("searchBtn").addEventListener("click", searchFood);

// SEARCH WITH THE ENTER KEY SHORT CUT (eg: enter)
document.getElementById("food").addEventListener("keydown", function(myEvent){
    if(myEvent.key === "Enter"){
        searchFood();
    }
});



// SEARCH REQUESTED FROM THE SAVED FOODS PAGE
let pending= localStorage.getItem("pendingSearch");

if(pending){
    localStorage.removeItem("pendingSearch");
    document.getElementById("food").value= pending;
    searchFood();
}