let pageName = document.getElementById("pageName");
let root = document.getElementById("root");
let menu = document.getElementById("menu");
let cart = document.getElementById("cart");

let saveName = document.getElementById("saveName");
let userName = document.getElementById("userName");

// saveNameBtn.addEventListener("click", () => {
//     let setName = saveName.value;
//     localStorage.setItem("user", setName);
//     printLoggedInUser();
// })

// KOLLA OM DET FINNS EN USER
if (localStorage.getItem("user")) {
    console.log("Det finns en user");
    printLoggedInUser();
} else {
    console.log("Det finns ingen user");
    printLoginForm();
}

// KOLLA OM DET FINNS EN KUNDVAGN
if (localStorage.getItem("cart")) {
    console.log("Finns en kundvagn");
    printCart();
} else {
    console.log("Skapar tom kundvagn");
    let cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    printCart();
}

function printLoginForm() {
    // PRINTA LOGIN FORM
    let loginForm = document.createElement("input");
    let loginBtn = document.createElement("button");
    loginBtn.innerText = "logga in";

    loginBtn.addEventListener("click", () => {
        localStorage.setItem("user", loginForm.value);
        printLoggedInUser();
    })
    userName.innerHTML = "";
    userName.append(loginForm, loginBtn);
}

function printLoggedInUser() {
    userName.innerText = localStorage.getItem("user");
    let logoutBtn = document.createElement("button")
    logoutBtn.innerText = "logga ut";

    let printUserName = document.createElement("span");
    printUserName.innerText = "Hej " + localStorage.getItem("user") +"!";

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        printLoginForm();
    })

    userName.innerHTML = "";
    userName.append(printUserName, logoutBtn)
}

fetch("http://localhost:8888/rest/wp-json/")
.then(res => res.json())
.then(data => {
    console.log("data", data);
    pageName.innerText = data.name + " - " + data.description;
})
.catch(err => console.log("err", err));


fetch("http://localhost:8888/rest/wp-json/wp/v2/pages") 
.then(res => res.json())
.then(data => {
    console.log("posts", data);
    printPages(data);
})

function printPages(pages) {
    let ul = document.createElement("ul")
    pages.map(page => {
        console.log("page", page.title.rendered);
        let li = document.createElement("li")
        li.innerText = page.title.rendered;

        ul.appendChild(li)
    })
    menu.appendChild(ul);
}

fetch("http://localhost:8888/rest/wp-json/wc/store/products")
.then(res => res.json())
.then(data => {
    console.log("produkter", data);
    printProductList(data);
})

function printProductList(products) {
    let ul = document.createElement("ul")
    
    products.map(product => {
        let li = document.createElement("li")
        li.innerText = product.name;

        li.addEventListener("click", () => {
            console.log("Click på produkt", product.id);

            // HÄMTA
            let cart = JSON.parse(localStorage.getItem("cart"))
            console.log("cart från LS", cart);

            // ÄNDRA
            cart.push(product.id);

            // SPARA
            localStorage.setItem("cart", JSON.stringify(cart))
            printCart();
        })

        ul.appendChild(li)
    })
    menu.appendChild(ul);
}

function printCart() {
    if(JSON.parse(localStorage.getItem("cart")).length > 0) {
        console.log("Finns produkter");
        cart.innerText = "En massa produkter";
    } else {
        console.log("Tom kundvagn");
        cart.innerText = "Inga produkter"
    }
}