class RecipeApp {
  static apiBase = 'https://api.spoonacular.com/recipes';
  static apiKey = '21cfbc10989149ada078940b57528f10';

  constructor(){
    this.ingredients = [];
    this.init();
  }

  init(){
   this.container = document.getElementById('dv4');
   this.setupEventListeners();
   this.createLoadingSpinner();   
  }

  createLoadingSpinner(){
    this.loadingSpinner = document.createElement('div');
    this.loadingSpinner.className = "spinner-border text-primary";
    this.loadingSpinner.role="status";
    this.loadingSpinner.innerHTML = "<span class='sr-only'>Loading...</span>";
    this.loadingSpinner.style.display ="none";
    this.container.parentNode.insertBefore(this.loadingSpinner, this.container);
  }
  setupEventListeners(){
    document.addEventListener('click', async (event) => {
      if (event.target.matches('.recipe-link')) {
        const recipeId = event.target.dataset.id;
        await this.displayRecipeDetails(recipeId);
      }

      if (event.target.matches('.close-modal')){
        this.hideModal();
      }
    });

    document.getElementById('input1').addEventListener('keypress', (e) => {
      if(e.key ==='Enter') this.addIngredient();
    });
  }

  addIngredient(){
    const input = document.getElementById('input1');
    const ingredient = input.value.trim();

    if (ingredient) {
      this.ingredients.push(ingredient);
      input.value = '';
      this.displayIngredients();
    }
    console.log(this.ingredients);
  }
  
  displayIngredients(){
    const ingredientsList = this.ingredients
    .map(ingredient => `<li class ="list-group-item">${ingredient}</li>`).join('');

    document.getElementById('data1').innerHTML = `<ul class="list-group mt-3" style="margin-bottom: 10px">${ingredientsList}</ul>`;
  }

  async searchRecipes(){
    if(this.ingredients.length === 0){
      this.showError('Please add at least one ingredient');
      return;
    }
    try {
      this.showLoading();
      const url = `${RecipeApp.apiBase}/findByIngredients?` + new URLSearchParams({
        ingredients: this.ingredients.join(','),
        apiKey: RecipeApp.apiKey,
        number: 5,
        ranking: 1
      });
    const response = await fetch(url);
    if (!response.ok) throw new Error('API request failed');

    const recipes = await response.json();
    this.displayRecipes(recipes);
    } catch (error) {
        this.showError('Failed to fetch recipes. Please try again Later.');
        console.error(error);
    }finally {
      this.hideLoading();
    }
  }
  displayRecipes(recipes){
      if(recipes.length === 0){
        this.showError('No recipes found. Try different ingredients');
        return;
      }

      const recipeCards = recipes.map(recipe => `
        <div class="col-lg-4 mb-4">
        <div class="card h-100">
          <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
          <div class="card-body">
            <h5 class="card-title">${recipe.title}</h5>
            <p class="card-text">
              <strong>Missing ingredients:</strong> 
              ${recipe.missedIngredients.map(ing => ing.name).join(', ')}
            </p>
            <button class="btn btn-primary recipe-link" data-id="${recipe.id}">
              View Details
            </button>
          </div>
        </div>
      </div>`).join(``);

      this.container.innerHTML = `<div class="row">${recipeCards}</div>`;
  } 

  async displayRecipeDetails(recipeId){
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
      }finally {
        this.hideLoading();
      }
  }

  showRecipeModal(recipe){
    const modalContent = `<div class="modal fade show" style="display: block; background: rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${recipe.title}</h5>
              <button type="button" class="close close-modal">&times;</button>
            </div>
            <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
              <img src="${recipe.image}" class="img-fluid mb-3" alt="${recipe.title}">
              <h6>Instructions:</h6>
              <div>${recipe.instructions || 'No instructions available'}</div>
              <h6 class="mt-3">Nutrition:</h6>
              <ul class="list-group">
                ${recipe.nutrition.nutrients.slice(0, 5).map(nutrient => `
                  <li class="list-group-item">
                    ${nutrient.name}: ${nutrient.amount}${nutrient.unit}
                  </li>
                `).join('')}
              </ul>
              <a href="${recipe.sourceUrl}" target="_blank" class="btn btn-link mt-3">
                View Original Recipe
              </a>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary close-modal">Close</button>
            </div>
          </div>
        </div>
      </div>`;

      const modalContainer = document.createElement('div');
      modalContainer.innerHTML = modalContent;
      document.body.appendChild(modalContainer);
  }

  hideModal(){
    const modal = document.querySelector('.modal');
    if (modal) modal.parentNode.remove();
  }

  showLoading(){
    this.loadingSpinner.style.display = 'block';
  }

  hideLoading(){
    this.loadingSpinner.style.display ='none';
  }

  showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'alert alert-danger mt-3';
    errorElement.textContent = message;
    this.container.prepend(errorElement);
    setTimeout(() => errorElement.remove(), 5000);
  }

}

document.addEventListener('DOMContentLoaded', () => {
  window.recipeApp = new RecipeApp();
});