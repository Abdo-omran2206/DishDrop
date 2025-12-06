const API_url = "https://www.themealdb.com/api/json/v1/1/";
const urlParams = new URLSearchParams(window.location.search);
const filter = urlParams.get("ingredient");

// State
let allIngredients = [];
let currentPage = 1;
const itemsPerPage = 30;

// ========================
// Fetch Helper
// ========================
async function fetchMealsByTag(tag) {
  const response = await fetch(`${API_url}${tag}`);
  const data = await response.json();
  if (tag === "list.php?i=list") return data.meals;
  return data.meals;
}

// Fetch full meal info by ID
async function fetchMealById(id) {
  const response = await fetch(`${API_url}lookup.php?i=${id}`);
  const data = await response.json();
  return data.meals[0];
}

// ========================
// Main Ingredients Logic
// ========================
async function fetchAndRenderIngredients() {
  // Fetch only once
  allIngredients = await fetchMealsByTag("list.php?i=list");
  // Filter out invalid ingredients
  allIngredients = allIngredients.filter((ing) => ing.strIngredient);

  renderIngredients();
}

function renderIngredients() {
  const IngredientsList = $("#ingredients-list");
  const PaginationContainer = $("#pagination");
  const searchTerm = $("#ingredient-search").val().toLowerCase();

  IngredientsList.empty();
  PaginationContainer.empty();

  // 1. Filter
  const filteredIngredients = allIngredients.filter((ing) =>
    ing.strIngredient.toLowerCase().includes(searchTerm)
  );

  // 2. Paginate
  const totalItems = filteredIngredients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Validate current page
  if (currentPage > totalPages) currentPage = 1;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSlice = filteredIngredients.slice(startIndex, endIndex);

  // 3. Render Items
  if (currentSlice.length === 0) {
    IngredientsList.append("<p>No ingredients found.</p>");
    return;
  }

  currentSlice.forEach((ing) => {
    IngredientsList.append(`
      <div class="ingredients-card" data-aos="zoom-in" onclick="location.href='index.html?ingredient=${ing.strIngredient}'">
        <img src="https://www.themealdb.com/images/ingredients/${ing.strIngredient}.png" alt="${ing.strIngredient}" loading="lazy"/>
        <h4>${ing.strIngredient}</h4>
      </div>
    `);
  });

  // 4. Render Pagination
  renderPagination(totalPages, PaginationContainer);

  // Refresh AOS for new elements
  AOS.refresh();
}

function renderPagination(totalPages, container) {
  if (totalPages <= 1) return;

  // Prev Button
  const prevBtn = $(`<button class="page-btn">Prev</button>`);
  if (currentPage === 1) prevBtn.prop("disabled", true);
  prevBtn.click(() => {
    if (currentPage > 1) {
      currentPage--;
      renderIngredients();
      $("html, body").animate({ scrollTop: 0 }, "slow");
    }
  });
  container.append(prevBtn);

  // Page Numbers (Simple logic: Show all if < 10, otherwise simplify)
  // For simplicity, let's show max 5 buttons around current page
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  // Adjust start if end is hitting limit
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  if (startPage > 1) {
    container.append(
      `<button class="page-btn" onclick="changePage(1)">1</button>`
    );
    if (startPage > 2) container.append(`<span>...</span>`);
  }

  for (let i = startPage; i <= endPage; i++) {
    const btn = $(
      `<button class="page-btn ${
        i === currentPage ? "active" : ""
      }">${i}</button>`
    );
    btn.click(() => changePage(i));
    container.append(btn);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) container.append(`<span>...</span>`);
    container.append(
      `<button class="page-btn" onclick="changePage(${totalPages})">${totalPages}</button>`
    );
  }

  // Next Button
  const nextBtn = $(`<button class="page-btn">Next</button>`);
  if (currentPage === totalPages) nextBtn.prop("disabled", true);
  nextBtn.click(() => {
    if (currentPage < totalPages) {
      currentPage++;
      renderIngredients();
      $("html, body").animate({ scrollTop: 0 }, "slow");
    }
  });
  container.append(nextBtn);
}

function changePage(page) {
  currentPage = page;
  renderIngredients();
  $("html, body").animate({ scrollTop: 0 }, "slow");
}

function setupSearch() {
  $("#ingredient-search").on("keyup", function () {
    currentPage = 1; // Reset to page 1 on search
    renderIngredients();
  });
}

// ========================
// Render Meals by Ingredient (Existing Logic)
// ========================
async function renderIngredientsFilter() {
  const IngredientsList = $("#content");
  // Hide ingredients controls
  $("#ingredients-list").hide();
  $(".search-container").hide();
  $("#pagination").hide();

  const meals = await fetchMealsByTag(`filter.php?i=${filter}`);

  document.title = `DishDrop - ${filter}`;

  IngredientsList.empty();

  if (!meals) {
    IngredientsList.append("<p>No recipes found for this ingredient.</p>");
    return;
  }

  for (const meal of meals) {
    // Fetch full info for each meal
    const fullMeal = await fetchMealById(meal.idMeal);

    IngredientsList.append(`
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

function viewRecipe(id) {
  window.location.href = `../MealDetails/index.html?mealId=${id}`;
}

// ========================
// Init
// ========================
$(document).ready(function () {
  if (filter != null) {
    renderIngredientsFilter();
  } else {
    fetchAndRenderIngredients();
    setupSearch();
  }
  AOS.init({
    once: true,
  });
});
