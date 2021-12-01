export default class MenuCard {
  constructor(parentSelector, src, alt, title, description, price) {
    this.parentElement = document.querySelector(parentSelector);
    this.src = src;
    this.alt = alt;
    this.title = title;
    this.description = description;
    this.price = price;
    this.transfer = 27;

    this.changeToUAH();
  }

  changeToUAH() {
    this.price = this.price * this.transfer;
  }

  renderElement() {

    let element = `
      <div class="menu__item">
        <img src=${this.src} alt=${this.alt}>
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.description}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
      </div>`;

    this.parentElement.insertAdjacentHTML(`beforeend`, element);
  }
}