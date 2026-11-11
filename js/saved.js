//  LOAD SAVED FOODS
let favorites= JSON.parse(localStorage.getItem("favorites")) || [];


//  SHOW SAVED FOODS
function showFavorites(){
    let box= document.getElementById("favorites");
    box.innerHTML= "";

    // UPDATE COUNT
    document.getElementById("count").textContent= favorites.length + " saved";

    // NOTHING SAVED YET
    if(favorites.length === 0){
        box.textContent= "No saved foods yet. Press ☆ on a result in the Nutrient Checker.";
        document.getElementById("clearBtn").hidden= true;
        return;
    }
    document.getElementById("clearBtn").hidden= false;

    favorites.forEach(item => {let card= document.createElement("div");
        card.className= "fav-card";

        // TITLE
        let title= document.createElement("h3");
        title.textContent= item.description;

        // NUTRIENTS
        let info= document.createElement("p");
        info.textContent= "Calories: " + item.calories + " kcal  |  Protein: " + item.protein
            + " g  |  Fat: " + item.fat + " g  |  Carbs: " + item.carbs + " g";

        // BUTTONS
        let actions= document.createElement("div");
        actions.className= "fav-actions";

        // VIEW AGAIN
        let viewBtn= document.createElement("button");
        viewBtn.type= "button";
        viewBtn.textContent= "View";
        viewBtn.addEventListener("click", function(){
            localStorage.setItem("pendingSearch", item.search);
            window.location.href= "nutrient.html";
        });

        // REMOVE
        let removeBtn= document.createElement("button");
        removeBtn.type= "button";
        removeBtn.className= "remove";
        removeBtn.textContent= "Remove";
        removeBtn.addEventListener("click", function(){
            favorites= favorites.filter(f => f.description !== item.description);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            showFavorites();
        });

        actions.appendChild(viewBtn);
        actions.appendChild(removeBtn);

        card.appendChild(title);
        card.appendChild(info);
        card.appendChild(actions);
        box.appendChild(card);
    });
}


//  CLEAR ALL
function clearAll(){
    if(confirm("Remove all saved foods?")){
        favorites= [];
        localStorage.setItem("favorites", JSON.stringify(favorites));
        showFavorites();
    }
}


//  CLEAR BUTTON //
document.getElementById("clearBtn").addEventListener("click", clearAll);
showFavorites();