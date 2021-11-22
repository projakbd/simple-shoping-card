document.addEventListener("DOMContentLoaded", function (event) {
    var scrollpos = localStorage.getItem('scrollpos');
    if (scrollpos) window.scrollTo(0, scrollpos);

    cartBtn()
});

window.onbeforeunload = function (e) {
    localStorage.setItem('scrollpos', window.scrollY);
};


//Show shoping cart Item
//Select UI Element
const cartIcon = document.getElementsByClassName('cartIcon')[0];
const addToCart = document.getElementsByClassName('cartBtn');
const cartList = document.getElementsByClassName('cartRow')[0];
const count = document.getElementsByClassName('count')[0];
const total = document.getElementById("total");

//addEventListener
cartIcon.addEventListener('click', cartShow)

for (let i = 0; i < addToCart.length; i++) {
    addToCart[i].addEventListener('click', (e) => {
        addProduct(e, i)
    })
}

//Define Function

function cartShow(e) {
    let cartContainer = document.getElementsByClassName('cart-container')[0]
    if (cartContainer.style.display === "block") {
        cartContainer.style.display = "none";
        cartIcon.classList.remove("active");
    } else {
        cartContainer.style.display = "block";
        cartIcon.classList.add("active");
    }
}

function addProduct(e, item) {
    let productImg = document.getElementsByClassName('imgSrc')[item].src.trim()
    let productTitle = document.getElementsByClassName('title')[item].innerText.trim()
    let productPrice = document.getElementsByClassName('soldPrice')[item].innerText.trim()

    let products = { id: item, quantity: 1, image: productImg, title: productTitle, price: productPrice }

    toStorage(products, item);
    // localStorage.setItem(item, items)

    // console.log(productImg)
    // console.log(productTitle)
    // console.log(productPrice)
}

// const all = {};
// console.log(all)

function toStorage(products, item) {
    const product = {
    };
    product[`item${item}`] = products

    if (localStorage.getItem('Cart') === null) {
        const add = JSON.stringify(product);
        localStorage.setItem('Cart', add)
    } else {
        let cart = JSON.parse(localStorage.getItem('Cart'))
        if (cart[`item${item}`]) {
            cart[`item${item}`].quantity++
            const add = JSON.stringify(cart);
            localStorage.setItem('Cart', add)

        } else {
            const merge = Object.assign(cart, product)
            const add = JSON.stringify(merge);
            localStorage.setItem('Cart', add)
        }
    }
    cartBtn()

}



function cartBtn() {
    cartList.innerHTML = null
    const cart = JSON.parse(localStorage.getItem('Cart'));
    for (let item in cart) {
        const createLi = document.createElement('tr');
        createLi.className = "cartItem";
        createLi.innerHTML = `
            <td><img class="cartImg" src="${cart[item].image}" alt="img"></td>
            <td>
                <h5 class="cartTitle"><span>${cart[item].title}</span>
                </h5>
            </td>
            <td>
                <h5 class="cartPrice">${cart[item].price} BDT</h5>
            </td>
            <td><input class="cartQuantity" type="number" value="${cart[item].quantity}" onchange="changeQuantity(event)"></td>
            <td> <input type="hidden" class="id" value="${cart[item].id}"><button class="cartItemDelete" onclick="deleteItem(event)">DELETE</button></td>
            `
        cartList.appendChild(createLi);
    }

    updateTotal();
    updateCount();
}


function updateCount() {
    if (localStorage.getItem('Cart') !== null) {
        count.innerText = `${Object.keys(JSON.parse(localStorage.getItem('Cart'))).length}`;
    }
}

function clearAll() {
    localStorage.removeItem('Cart');
    count.innerText = `0`;
    cartBtn();
}


function deleteItem(event) {
    let id = event.target.parentElement.parentElement.getElementsByClassName('id')[0].value
    const cart = JSON.parse(localStorage.getItem('Cart'));
    for (let item in cart) {
        if (cart[item].id == id) {
            delete cart[item]
            let add = JSON.stringify(cart)
            localStorage.setItem('Cart', add)
        }
    }
    cartBtn()
}

// console.log(Object.keys(JSON.parse(localStorage.getItem('Cart')))[0])


function changeQuantity(event) {
    if (event.target.value === 0 || event.target.value < 1) {
        event.target.value = 1;
    } else {
        let quantity = event.target.value
        let id = event.target.parentElement.nextElementSibling.children[0].value
        const cart = JSON.parse(localStorage.getItem('Cart'));
        for (let item in cart) {
            if (cart[item].id == id) {
                cart[item].quantity = quantity
                let add = JSON.stringify(cart)
                localStorage.setItem('Cart', add)
            }
        }

    }
    cartBtn();

}

function updateTotal() {
    if (localStorage.getItem('Cart') !== null) {
        const cart = JSON.parse(localStorage.getItem('Cart'));
        let totalPrice = 0;
        for (let item in cart) {
            const price = cart[item].price * cart[item].quantity
            totalPrice += price
        }
        total.innerText = totalPrice;
    }
}
