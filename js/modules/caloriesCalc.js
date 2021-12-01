export default function caloriesCalc() {
  const mainWrapper = document.querySelector(`.calculating__field`),
    sexChooseWrapper = mainWrapper.querySelector(`#gender`),
    resultWrapper = mainWrapper.querySelector(`.calculating__result`),
    activityWrapper = mainWrapper.querySelector(`#activityChoose`);

  let info = {};

  getInputValue(`#height`);
  getInputValue(`#weight`);
  getInputValue(`#age`);
  
  sexChooseWrapper.addEventListener(`click`, e => {
    if (e.target.classList.contains(`calculating__choose-item`)) {
      sexChooseWrapper.querySelectorAll(`.calculating__choose-item`).forEach(item => item.classList.remove(`calculating__choose-item_active`));
      e.target.classList.add(`calculating__choose-item_active`);
      info.sex = e.target.getAttribute(`id`);
    }

    calc();
  });

  activityWrapper.addEventListener(`click`, e => {
    if (e.target.dataset.ratio) {
      activityWrapper.querySelectorAll(`.calculating__choose-item`).forEach(item => item.classList.remove(`calculating__choose-item_active`));
      e.target.classList.add(`calculating__choose-item_active`);
      info.activityRatio = e.target.dataset.ratio;
    }

    calc();
  });

  function getInputValue (selector) {
    const input = mainWrapper.querySelector(selector);

    input.addEventListener(`input`, (e) => {
      if (parseFloat(e.target.value)) {
        info[e.target.getAttribute(`id`)] = parseFloat(e.target.value);
      }
    })

    calc();
  }

  function calc() {
    if (info.sex && info.height && info.weight && info.age && info.activityRatio) {
      if (info.sex === `male`) {
        let calories = Math.round((88.36 + (13.4 * info.weight) + (4.8 * info.height) - (5.7 * info.age)) * info.activityRatio);
        resultWrapper.innerHTML = `<span>${calories}</span> ккал`;
      } else if (info.sex = `female`) {
        let calories = Math.round((447.6 + (9.2 * info.weight) + (3.1 * info.height) - (4.3 * info.age)) * info.activityRatio);
        resultWrapper.innerHTML = `<span>${calories}</span> ккал`;
      }
    }
  }
}