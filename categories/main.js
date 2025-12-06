const API_url = "https://www.themealdb.com/api/json/v1/1/";
const urlParams = new URLSearchParams(window.location.search);
const filter = urlParams.get("category");

// ========================
// Fetch Function
// ========================
async function fetchMealsByTag(tag) {
  const response = await fetch(`${API_url}${tag}`);
  const data = await response.json();
  if (tag === "categories.php") return data.categories;
  return data.meals;
}

// Fetch full meal info by ID
async function fetchMealById(id) {
  const response = await fetch(`${API_url}lookup.php?i=${id}`);
  const data = await response.json();
  return data.meals[0];
}

// ========================
// Render Categories
// ========================
async function renderCategories() {
  const CategoriesList = $("#categories-list");
  const categories = await fetchMealsByTag("categories.php");
  CategoriesList.empty();

  categories.forEach((cat) => {
    CategoriesList.append(`
          <div class="category-card" data-aos="zoom-in" onclick="location.href='index.html?category=${cat.strCategory}'">
            <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}" />
            <h4>${cat.strCategory}</h4>
          </div>
        `);
  });
  AOS.refresh();
}

// ========================
// Render Meals by Category
// ========================
async function renderCategoriesFilter() {
  const CategoriesList = $("#content");
  const meals = await fetchMealsByTag(`filter.php?c=${filter}`);

  document.title = `DishDrop - ${filter}`;

  CategoriesList.empty();

  for (const meal of meals) {
    // Fetch full info for each meal
    const fullMeal = await fetchMealById(meal.idMeal);

    CategoriesList.append(`
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
  if (filter != null) {
    renderCategoriesFilter();
  } else {
    renderCategories();
  }
  AOS.init({
    once: true,
  });
});
