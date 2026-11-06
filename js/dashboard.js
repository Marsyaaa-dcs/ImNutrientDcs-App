//  DASHBOARD  //

//  LOAD SAVED DATA
let savedname = localStorage.getItem("name");
let savedBMI= localStorage.getItem("bmi");
let savedCategory= localStorage.getItem("category");
let savedCalories= localStorage.getItem("calories");
let savedGoal= localStorage.getItem("goal");
let savedWater= localStorage.getItem("water");

//  user name //
let name = localStorage.getItem("name");

document.getElementById("welcomeText")
.textContent = `Welcome back, ${name}! 👋`;

//  BMI
if(savedBMI !== null){
    document.getElementById("bmi").textContent= savedBMI;
} else{
    document.getElementById("bmi").textContent= "0";
}

//  CATEGORY
if(savedCategory !== null){
    document.getElementById("category").textContent= savedCategory;
}

//  CALORIES
//  CALORIES (EATEN / TARGET)
let eaten= Number(localStorage.getItem("caloriesEaten")) || 0;
let target= Number(localStorage.getItem("calories")) || 0;

document.getElementById("calories").textContent= `${eaten} / ${target} kcal`;

//  GOAL
if(savedGoal !== null){
    document.getElementById("goal").textContent= savedGoal;
}


// CHECK IF USER HAS CALCULATED BMI
if (!localStorage.getItem("bmi")) {
    alert("Please calculate your BMI first.");
    window.location.href = "bmi.html";
}

// DISPLAY DATA
const bmi = localStorage.getItem("bmi");
const category = localStorage.getItem("category");
const calories = localStorage.getItem("calories");
const goal = localStorage.getItem("goal");

document.getElementById("bmi").textContent = bmi;
document.getElementById("category").textContent = category;
document.getElementById("calories").textContent = calories + " kcal";
document.getElementById("goal").textContent = goal;



//  WATER
if(savedWater !== null){
    document.getElementById("water").textContent= savedWater + " / 8";
} else{
    document.getElementById("water").textContent= "0 / 8";
}

//  RECOMMENDATION
const recommendation =
document.getElementById("recommendation");

if (category === "Underweight") {

    recommendation.innerHTML = `
        <h3>Recommended Foods</h3>
        <ul>
            <li>Chicken Breast</li>
            <li>Eggs</li>
            <li>Milk</li>
            <li>Peanut Butter</li>
            <li>Rice</li>
        </ul>
    `;

}
else if (category === "Normal") {

    recommendation.innerHTML = `
        <h3>Recommended Foods</h3>
        <ul>
            <li>Vegetables</li>
            <li>Fruits</li>
            <li>Whole Grains</li>
            <li>Fish</li>
            <li>Lean Meat</li>
        </ul>
    `;

}
else {

    recommendation.innerHTML = `
        <h3>Recommended Foods</h3>
        <ul>
            <li>Salads</li>
            <li>Oatmeal</li>
            <li>Greek Yogurt</li>
            <li>Chicken Breast</li>
            <li>Vegetables</li>
        </ul>
    `;

}
