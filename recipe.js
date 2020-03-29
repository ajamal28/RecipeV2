var myArr =[];

var api = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=";
var key = "&apiKey=21cfbc10989149ada078940b57528f10"
var number ="&number=3"
var max = "&ranking=1"
var id = [];
// api1 = d02972b2b1464731af8703dbe2c8049c
// api2 = 2acb877cfa374d42a38a6231b977c81c
const app = document.getElementById('dv4');
const container = document.createElement('div');
container.setAttribute('class', 'row dv5');
app.appendChild(container);

const card = document.createElement('div');
card.setAttribute('class','row');

const card1 = document.createElement('div')
  card1.setAttribute('class', 'col-lg-4 dv7');


const card2 = document.createElement('div')
    card2.setAttribute('class', 'col-lg-4 dv7');


const card3 = document.createElement('div')
      card3.setAttribute('class', 'col-lg-4 dv7');


        container.appendChild(card);

            card.appendChild(card1);
            card.appendChild(card2);
            card.appendChild(card3);


var request = new XMLHttpRequest();
// var url= api+array+lastarray+key+number+max;

function pushData()
{


  //get value from input text

var text;
var inputText = document.getElementById('input1').value;

  myArr.push(inputText);



  //append data to array

  var pval ="";

  for (var i = 0; i < myArr.length; i++) {

    pval = pval + myArr[i]+"<br>";


  }


  //display array data
  document.getElementById('data1').innerHTML= pval;
  // return   add(myArr);


}
function add() {
   var text ="";
   for (var i = 0; i < myArr.length; i++) {
     text= text+myArr[i]+",+"
   }

  var url = api+text+myArr[0]+key+number+max;
  request.open('GET',url,true);
  request.onload = function(){
    var data = JSON.parse(this.response)
    var dt1 = data[0];
    var dt2 = data[1];
    var dt3 = data[2];
    var dtb1 = "";
    var dtb2 = "";
    var dtb3 = "";

    for (var i = 0; i < dt1.missedIngredientCount; i++) {
 dtb1 = dtb1 + JSON.stringify(dt1.missedIngredients[i].name)+",";
    }
    for (var i = 0; i < dt2.missedIngredientCount; i++) {
 dtb2 = dtb1 + JSON.stringify(dt2.missedIngredients[i].name)+",";
    }
    for (var i = 0; i < dt3.missedIngredientCount; i++) {
 dtb3 = dtb1 + JSON.stringify(dt3.missedIngredients[i].name)+",";
    }

    console.log(dtb1);
    console.log(dtb2);
    console.log(dtb3);



    for (var i = 0; i < data.length; i++) {
      id.push(data[i].id);
    }

display(id);






// card 1
  const h2c1 = document.createElement('h2');
  h2c1.textContent = dt1.title;

  const imagec1 = document.createElement('img');
  imagec1.setAttribute('src',dt1.image);

  const pc1 = document.createElement('p');
  pc1.textContent = "missing ingredients: "+dtb1;







  card1.appendChild(h2c1);
  card1.appendChild(imagec1);
  card1.appendChild(pc1);



// card 2

const h2c2 = document.createElement('h2');
h2c2.textContent = dt2.title;

const imagec2 = document.createElement('img');
imagec2.setAttribute('src',dt2.image);

const pc2 = document.createElement('p');
pc2.textContent = "missing ingredients: "+dtb2;

const bt2 = document.createElement('button');
bt2.setAttribute('class','btn btn-dark btn2');




card2.appendChild(h2c2);
card2.appendChild(imagec2);
card2.appendChild(pc2);



// card 3
const h2c3 = document.createElement('h2');
h2c3.textContent = dt3.title;

const imagec3 = document.createElement('img');
imagec3.setAttribute('src',dt3.image);

const pc3 = document.createElement('p');
pc3.textContent = "missing ingredients: "+dtb3;

const bt3 = document.createElement('button');
bt3.setAttribute('class','btn btn-dark btn3');



card3.appendChild(h2c3);
card3.appendChild(imagec3);
card3.appendChild(pc3);









// console.log(recipe.image)

}


request.send();
}


function display(id){
  var nut = "/information?includeNutrition=false/"
  var at ="https://api.spoonacular.com/recipes/"
console.log(id);


   var url1 = at+id[0]+nut+key
   var url2 = at+id[1]+nut+key;
   var url3 = at+id[2]+nut+key;

     request.open('GET',url1,true);

      request.onload = function(){
         var data1 = JSON.parse(this.response);

         var p21 = document.getElementsByClassName('a1');
         this.setAttribute('href',data1.sourceUrl);



        }

        request.send();
//
// dispay1(url2);
// dispay2(url3);
// //



}


function dispay1(url2) {

  var ob2 = new XMLHttpRequest();
  ob2.open('GET',url2,true);
  ob2.onload = function(){
    var data2 = JSON.parse(this.response);
     var p11 = document.getElementsByClassName('a2');
      // p11.href = data2.sourceUrl;
    this.setAttribute('href',data2.sourceUrl);


  }
  ob2.send();

}
function dispay2(url3) {



  request.open('GET',url3,true);

   request.onload = function(){
      var data3 = JSON.parse(this.response);
       var p31 = document.getElementsByClassName('a3');
      p31.href=data3.sourceUrl;





     }

     request.send();



}
