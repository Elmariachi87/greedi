// http://localhost:3000/foodQuotes

const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const searchBar = document.querySelector(".meal-search-box");

// EVENT LISTENERS

searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
});

searchBar.addEventListener("keydown", function (e) {
  console.log(e);
  if (e.code === "Enter") {
    // e.preventDefault();
    getMealList();
    // document.querySelector("search-btn").click();
  }
});

// ===== GET MEAL =====
// Get meal list that matches with ingredients
function getMealList() {
  // .value returns the value .trim removes white space
  let searchInputTxt = document.getElementById("search-input").value.trim();
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}
`)
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          // html becomes a whole nest of divs, with the link, pic etc being determined by the URL
          html += `
            <div class="meal-item" data-id="${meal.idMeal}">
                <div class="meal-img">
                    <img src="${meal.strMealThumb}" alt="food from your search result" />
                </div>
                 <div class="meal-name">
                    <h3>${meal.strMeal}</h3>
                    <a href="" class="recipe-btn">Fetch recipe</a>
                 </div>
            </div>`;
        });
        // Removes the class list applied below if it didn't find anything for previous ingredient
        mealList.classList.remove("notFound");
      } else {
        html = "Sorry,  we didn't find anything for that ingredient";
        // Add a new class to the text in the event it doesn't find anything
        mealList.classList.add("notFound");
      }
      mealList.innerHTML = html;
    });
}

// ===== GET RECIPE =====
function getMealRecipe(e) {
  e.preventDefault();
  //   console.log(e.target);
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    console.log(mealItem);
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => mealRecipeModal(data.meals));
    // console.log(data);
  }
}

//  Create modal

function mealRecipeModal(meal) {
  console.log(meal);
  meal = meal[0];
  let html = ` 
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <div class="recipe-instructions">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-meal-img">
        <img src="${meal.strMealThumb}" alt="food from your search result">
    </div>
    <div class="recipe-link">
        <a href="${meal.strYoutube}" target="_blank">Watch video</a>
    </div>`;
  mealDetailsContent.innerHTML = html;
  //   The class 'meal-content' is set to display:none. This adds 'display:block' to it so that it appears
  mealDetailsContent.parentElement.classList.add("showRecipe");
}

// ==== TO DO ====
// Remove columns if result is less than 3 (so as to centre the result)
