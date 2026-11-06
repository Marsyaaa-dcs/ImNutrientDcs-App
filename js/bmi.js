//  BMI & CALORIE CALCULATOR  //

//  CALCULATE
function calculateHealth(){

    // GET INPUT
    let name= document.getElementById("name").value.trim();
    let age= Number(document.getElementById("age").value);
    let gender= document.getElementById("gender").value;
    let weight= Number(document.getElementById("weight").value);
    let heightCm= Number(document.getElementById("height").value);
    let activity= Number(document.getElementById("activity").value);

    // CHECK INPUT
    if(name === "" || age <= 0 || weight <= 0 || heightCm <= 0){
        alert("Error. Please fill in your name and enter valid positive values.");
        return;
    }

    // CALCULATE BMI (CM TO M)
    let height= heightCm / 100;
    let bmi= weight / (height * height);

    // CHECK BMI CATEGORY
    let category= "";
    let adjustment= 0;
    let goal= "";

    if(bmi < 18.5){
        category= "Underweight";
        adjustment= 500;
        goal= "Gain weight (+500 kcal)";
    } else if(bmi < 25){
        category= "Normal";
        adjustment= 0;
        goal= "Maintain weight";
    } else if(bmi < 30){
        category= "Overweight";
        adjustment= -500;
        goal= "Lose weight (-500 kcal)";
    } else{
        category= "Obese";
        adjustment= -500;
        goal= "Lose weight (-500 kcal)";
    }

    // CALCULATE BMR
    let bmr= 0;

    if(gender === "male"){
        bmr= (10 * weight) + (6.25 * heightCm) - (5 * age) + 5;
    } else{
        bmr= (10 * weight) + (6.25 * heightCm) - (5 * age) - 161;
    }

    // CALCULATE CALORIES
    let maintenance= Math.round(bmr * activity);
    let target= maintenance + adjustment;

    // SAVE FOR DASHBOARD
    localStorage.setItem("name", name);
    localStorage.setItem("bmi", bmi.toFixed(2));
    localStorage.setItem("category", category);
    localStorage.setItem("calories", target);
    localStorage.setItem("goal", goal);

    // OUTPUT (POPUP)
    alert(
        "Your BMI: " + bmi.toFixed(2) + " (" + category + ")\n" +
        "Maintenance Calories: " + maintenance + " kcal\n" +
        "Goal: " + goal + "\n" +
        "Daily Calories Needed: " + target + " kcal"
    );

    // GO TO DASHBOARD AFTER PRESSING OK
    window.top.location.href= "dashboard.html";
}


//  MAIN  //
document.getElementById("calcBtn").addEventListener("click", calculateHealth);