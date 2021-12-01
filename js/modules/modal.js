export default function modal() {
  const modalTrigger = document.querySelectorAll('[data-modal]'),
		modal = document.querySelector('.modal');

  modalTrigger.forEach(btn => {
    btn.addEventListener('click', () => openModal(modal));
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute(`data-close`) == '') {
      closeModal(modal);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === "Escape" && modal.classList.contains('show')) { 
      closeModal(modal);
    }
  });

  function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal(modal);
      window.removeEventListener('scroll', showModalByScroll);
    }
  }
  window.addEventListener('scroll', showModalByScroll);

}

function closeModal(target) {
  target.classList.add('hide');
  target.classList.remove('show');
  document.body.style.overflow = '';
}

function openModal(target, modalTimerId) {
  target.classList.add('show');
  target.classList.remove('hide');
  document.body.style.overflow = 'hidden';
  if (modalTimerId) {
    clearInterval(modalTimerId);
  }
}

export { openModal, closeModal };