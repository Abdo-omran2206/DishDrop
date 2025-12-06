let API_url = "https://www.themealdb.com/api/json/v1/1/";

const urlParams = new URLSearchParams(window.location.search);
const mealID = urlParams.get("mealId");

// ========================
// Fetch Function
// ========================
async function fetchMeal(ID) {
  const response = await fetch(`${API_url}lookup.php?i=${ID}`);
  const data = await response.json();
  return data.meals[0];
}

// ========================
// Get Ingredients List
// ========================
function getIngredientsList(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${ingredient} - ${measure}`);
    }
  }
  return ingredients;
}

// ========================
// Render Meal Details
// ========================
async function renderMealDetails() {
  const mealDetailsContainer = $("#meal-details-container");
  const meal = await fetchMeal(mealID);

  // Change window title dynamically
  document.title = `DishDrop - ${meal.strMeal}`;

  mealDetailsContainer.append(`
    <div class="meal-details-card" data-aos="zoom-in">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class='text-area'>
        <h2>${meal.strMeal}</h2>
        <h4>Category: ${meal.strCategory}</h4>
        <h4>Area: ${meal.strArea}</h4>
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
        <h3>Ingredients:</h3>
        <ul>
            ${getIngredientsList(meal)
              .map((ingredient) => `<li>${ingredient}</li>`)
              .join("")}
        </ul>
        <div>
  <button class="youtube" onclick="window.open('${meal.strYoutube}', '_blank')">
    Youtube <i class="fa fa-youtube"></i>
  </button>
  
  <button class="source" onclick="window.open('${meal.strSource}', '_blank')">
    Source <i class="fa fa-external-link"></i>
  </button>
</div>

      </div>
      
    </div>
  `);
  AOS.refresh();
}

$(document).ready(function () {
  if (mealID) {
    renderMealDetails();
  } else {
    $("#meal-details-container").append("<p>Meal not found!</p>");
  }
  AOS.init({
    once: true,
  });
});
