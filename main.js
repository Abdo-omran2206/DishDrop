let API_url = "https://www.themealdb.com/api/json/v1/1/";

// ========================
// Fetch Function
// ========================
async function fetchMealsBytag(tag) {
  const response = await fetch(`${API_url}${tag}`);
  const data = await response.json();

  if (tag === "categories.php") return data.categories;
  return data.meals;
}

// ========================
// Render Categories
// ========================
async function renderCategories() {
  const CategoriesList = $("#categories-list");
  const categories = await fetchMealsBytag("categories.php");

  CategoriesList.empty();

  categories.slice(0, 6).forEach((cat) => {
    CategoriesList.append(`
      <div class="category-card" data-aos="zoom-in" onclick="location.href='categories/index.html?category=${cat.strCategory}'">
        <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}" />
        <h4>${cat.strCategory}</h4>
      </div>
    `);
  });
  AOS.refresh();
}

// ========================
// Render Popular Meals
// ========================
async function renderPopular() {
  const populerCard = $("#populer-card");
  const populerMeals = await fetchMealsBytag("filter.php?c=Seafood");

  populerCard.empty();
  populerCard.append(`<h2>Popular Recipes</h2>`);

  populerMeals.slice(0, 1).forEach((meal) => {
    populerCard.append(`
      <div class="recipe-item" data-aos="fade-up">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy" />
        <h4>${meal.strMeal}</h4>
        <button class="view-btn" onclick="viewRecipe('${meal.idMeal}')">
          View Recipe
        </button>
      </div>
    `);
  });
  AOS.refresh();
}

AOS.init({
  // Global settings:
  disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  startEvent: "DOMContentLoaded", // name of the event dispatched on the document, that AOS should initialize on
  initClassName: "aos-init", // class applied after initialization
  animatedClassName: "aos-animate", // class applied on animation
  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
  disableMutationObserver: false, // disables automatic mutations' detections (advanced)
  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 400, // values from 0 to 3000, with step 50ms
  easing: "ease", // default easing for AOS animations
  once: true, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
});

// ========================
// Render Random Meals
// ========================
async function renderRandomMeals() {
  const content = $("#content");
  const mealSet = [];
  const requestNum = 10;

  content.empty();

  for (let i = 0; i < requestNum; i++) {
    const meal = (await fetchMealsBytag("random.php"))[0];

    if (mealSet.includes(meal.idMeal)) {
      i--;
      continue;
    }

    content.append(`
      <div class="featured-sec" data-aos="fade-right">
        <div class="card">
          <div class="card-info">
            <h4>${meal.strMeal}</h4>
            <span>Category: ${meal.strCategory}</span>
            <span>Country: ${meal.strArea}</span>
            <p>${meal.strInstructions.substring(0, 150)}...</p>
            <button class="view-btn" onclick="viewRecipe('${meal.idMeal}')">
              View Recipe
            </button>
          </div>
          <img src="${meal.strMealThumb}" alt="${
      meal.strMeal
    }" loading="lazy" />
        </div>
      </div>
    `);

    mealSet.push(meal.idMeal);
  }
  AOS.refresh();
}

// ========================
// View Recipe Handler
// ========================
function viewRecipe(id) {
  window.location.href = `MealDetails/index.html?mealId=${id}`;
}

// ========== Detect Enter key ==========
$("#search").on("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // لمنع السلوك الافتراضي (مثل إعادة تحميل الصفحة)
    Search();
  }
});

async function Search() {
  let searchText = $("#search").val().trim();

  if (searchText === "") {
    // random id
    let meal = await fetchMealsBytag("random.php");
    location.href = `MealDetails/index.html?mealId=${meal[0].idMeal}`;
  } else {
    // page search
    location.href = `Search/index.html?query=${searchText}`;
  }
}

function buttonChange() {
  let searchText = $("#search").val().trim();

  if (searchText === "") {
    $("#random-btn").text("Random Dish");
  } else {
    $("#random-btn").text("Search");
  }
}

// ========================
// Init Page
// ========================
$(document).ready(function () {
  renderCategories();
  renderPopular();
  renderRandomMeals();
});
