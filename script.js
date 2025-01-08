const cart = document.querySelector(".cart-page");
const cartIcon = document.querySelector("#cart-shop");
const closeBtn = document.getElementsByClassName("closex")[0]
let itemList = [];

let getLs = JSON.parse(localStorage.getItem("cartStorage"));
if (getLs) {
  itemList = getLs;
  itemList.forEach((x) => {
    const cartDown = document.querySelector(".appendDiv");
    let newDiv = createNewItems(x.id,x.price, x.title, x.imgSrc,x.qty);
    let passDiv = document.createElement("div");
    passDiv.innerHTML = newDiv;
    cartDown.append(passDiv);
  });
  removebtn();
  updateTotal();
}

updateCount();
cartIcon.addEventListener("click", () => {
  cart.classList.add("cart-active");
});

closeBtn.addEventListener("click", () => {
  cart.classList.remove("cart-active");
});

let productsData = "";

async function item(id) {
  await fetch("./homeapplicance.json")
    .then((res) => res.json())
    .then((data) => {
      productsData = data;
    });

  const product = productsData.filter((i) => i.filter_id === id);
  document.addEventListener("DOMContentLoaded", reloadContent);
  function reloadContent() {
    removeItem();
    payNow()
  }

  let div = `<div class="alignside">`;

  product.forEach((prod) =>
    prod.products.forEach((x) => {
      const addDiv = `
        <div class="wrapper">
          <div class="container-box">
            <span style="display:none;">${x.product_id}</span>
            <h2>${x.product_name}</h2>
            <img class="imgbox" src=${x.imgSrc} alt="product-image">
          </div>
          <div class="rupee">
            <span class="rupees">RS.${x.price}</span>
            <button  class="btn-cart">Add to cart</button>
          </div>
        </div>`;
      div += addDiv;
    })
  );

  div += `</div>`;
  document.getElementById("output").innerHTML = div;

  const cartBtns = document.querySelectorAll(".btn-cart");
  cartBtns.forEach((cartAdd) => {
    cartAdd.addEventListener("click", createCart);
  });
}


function createCart() {
  let value = getCookies("username")
  const parent = this.parentElement.parentElement;
  const price = parent.querySelector(".rupees").innerText;
  const title = parent.querySelector("h2").innerText;
  const imgSrc = parent.querySelector(".imgbox").src;
  const id = parent.querySelector("span").innerText
  const qty = 1
  if (itemList.find((items) => items.title === title)) {
    alert("Item is already added to the cart");
    return;
  }
  if(value != ""){

  const objList = {id,title, price, imgSrc,qty };
  itemList.push(objList);

  const cartDown = document.querySelector(".appendDiv");
  const newDiv = createNewItems(id,price, title, imgSrc,qty);
  const passDiv = document.createElement("div");
  passDiv.innerHTML = newDiv;
  cartDown.append(passDiv);

  removebtn();
  updateTotal();
  updateCount();
  LocalStorage();
  }else{
    let value = prompt("enter your name")
     if(value != "" && value != undefined){
      setCookies("username",value)
    }
  }
 

}

function createNewItems(id,price, title, imgSrc,qty) {
  return `
    <div class="item-content">
      <div class="box-div">
        <div class="alignname">
          <img class="cart-img" src=${imgSrc} alt="product-image" />
          <div class="adject">
            <p class="bag">${title}</p>
            <p class="price">${price}</p>
            <input onchange="ChangeQty()" class="cart-quantity" type="number" min="1" value="${qty}" />
          </div>
        </div>
        <div class="prices">
          <p class="cart-amt">${price}</p>
          <span class="trashi">
            <i class="fa-solid fa-trash"></i>
          </span>
        </div>
      </div>
      <hr class="scale"/>
    </div>`;
}

function removebtn() {
  const trashIcons = document.querySelectorAll(".trashi");
  trashIcons.forEach((trashIcon) => {
    trashIcon.addEventListener("click", function () {
        const title =this.closest(".item-content").querySelector(".bag").innerText;
        itemList = itemList.filter((el) => el.title !== title);
        this.closest(".item-content").remove();
        updateTotal();
        updateCount();
        LocalStorage();
    });
  });
}


function ChangeQty(){
  let value = document.querySelectorAll(".cart-quantity")
  let arr = []
  value.forEach((v)=>{
    console.log(v.value)
    arr.push(v.value)
  })

let updateQty  = itemList.map((x,i)=> ({...x,qty : arr[i]==0?"1":arr[i]}) )
console.log(updateQty)
 let stringy = JSON.stringify(updateQty)
localStorage.setItem("cartStorage",stringy)
}

function updateTotal() {
  const cartItems = document.querySelectorAll(".item-content");
  let total = 0;

  cartItems.forEach((item) => {
    const price = parseFloat(
      item.querySelector(".price").innerText.replace("RS.", "")
    );
    const qty = item.querySelector(".cart-quantity").value;
    const amount = price * qty;
    item.querySelector(".cart-amt").innerText = `RS.${amount}`;
    total += amount;

    item
      .querySelector(".cart-quantity")
      .addEventListener("change", () => updateTotal());
  });
  document.getElementById("totalpay").innerHTML = total
  document.querySelector(".total-price").innerText = `RS.${total}`;
}

function updateCount() {
  const cartCount = itemList.length;
  const getCount = document.querySelector(".cart-count");
  getCount.innerHTML = cartCount;
  if (cartCount == 0) {
    getCount.style.display = "none";
  } else {
    getCount.style.display = "block";
    const indication = document.querySelector("#noProducts");
    indication.style.display = "none";
  }
  getCount.style.display = cartCount === 0 ? "none" : "block";
}

function carsouel() {
  document.getElementById("output").innerHTML = `
    <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">     
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="./imageCarsouel/shop.jpg" class="d-block w-100" alt="...">
        </div>
        <div class="carousel-item">
          <img src="./imageCarsouel/homeapplicance.jpg" class="d-block w-100" alt="...">
        </div>
        <div class="carousel-item">
          <img src="./imageCarsouel/Food.jpg" class="d-block w-100" alt="...">
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>`;
}
const online = document.getElementsByClassName("online")[0]
function checkOut(){
  online.classList.add('atmCard')
  document.getElementById("bg").style.opacity = "0.2"
}

const closeAtm = document.getElementsByClassName("closecard")[0]
closeAtm.addEventListener("click",()=>{
  online.classList.remove('atmCard')
    document.getElementById("bg").style.opacity = "1"
})

function payNow(){
  const isCardNum = document.getElementsByClassName("cardInp")[0].value
  const month = document.getElementById("month").value
  const cvv = document.getElementsByClassName("cv")[0].value
  const holder = document.getElementById("holder").value
  const year = document.getElementById("year").value
  console.log(year)
  if(isCardNum.length != 16){
    alert("Invalid card number!")
  }else if(month>12){
    alert("Invalid month!")
  }else if(cvv.length != 3){
    alert("Invalid Cvv!")
  }else if(!holder){
    alert("Enter card holder name!")
  }else if(year<24){
    alert("Invalid year!")
  }
  else{
    alert("Order placed.Happy shopping!!!")
      location.reload()
      localStorage.removeItem("cartStorage")
      online.classList.remove('atmCard')
      document.getElementById("bg").style.opacity = "1"
   
  }
 

}

function setCookies(name,value){
	let partOne = name+"="+value
	let d = new Date()
	d.setMinutes(d.getMinutes()+2)
	let fullcookie = partOne+";expires="+d.toUTCString()+";path=/"
	document.cookie = fullcookie
}

function getCookies(name){
	let partone=name+"="
	let allCookie = decodeURIComponent(document.cookie)
	let splitCookie = allCookie.split(";")
	for(let i=0;i<splitCookie.length;i++){
		let checkCookie = splitCookie[i].indexOf(partone)
		if(checkCookie != -1){
			let value = splitCookie[i].substring(splitCookie[i].indexOf("=")+1)
			if(value == ""){
				continue
			}else{
				return value
			}
		}
	}
	return ""
}



function LocalStorage() {
  localStorage.setItem("cartStorage", JSON.stringify(itemList));
}
