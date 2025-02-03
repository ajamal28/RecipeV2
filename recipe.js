class RecipeApp {
  static apiBase = 'https://api.spoonacular.com/recipes';
  static apiKey = '21cfbc10989149ada078940b57528f10';

  constructor() {
    this.ingredients = [];
    this.init();
  }

  init() {
    this.container = document.getElementById('dv4');
    this.setupEventListeners();
    this.createLoadingSpinner();
  }

  createLoadingSpinner() {
    this.loadingSpinner = document.createElement('div');
    this.loadingSpinner.className = "loading-spinner";
    this.loadingSpinner.style.display = "none";
    document.body.appendChild(this.loadingSpinner);
  }

  setupEventListeners() {
    document.addEventListener('click', async (event) => {
      if (event.target.closest('.recipe-link')) {
        const recipeId = event.target.closest('.recipe-link').dataset.id;
        await this.displayRecipeDetails(recipeId);
      }
    });

    document.getElementById('input1').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addIngredient();
    });
  }

  addIngredient() {
    const input = document.getElementById('input1');
    const ingredient = input.value.trim();

    if (ingredient) {
      this.ingredients.push(ingredient);
      input.value = '';
      this.displayIngredients();
    }
  }

  removeIngredient(index) {
    this.ingredients.splice(index, 1);
    this.displayIngredients();
  }

  displayIngredients() {
    const ingredientsHtml = this.ingredients
      .map((ingredient, index) => `
        <div class="ingredient-pill">
          ${ingredient}
          <button class="delete-ingredient" onclick="recipeApp.removeIngredient(${index})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `).join('');

    document.getElementById('data1').innerHTML = ingredientsHtml;
  }

  async searchRecipes() {
    if (this.ingredients.length === 0) {
      this.showError('Please add at least one ingredient');
      return;
    }

    try {
      this.showLoading();
      const url = `${RecipeApp.apiBase}/findByIngredients?` + new URLSearchParams({
        ingredients: this.ingredients.join(','),
        apiKey: RecipeApp.apiKey,
        number: 9,
        ranking: 1
      });

      const response = await fetch(url);
      if (!response.ok) throw new Error('API request failed');
      const recipes = await response.json();
      this.displayRecipes(recipes);
    } catch (error) {
      this.showError('Failed to fetch recipes. Please try again later.');
      console.error(error);
    } finally {
      this.hideLoading();
    }
  }

  displayRecipes(recipes) {
    if (recipes.length === 0) {
      this.showError('No recipes found. Try different ingredients');
      return;
    }

    const recipeCards = recipes.map(recipe => `
      <div class="col-md-6 col-lg-4">
        <div class="recipe-card card h-100 shadow">
          <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
          <div class="card-body">
            <h5 class="card-title">${recipe.title}</h5>
            <p class="card-text">
              <small class="text-white-80">Missing: ${recipe.missedIngredients.map(ing => ing.name).join(', ')}</small>
            </p>
            <button class="btn btn-primary recipe-link" data-id="${recipe.id}">
              View Details <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    this.container.innerHTML = recipeCards;
  }

  async displayRecipeDetails(recipeId) {
    try {
      this.showLoading();
      const url = `${RecipeApp.apiBase}/${recipeId}/information?` + new URLSearchParams({
        includeNutrition: true,
        apiKey: RecipeApp.apiKey
      });

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch recipe details');
      const recipe = await response.json();
      this.showRecipeModal(recipe);
    } catch (error) {
      this.showError('Failed to load recipe details');
      console.error(error);
    } finally {
      this.hideLoading();
    }
  }

  showRecipeModal(recipe) {
    const modal = document.getElementById('recipeModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalImage = modal.querySelector('img');
    const instructions = modal.querySelector('#recipeInstructions');
    const nutritionList = modal.querySelector('#nutritionList');
    const sourceLink = modal.querySelector('#sourceLink');

    modalTitle.textContent = recipe.title;
    modalImage.src = recipe.image;
    sourceLink.href = recipe.sourceUrl;

    // Format instructions
    const cleanedInstructions = recipe.instructions 
      ? recipe.instructions.replace(/<\/?[^>]+(>|$)/g, "") 
      : 'No instructions available';
    
    instructions.innerHTML = `
      <div class="bg-light p-3 rounded">${cleanedInstructions}</div>
    `;

    // Create nutrition grid
    const nutrients = recipe.nutrition.nutrients.slice(0, 4);
    const nutritionHTML = nutrients.map(nutrient => `
      <div class="nutrition-item">
        <div class="text-primary fw-bold">${nutrient.name}</div>
        <div class="text-dark">${Math.round(nutrient.amount)}${nutrient.unit}</div>
      </div>
    `).join('');

    // Add cooking time
    nutritionList.innerHTML = nutritionHTML + `
      <div class="nutrition-item">
        <div class="text-primary fw-bold">Cook Time</div>
        <div class="text-dark">${recipe.readyInMinutes} mins</div>
      </div>
    `;

    new bootstrap.Modal(modal).show();
  }

  showLoading() {
    this.loadingSpinner.style.display = 'block';
  }

  hideLoading() {
    this.loadingSpinner.style.display = 'none';
  }

  showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    this.container.prepend(alert);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.recipeApp = new RecipeApp();
});