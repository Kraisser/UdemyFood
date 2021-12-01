export default class Slider {
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