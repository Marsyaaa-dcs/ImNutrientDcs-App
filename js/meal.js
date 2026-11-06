//  CALORIE TRACKER  //

//  LOAD SAVED DATA
let target= Number(localStorage.getItem("calories")) || 0;
let meals= JSON.parse(localStorage.getItem("meals")) || [];

//  GET TOTAL EATEN
function getTotal(){
    let total= 0;

    meals.forEach(kcal => {
        total += kcal;
    });

    return total;
}

//  ADD MEAL
function addMeal(){

    let input= document.getElementById("mealCalories");
    let kcal= Number(input.value);

    // CHECK INPUT
    if(!Number.isFinite(kcal) || kcal <= 0){
        document.getElementById("remaining").textContent= "Error. Enter calories more than 0.";
        return;
    }

    meals.push(kcal);
    input.value= "";
    saveMeals();
}

//  UNDO LAST MEAL
function removeMeal(){
    if(meals.length > 0){
        meals.pop();
        saveMeals();
    }
}

//  RESET
function resetMeals(){
    meals= [];
    saveMeals();
}

//  SAVE FOR DASHBOARD
function saveMeals(){
    localStorage.setItem("meals", JSON.stringify(meals));
    localStorage.setItem("caloriesEaten", getTotal());
    updateDisplay();
}

//  UPDATE DISPLAY
function updateDisplay(){

    let eaten= getTotal();
    let remaining= document.getElementById("remaining");

    document.getElementById("calorieCount").textContent= `${eaten} / ${target} kcal`;

    if(target === 0){
        remaining.textContent= "Calculate your BMI & calories first to set a target.";
    } else if(eaten <= target){
        remaining.textContent= `${target - eaten} kcal remaining`;
    } else{
        remaining.textContent= `${eaten - target} kcal over your target`;
    }
}


//  MAIN  //
document.getElementById("addBtn").addEventListener("click", addMeal);
document.getElementById("removeBtn").addEventListener("click", removeMeal);
document.getElementById("resetBtn").addEventListener("click", resetMeals);

updateDisplay();

document.getElementById("calories").addEventListener("keydown", e => {
    if(e.key === "Enter") document.getElementById("addBtn").click();
});