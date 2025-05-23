const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

// LISTA
let cart = []


// Abrir o modal o carrinho
cartBtn.addEventListener("click", function() {
  updateCartModal();
  cartModal.style.display = "flex"
})

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(e){
  if(e.target === cartModal){
    cartModal.style.display = "none"
  }
})

// Botão de fechar
closeModalBtn.addEventListener("click", function(){
  cartModal.style.display = "none"
})
// CAPTURAR CLIQUE NO BOTÂO PARA ADD NO CARRINHO
menu.addEventListener("click", function(e){
  let parentButton = e.target.closest(".add-to-cart-btn")
  if(parentButton) {
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))
    // ADICIONAR NO CARRINHO
    addToCart(name,price)
  }
})

// FUNÇÂO PARA ADD NO CARRINHO
function addToCart(name, price){
  const existingItem = cart.find(item => item.name === name)

  if(existingItem) {
    // SE O ITEM JÁ EXISTE, AUMENTA A QUANTIDADE +1
    existingItem.quantity += 1;
    }else{
      cart.push({
        name,
        price,
        quantity: 1,
      })
    }

  updateCartModal()

}

// ATUALIZA CARRINHO
function updateCartModal(){
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>  

        <button class="remove-from-cart-btn" data-name="${item.name}">
          Remover
        </button>
        
        
      </div>
    `

    // SOMA TOTAL
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement)

  })

  cartTotal.textContent = total.toLocaleString("pt-BR",{
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;

}

// FUNÇÂO PARA REMOVER ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", function(e){
  if(e.target.classList.contains("remove-from-cart-btn")){
    const name = e.target.getAttribute("data-name")

    removeItemCart(name);
  }

})

function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name);

  if(index !== -1){
    const item = cart[index];

    if(item.quantity > 1){
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();

  }
}

// INPUT ENDEREÇO

addressInput.addEventListener("input", function(e){
  let inputValue = e.target.value;

  if(inputValue !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }
})

// FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", function(){

  const isOpen = checkRestauranteIsOpen();
  if(!isOpen){
    
    Toastify({
      text: "Ops, o restaurante está fechado no momento",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();

    return;
  }

  if(cart.length === 0) return;

  if(addressInput.value === ""){
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
  }

  // ENVIAR O PEDIDO PARA API WhatsappWeb
  const cartItems = cart.map((item) => {
    return (
      ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
    ) 
  }).join("")

  const message = encodeURIComponent(cartItems)
  const phone = "14998407153"

  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

  cart.length = []
  updateCartModal();
})

// VERFICAR A HORA E MANIPULAR O CARD HORARIO
function checkRestauranteIsOpen(){
  const data = new Date();
  const hora = data.getHours();
  return hora >= 19 && hora < 23;  
  // true = aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestauranteIsOpen();

if(isOpen){
  spanItem.classList.remove("bg-red-500")
  spanItem.classList.add("bg-green-600")
}else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}
