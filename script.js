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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  
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
      const cartOl = document.querySelector('.cart__items');
      const cartLi = createCartItemElement({ sku: id, name: title, salePrice: price });
      cartOl.appendChild(cartLi);
    });
});
};

const fetchList = async () => {
  const request = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const response = await request.json();
  setListItem(response);
};

window.onload = () => fetchList();
