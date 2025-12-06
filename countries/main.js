const API_URL = "https://www.themealdb.com/api/json/v1/1/";
const urlParams = new URLSearchParams(window.location.search);
const selectedCountry = urlParams.get("countries");

// ========================
// Fetch Functions
// ========================
async function fetchData(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`);
  const data = await res.json();
  return data.meals || data.categories;
}

async function getMealById(id) {
  const res = await fetch(`${API_URL}lookup.php?i=${id}`);
  const data = await res.json();
  return data.meals[0];
}

// ========================
// Country Flags
// ========================
const flags = {
  Algerian: "dz",
  American: "us",
  Argentinian: "ar",
  Australian: "au",
  British: "gb",
  Canadian: "ca",
  Chinese: "cn",
  Croatian: "hr",
  Dutch: "nl",
  Egyptian: "eg",
  Filipino: "ph",
  French: "fr",
  Greek: "gr",
  Indian: "in",
  Irish: "ie",
  Italian: "it",
  Jamaican: "jm",
  Japanese: "jp",
  Kenyan: "ke",
  Malaysian: "my",
  Mexican: "mx",
  Moroccan: "ma",
  Norwegian: "no",
  Polish: "pl",
  Portuguese: "pt",
  Russian: "ru",
  "Saudi Arabian": "sa",
  Slovakian: "sk",
  Spanish: "es",
  Syrian: "sy",
  Thai: "th",
  Tunisian: "tn",
  Turkish: "tr",
  Ukrainian: "ua",
  Uruguayan: "uy",
  Venezulan: "ve",
  Vietnamese: "vn",
};

// ========================
// Render Countries Grid
// ========================
async function renderCountries() {
  const grid = $("#countries-grid");
  const areas = await fetchData("list.php?a=list");

  grid.empty();

  areas.forEach((area) => {
    const code = flags[area.strArea] || "un";

    grid.append(`
      <div class="country-card" data-aos="zoom-in" onclick="location.href='index.html?countries=${area.strArea}'">
        <img class="flag" src="https://flagcdn.com/48x36/${code}.png" alt="${area.strArea} Flag">
        <h4>${area.strArea}</h4>
      </div>
    `);
  });
  AOS.refresh();
}

// ========================
// Render Meals for Selected Country
// ========================
async function renderCountryMeals() {
  const grid = $("#meals-grid");
  const meals = await fetchData(`filter.php?a=${selectedCountry}`);

  document.title = `DishDrop - ${selectedCountry}`;
  grid.empty();

  for (const meal of meals) {
    const fullMeal = await getMealById(meal.idMeal);

    grid.append(`
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
            <button class="view-btn" onclick="viewRecipe('${fullMeal.idMeal}')">
              View Recipe
            </button>
          </div>
        </div>
      </div>
    `);
  }
  AOS.refresh();
}

// ========================
// Open Meal Details Page
// ========================
function viewRecipe(id) {
  window.location.href = `../MealDetails/index.html?mealId=${id}`;
}

// ========================
// Init
// ========================
$(document).ready(() => {
  if (selectedCountry) {
    renderCountryMeals();
  } else {
    renderCountries();
  }
  AOS.init({
    once: true,
  });
});
