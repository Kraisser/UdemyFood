window.addEventListener('DOMContentLoaded', function() {

		// Tabs
		
	let tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {				
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	}

	function showTabContent(i = 0) {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	}
		
	hideTabContent();
	showTabContent();

	tabsParent.addEventListener('click', function(event) {
		const target = event.target;
		if(target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
		});
		
		// Timer

		const deadline = '2022-11-17';

		function getTimeRemaining(endtime) {
			const t = Date.parse(endtime) - Date.parse(new Date()),
				days = Math.floor( (t/(1000*60*60*24)) ),
				seconds = Math.floor( (t/1000) % 60 ),
				minutes = Math.floor( (t/1000/60) % 60 ),
				hours = Math.floor( (t/(1000*60*60) % 24) );

			return {
				'total': t,
				'days': days,
				'hours': hours,
				'minutes': minutes,
				'seconds': seconds
			};
		}

		function getZero(num){
			if (num >= 0 && num < 10) { 
				return '0' + num;
			} else {
				return num;
			}
		}

		function setClock(selector, endtime) {

			const timer = document.querySelector(selector),
				days = timer.querySelector("#days"),
				hours = timer.querySelector('#hours'),
				minutes = timer.querySelector('#minutes'),
				seconds = timer.querySelector('#seconds'),
				timeInterval = setInterval(updateClock, 1000);

			updateClock();

			function updateClock() {
				const t = getTimeRemaining(endtime);

				days.innerHTML = getZero(t.days);
				hours.innerHTML = getZero(t.hours);
				minutes.innerHTML = getZero(t.minutes);
				seconds.innerHTML = getZero(t.seconds);

				if (t.total <= 0) {
					clearInterval(timeInterval);
				}
			}
		}

		setClock('.timer', deadline);

		// Modal

		const modalTrigger = document.querySelectorAll('[data-modal]'),
			modal = document.querySelector('.modal');

		modalTrigger.forEach(btn => {
			btn.addEventListener('click', openModal);
		});

		function closeModal() {
			modal.classList.add('hide');
			modal.classList.remove('show');
			document.body.style.overflow = '';
		}

		function openModal() {
			modal.classList.add('show');
			modal.classList.remove('hide');
			document.body.style.overflow = 'hidden';
			// clearInterval(modalTimerId);
		}

		modal.addEventListener('click', (e) => {
			if (e.target === modal || e.target.getAttribute(`data-close`) == '') {
				closeModal();
			}
		});

		document.addEventListener('keydown', (e) => {
			if (e.code === "Escape" && modal.classList.contains('show')) { 
				closeModal();
			}
		});

		// const modalTimerId = setTimeout(openModal, 3000);

		// function showModalByScroll() {
		//     if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
		//         openModal();
		//         window.removeEventListener('scroll', showModalByScroll);
		//     }
		// }
		// window.addEventListener('scroll', showModalByScroll);

		// Классы для карточек
		class MenuCard {
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

	// Forms

	const forms = document.querySelectorAll(`form`);
	const messages = {
		loading: `Загрузка`,
		success: `Отправлено успешно`,
		fail: `Неудача`
	};

	// forms.forEach((item) => bindPostData(item));

	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: data
		});

		return await res.json();
	}

	const getData = async (url) => {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Fetch Fail ${url}, error(${res.status})`);
		}

		return await res.json();
	}

	const formDataToJSON = formData => Object.fromEntries(formData.entries());
	

	function bindPostData(form) {
		form.addEventListener(`submit`, (e) => {
			e.preventDefault();

			const statusMessage = document.createElement(`div`);
			statusMessage.classList.add(`status`);
			statusMessage.textContent = messages.loading;
			form.append(statusMessage);

			const formData = new FormData(form);
			const formDataObj = formDataToJSON(formData);
			
			postData(`http://localhost:3000/requests`, JSON.stringify(formDataObj))
				.then((data) => {
				console.log(data);
				showThanksModal(messages.success);
							
				statusMessage.remove();
			}).catch((e) => {
				showThanksModal(messages.fail);
				console.log(new Error(e));
			}).finally(() => form.reset());
		})
	}

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector(`.modal__dialog`);

		prevModalDialog.classList.add(`hide`);
		openModal();

		const thanksModal = document.createElement(`div`);
		thanksModal.classList.add(`modal__dialog`);
		thanksModal.innerHTML = `
			<div class='modal__content'>
				<div class='modal__close'>×</div>
				<div class='modal__title'>${message}</div>
			</div>
		`;

		document.querySelector(`.modal`).append(thanksModal);

		setTimeout(() => {
			closeModal();
			thanksModal.remove();
			prevModalDialog.classList.remove(`hide`);
		}, 4000);

	}

	// getData(`http://localhost:3000/menu`)
	// 	.then(data => {
	// 		data.forEach(({ img, altimg, title, descr, price }) => {
	// 			new MenuCard(`.menu .container`, img, altimg, title, descr, price).renderElement()
	// 		})
	// 	});

	// Slider

	class Slider {
		constructor(mainSliderContainer, carouselWrapper, slides, prevBut, nextBut, currSlideDisplay, maxSlidesDisplay) {
			this.mainSliderContainer = document.querySelector(mainSliderContainer);
			this.carouselWrapper = document.querySelector(carouselWrapper);
			this.slides = this.carouselWrapper.querySelectorAll(slides);
			this.maxSlides = this.slides.length;

			this.prevBut = this.mainSliderContainer.querySelector(prevBut);
			this.nextBut = this.mainSliderContainer.querySelector(nextBut);

			this.currSlideDisplay = document.querySelector(currSlideDisplay);
			this.maxSlidesDisplay = document.querySelector(maxSlidesDisplay);

			this.currSlide = 0;
			this.mainWidth = window.getComputedStyle(this.mainSliderContainer).width.match(/\d+/)[0];

			this.mainSliderContainer.style.position = `relative`;
			this.mainSliderContainer.insertAdjacentHTML(`beforeend`, `<div class="carousel-indicators"></div>`);
			this.carouselIndicatorWrapper = this.mainSliderContainer.querySelector(`.carousel-indicators`);
			
			for (let i = 0; i < this.maxSlides; i++) {
				this.carouselIndicatorWrapper.insertAdjacentHTML(`beforeend`, `<div class="dot" data-slide="${i}"></div>`);
			}

			this.startSlider();
		}
		
		startSlider() {
			this.maxSlidesDisplay.innerHTML = this.maxSlides < 10 ? `0${this.maxSlides}` : this.maxSlides;

			this.mainSliderContainer.style.overflow = `hidden`;
			this.slides.forEach(slide => slide.style.width = `${this.mainWidth}`);

			this.carouselWrapper.style.display = `flex`;
			this.carouselWrapper.style.transition = `1s all`;
			this.carouselWrapper.style.width = `${this.mainWidth * this.maxSlides}px`;

			this.nextBut.addEventListener(`click`, () => this.nextSlide());
			this.prevBut.addEventListener(`click`, () => this.prevSlide());

			this.carouselIndicatorWrapper.addEventListener(`click`, (e) => this.dotSelect(e));
		}

		nextSlide() {
			this.currSlide += 1;
			this.currSlide >= this.maxSlides ? this.currSlide = 0 : this.currSlide;			
			
			this.openSlide();
		}

		prevSlide() {
			this.currSlide -= 1;
			this.currSlide < 0 ? this.currSlide = this.maxSlides - 1 : this.currSlide;			
			
			this.openSlide();
		}

		dotSelect(e) {
			if (e.target.dataset.slide) {
				this.currSlide = +e.target.dataset.slide;

				this.openSlide();
			}
		}

		openSlide() {
			this.currSlideDisplay.innerHTML = this.currSlide + 1 < 10 ? `0${this.currSlide + 1}` : this.currSlide + 1;

			this.carouselWrapper.style.transform = `translateX(-${this.mainWidth * this.currSlide}px)`;
		}
	}

	const foodSlider = new Slider(`.offer__slider`, `.offer__slider-inner`, `.offer__slide`, `.offer__slider-prev`, `.offer__slider-next`, `#current`, `#total`);

	function caloriesCalc() {
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

	caloriesCalc();

});
