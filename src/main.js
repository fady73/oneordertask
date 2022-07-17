let shop = document.getElementById("shop");

let basket = JSON.parse(localStorage.getItem("data")) || [];
let label = document.getElementById("label");
let ShoppingCart = document.getElementById("shopping-cart");

let allProducts = [];

let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

const getAllProduct = async () => {
    const response = await fetch('https://fakestoreapi.com/products');
    const myJson = await response.json();
    return myJson

}

let TotalAmount = () => {
    if (basket.length !== 0) {
        let amount = basket
            .map((product) => {
                let { item, id } =product;
                let search = allProducts.find((y) => y.id === id) || [];

                return item * search.price;
            })
            .reduce((x, y) => x + y, 0);
        label.innerHTML = `
    <h2>Total Bill : $ ${amount.toFixed(2)}</h2>
    <button onclick="clearCart()" class="removeAll">Clear Cart</button>
    `;
    } else return;
};

let generateCartItems = () => {
    TotalAmount();
    calculation();
    if (basket.length !== 0) {
        return (ShoppingCart.innerHTML = basket
            .map((product ) => {
                let { id, item } = product;
                let search = allProducts.find((y) => y.id === id) || [];
                let { image, title, price} = search;

                return `
      <div class="cart-item">
        <img src=${image} alt="" />
        <div class="details">

          <div class="title-price-x">
              <h4 class="title-price">
                <p>${title}</p>
                <p class="cart-item-price">$ ${price}</p>
              </h4>
              <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
          </div>

          <div class="buttons">
              <div onclick="decrement(${id})" class="bi bi-dash-lg"> - </div>
              <div id=${id} class="quantity">${item}</div>
              <div onclick="increment(${id})" class="bi bi-plus-lg"> + </div>
          </div>

          <h3>$ ${item * price}</h3>
        </div>
      </div>
      `;
            })
            .join(""));
    } else {
        ShoppingCart.innerHTML = ``;
        label.innerHTML = `
    <h2>Cart is Empty</h2>
    `;
    }

};

let generateShop = () => {
    getAllProduct().then(allProduct => {
        allProducts = [...allProduct]
        generateCartItems();
        return (shop.innerHTML = allProduct.map((x) => {
            let { id, title, price, image } = x;
            return `
          <div id=product-id-${id} class="item">
              <div class="text-center"><img src=${image} alt=""></div>
              <div class="details">
                <h3>${title}</h3>
                <div class="price-quantity">
                  <h2>$ ${price} </h2>
                  <div class="buttons">
                     <div onclick="increment(${id})" class="bi bi-plus-lg"> ADD + </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        })
            .join(""));
    })
};

generateShop();


let increment = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem);

    if (search === undefined) {
        basket.push({
            id: selectedItem,
            item: 1,
        });
    } else {
        search.item += 1;
    }

    generateCartItems();
    calculation();
    TotalAmount();
    localStorage.setItem("data", JSON.stringify(basket));
};

let decrement = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem);

    if (search === undefined) return;
    else if (search.item === 0) return;
    else {
        search.item -= 1;
    }
    calculation();
    TotalAmount();
    basket = basket.filter((x) => x.item !== 0);
    generateCartItems();
    localStorage.setItem("data", JSON.stringify(basket));
};

calculation();

let removeItem = (id) => {
    let selectedItem = id;
    basket = basket.filter((x) => x.id !== selectedItem.id);
    generateCartItems();
    TotalAmount();
    localStorage.setItem("data", JSON.stringify(basket));
};

let clearCart = () => {
    basket = [];
    generateCartItems();
    localStorage.setItem("data", JSON.stringify(basket));
};

