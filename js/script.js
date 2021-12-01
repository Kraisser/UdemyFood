import '../css/style.css';
import '../css/styles.css'

import caloriesCalc from './modules/caloriesCalc.js';
import forms from './modules/forms.js';
import MenuCard from './modules/MenuCard.js';
import modal from './modules/modal.js';
import Slider from './modules/Slider.js';
import tabs from './modules/tabs.js';
import timer from './modules/timer.js';
import { getData } from './services/services.js';
import { openModal } from './modules/modal.js';

window.addEventListener('DOMContentLoaded', function () {

	const foodSlider = new Slider(`.offer__slider`, `.offer__slider-inner`, `.offer__slide`, `.offer__slider-prev`, `.offer__slider-next`, `#current`, `#total`);
	
  const modalTimerId = setTimeout(() => openModal(document.querySelector(`.modal`), modalTimerId), 30000);

	getData(`http://localhost:3000/menu`)
		.then(data => {
			data.forEach(({ img, altimg, title, descr, price }) => {
				new MenuCard(`.menu .container`, img, altimg, title, descr, price).renderElement();
			})
		});

	caloriesCalc();
	modal();
	tabs(`.tabheader__item`, '.tabcontent', '.tabheader__items', 'tabheader__item_active');
	timer('2022-11-17', '.timer');
	forms(`form`);

});
