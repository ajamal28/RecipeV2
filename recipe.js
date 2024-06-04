var myArr = [];

var api = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=";
var key = "&apiKey=21cfbc10989149ada078940b57528f10";
var number = "&number=3";
var max = "&ranking=1";
var id = [];

const app = document.getElementById('dv4');
const container = document.createElement('div');
container.setAttribute('class', 'row');
app.appendChild(container);

function pushData() {
  var inputText = document.getElementById('input1').value.trim();
  if (inputText) {
    myArr.push(inputText);
    document.getElementById('input1').value = '';

    var pval = myArr.map(ingredient => ingredient).join("<br>");
    document.getElementById('data1').innerHTML = pval;
  }
}

function add() {
  var ingredients = myArr.join(',');
  var url = api + ingredients + key + number + max;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      container.innerHTML = ''; // Clear previous results
      data.forEach((recipe, index) => {
        var card = createRecipeCard(recipe, index + 1);
        container.appendChild(card);
      });
    })
    .catch(error => console.error('Error:', error));
}

function createRecipeCard(recipe, index) {
  var card = document.createElement('div');
  card.setAttribute('class', 'col-lg-4 mb-4');

  var cardBody = `
    <div class="card h-100">
      <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
      <div class="card-body">
        <h5 class="card-title">${recipe.title}</h5>
        <p class="card-text">Missing ingredients: ${recipe.missedIngredients.map(ing => ing.name).join(', ')}</p>
        <a href="#" class="btn btn-primary recipe-link" data-id="${recipe.id}">View Recipe</a>
      </div>
    </div>
  `;
  card.innerHTML = cardBody;
  return card;
}

document.addEventListener('click', function (event) {
  if (event.target.matches('.recipe-link')) {
    var recipeId = event.target.getAttribute('data-id');
    displayRecipe(recipeId);
  }
}, false);

function displayRecipe(id) {
  var url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=21cfbc10989149ada078940b57528f10`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      window.open(data.sourceUrl, '_blank');
    })
    .catch(error => console.error('Error:', error));
}
