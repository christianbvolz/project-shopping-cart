const cartClass = '.cart__items';
const btnEmptyCart = document.querySelector('.empty-cart');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const updateLocalStorage = () => {
  const cart = document.querySelector(cartClass).children;
  const cartInfos = [];
  for (let index = 0; index < cart.length; index += 1) {
    cartInfos.push(cart[index].innerHTML);
  }
  localStorage.setItem('cart', JSON.stringify(cartInfos));
};

const totalPrice = () => {
  const cartSection = document.querySelector('.cart');
  const cart = JSON.parse(localStorage.getItem('cart'));
  const total = cart.reduce((acc, item) => {
    let itemPrice = item.split('$');
    itemPrice = parseFloat(itemPrice[itemPrice.length - 1]);
    return acc + itemPrice;
  }, 0);
  if (document.querySelector('.total-price')) {
    const spanTotalPrice = document.querySelector('.total-price');
    spanTotalPrice.innerText = total;
  } else {
    const spanTotalPrice = createCustomElement('span', 'total-price', total);
    cartSection.appendChild(spanTotalPrice);
  }
};

function cartItemClickListener(event) {
  const cartOl = document.querySelector(cartClass);
  const cartLi = event.target;
  cartOl.removeChild(cartLi);
  updateLocalStorage();
  totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const setListItem = (response) => {
  response.results.forEach(({ id, title, thumbnail, price }) => {
    const sectionItem = document.querySelector('.items');
    const productItem = createProductItemElement({ sku: id, name: title, image: thumbnail });
    sectionItem.appendChild(productItem);
    const btn = productItem.lastChild;
    btn.addEventListener('click', () => {
      const cartOl = document.querySelector(cartClass);
      const cartLi = createCartItemElement({ sku: id, name: title, salePrice: price });
      cartOl.appendChild(cartLi);
      updateLocalStorage();
      totalPrice();
    });
});
};

const fetchList = async () => {
  const request = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const response = await request.json();
  setListItem(response);
};

const cartSaved = () => {
  const cart = JSON.parse(localStorage.getItem('cart'));
  const cartOl = document.querySelector(cartClass);
  if (cart) {
    for (let index = 0; index < cart.length; index += 1) {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = cart[index];
      li.addEventListener('click', cartItemClickListener);
      cartOl.appendChild(li);
    }
  }
  totalPrice();
};

window.onload = () => fetchList().then(() => cartSaved());
btnEmptyCart.addEventListener('click', () => {
  const cartOl = document.querySelector(cartClass);
  const cartOlChildren = document.querySelector(cartClass).children;
  Array.from(cartOlChildren).forEach((element) => {
    cartOl.removeChild(element);
  });
  updateLocalStorage();
  totalPrice();
});
