import { postData } from '../services/services.js';
import { openModal, closeModal } from './modal.js';

export default function forms(formSelector) {
  const forms = document.querySelectorAll(formSelector);
	const messages = {
		loading: `Загрузка`,
		success: `Отправлено успешно`,
		fail: `Неудача`
	};

	forms.forEach((item) => bindPostData(item));	

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
		const prevModalDialog = document.querySelector(`.modal__dialog`),
			modal = document.querySelector('.modal');

		prevModalDialog.classList.add(`hide`);
		openModal(modal);

		const thanksModal = document.createElement(`div`);
		thanksModal.classList.add(`modal__dialog`);
		thanksModal.innerHTML = `
			<div class='modal__content'>
				<div class='modal__close'>×</div>
				<div class='modal__title'>${message}</div>
			</div>
		`;
		
		modal.append(thanksModal);
		
		let closeThanksModalTimeout = setTimeout(() => {
			closeThanksModal();
		}, 3000);
		
		thanksModal.querySelector(`.modal__close`).addEventListener(`click`, () => {
			clearTimeout(closeThanksModalTimeout);
			closeThanksModal();
		});

		function closeThanksModal() {
			closeModal(modal);
			thanksModal.remove();
			prevModalDialog.classList.remove(`hide`);
		}
	}
}