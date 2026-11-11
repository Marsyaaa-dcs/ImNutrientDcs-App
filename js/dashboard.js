//LOAD DATA FROM LOCAL STORAGE
let savedName = localStorage.getItem("name");
let savedBMI = localStorage.getItem("bmi");
let savedCategory = localStorage.getItem("category");
let savedGoal = localStorage.getItem("goal");
let savedWater = localStorage.getItem("water");

let eaten = Number(localStorage.getItem("caloriesEaten")) || 0;
let target = Number(localStorage.getItem("calories")) || 0;

// VALIDATE USER PROFILE
if (!savedBMI) {
    alert("Please calculate your BMI first.");
    window.location.href = "bmi.html";
}


// DISPLAY USER INFORMATION
let welcomeText =
"Welcome back, " + savedName + "! 👋";

document.getElementById("welcomeText").textContent =
welcomeText;


// DISPLAY BMI INFORMATION
let bmiText =
savedBMI || "0";

document.getElementById("bmi").textContent =
bmiText;

let categoryText =
savedCategory || "-";

document.getElementById("category").textContent =
categoryText;


// DISPLAY CALORIE INFORMATION
let calorieText =
eaten + " / " + target + " kcal";

document.getElementById("calories").textContent =
calorieText;


// DISPLAY GOAL INFORMATION
let goalText =
savedGoal || "-";

document.getElementById("goal").textContent =
goalText;


// DISPLAY WATER TRACKER
let waterText =
(savedWater || 0) + " / 8";

document.getElementById("water").textContent =
waterText;



// GENERATE FOOD RECOMMENDATIONS
// Object containing food recommendations
// according to BMI category

let foodLists = {

    Underweight: [
        "Chicken Breast",
        "Eggs",
        "Milk",
        "Peanut Butter",
        "Rice"
    ],

    Normal: [
        "Vegetables",
        "Fruits",
        "Whole Grains",
        "Fish",
        "Lean Meat"
    ],

    Overweight: [
        "Salads",
        "Oatmeal",
        "Greek Yogurt",
        "Chicken Breast",
        "Vegetables"
    ],

    Obese: [
        "Fish",
        "Egg",
        "Greek Yogurt",
        "Chicken Breast",
        "Vegetables",
        "Brown Rice"
    ]
};


// DISPLAY RECOMMENDATIONS
let recommendation =
document.getElementById("recommendation");

if (savedCategory && foodLists[savedCategory]) {

    let foods = "";

    // LOOP THROUGH RECOMMENDED FOODS
    for (let i = 0; i < foodLists[savedCategory].length; i++) {

        foods +="<li>" + foodLists[savedCategory][i] + "</li>"   
    ;}

    recommendation.innerHTML =
    "<h3>Recommended Foods</h3>" +
    "<ul>" + foods + "</ul>";

}
else {
    recommendation.textContent =
    "Calculate your BMI to see recommended foods.";
}