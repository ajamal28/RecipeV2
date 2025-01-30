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

    document.getElementById('data1').innerHTML = `<ul class="list-group mt-3">${ingredientsList}</ul>`;
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




}

document.addEventListener('DOMContentLoaded', () => {
  window.recipeApp = new RecipeApp();
});