// CALORIES TRACKER
//  LOAD SAVED DATA
let target = Number(localStorage.getItem("calories")) || 0;
let meals = JSON.parse(localStorage.getItem("meals")) || [];


//  ADD MEAL
function addMeal(){
    let input = document.getElementById("mealCalories");
    let kcal = Number(input.value);

    // CHECK INPUT
    //if not number and negative or blank
    if (Number.isFinite(kcal)) {
        if (kcal > 0) {

            //ADD TO ARRAY & SAVEDS
            meals.push(kcal);
            //ADD the INPUT CALORIES
            input.value = "";
            saveMeals();
        } else {
            document.getElementById("remaining").textContent =
              "Calories must be more than 0.";
        }

    } else {
        document.getElementById("remaining").textContent =
          "Please enter a valid number.";
    }}



//  UNDO LAST MEAL
function removeMeal(){
    if(meals.length > 0){
        // delete input before
        meals.pop();
        saveMeals();
    }

}


//  RESET ALL MEALS
function resetMeals(){
    //back as empty array
    meals = [];
    saveMeals();

}


// CALC TOTAL CALORIES CONSUMED
function getTotal(){
    let total = 0;

    for(let i = 0; i < meals.length; i++){
        total += meals[i];
    }

    return total;
}


//  SAVE DATA FOR DASHBOARD
function saveMeals(){
    localStorage.setItem("meals",JSON.stringify(meals));

    localStorage.setItem("caloriesEaten", getTotal());

    updateDisplay();
}


//  UPDATE DISPLAY
function updateDisplay(){
    let eaten = getTotal();

    let remaining = document.getElementById("remaining");

    // DISPLAY CONSUMED CALORIES
    let calorieText = "Consumed: " + eaten + " kcal / Target: " + target + " kcal";
    document.getElementById("calorieCount").textContent = calorieText;

    // DISPLAY REMAINING CALORIES
    if(target === 0){
        remaining.textContent =
        "Calculate your BMI & calories first to set a target.";
    }

    // EATEN MORE THAT TARGET
    else if(eaten <= target){
        let remainingText = (target - eaten) + " kcal remaining";
        remaining.textContent = remainingText;
    }

    else{
        let overText = (eaten - target) + " kcal over your target";
        remaining.textContent = overText;
    }

}



//  MAIN (button for calories update)
document.getElementById("addBtn").addEventListener("click", addMeal);
document.getElementById("removeBtn").addEventListener("click", removeMeal);
document.getElementById("resetBtn").addEventListener("click", resetMeals);



//  DISPLAY DATA WHEN PAGE OPENS
updateDisplay();



//  PRESS ENTER TO ADD MEAL (button)
document.getElementById("mealCalories")
.addEventListener("keydown", function(myEvent){

    if(myEvent.key === "Enter"){
        document.getElementById("addBtn").click();
    }
});