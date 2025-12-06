const API_url = "https://www.themealdb.com/api/json/v1/1/";
const urlParams = new URLSearchParams(window.location.search);
const search = urlParams.get("query");

// ========================
// Fetch Function
// ========================
async function fetchMealsByTag(tag) {
  const response = await fetch(`${API_url}${tag}`);
  const data = await response.json();
  return data.meals;
}

// Fetch full meal info by ID
async function fetchMealById(id) {
  const response = await fetch(`${API_url}lookup.php?i=${id}`);
  const data = await response.json();
  return data.meals[0];
}

// ========================
// Render Meals by search
// ========================
async function renderCategoriesFilter() {
  const container = $("#meal-details-container");

  // البحث بالاسم الكامل
  const meals = await fetchMealsByTag(`search.php?s=${search}`);

  document.title = `DishDrop - ${search}`;
  container.empty();

  if (!meals) {
    container.append(`<p>No results found for "${search}"</p>`);
    return;
  }

  for (const meal of meals) {
    const fullMeal = await fetchMealById(meal.idMeal);

    container.append(`
      <div class="featured-sec" data-aos="fade-up">
        <div class="card">
          <img src="${fullMeal.strMealThumb}" alt="${
      fullMeal.strMeal
    }" loading="lazy" />
          <div class="card-info">
            <h4>${fullMeal.strMeal}</h4>
            <span>Category: ${fullMeal.strCategory}</span>
            <span>Country: ${fullMeal.strArea}</span>
            <p>${fullMeal.strInstructions.substring(0, 150)}...</p>
            <button class="view-btn" onclick="viewRecipe('${
              fullMeal.idMeal
            }')">View Recipe</button>
          </div>
        </div>
      </div>
    `);
  }
  AOS.refresh();
}

// ========================
// View Recipe Function
// ========================
function viewRecipe(id) {
  window.location.href = `../MealDetails/index.html?mealId=${id}`;
}

// ========================
// Init
// ========================
$(document).ready(function () {
  renderCategoriesFilter();
  AOS.init({
    once: true,
  });
});
