//  WATER TRACKER  //

//  LOAD SAVED DATA
let water= Number(localStorage.getItem("water")) || 0;
let maxWater= 8;

//  ADD WATER
function addWater(){
    if(water < maxWater){
        water++;
        saveWater();
    }
}

//  REMOVE WATER
function removeWater(){
    if(water > 0){
        water--;
        saveWater();
    }
}

//  RESET WATER
function resetWater(){
    water= 0;
    saveWater();
}

//  SAVE FOR DASHBOARD
function saveWater(){
    localStorage.setItem("water", water);
    updateDisplay();
}

//  UPDATE DISPLAY
function updateDisplay(){
    document.getElementById("waterCount").textContent= `${water} / ${maxWater} Glasses`;
}


//  MAIN  //
document.getElementById("addBtn").addEventListener("click", addWater);
document.getElementById("removeBtn").addEventListener("click", removeWater);
document.getElementById("resetBtn").addEventListener("click", resetWater);

updateDisplay();