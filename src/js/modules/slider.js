'use strict'

function slider({
	container,
	slide,
	nextArrow,
	prevArrow,
	totalCounter,
	currentCounter,
	wrapper,
	field,
}) {
	const slides = document.querySelectorAll(slide),
		slider = document.querySelector(container),
		previous = document.querySelector(prevArrow),
		next = document.querySelector(nextArrow),
		slideCounterTotal = document.querySelector(totalCounter),
		slideCounterCur = document.querySelector(currentCounter),
		slidesWrapper = document.querySelector(wrapper),
		slidesField = document.querySelector(field),
		width = window.getComputedStyle(slidesWrapper).width

	let slideIndex = 1
	let offset = 0

	if (slides.length < 10) {
		slideCounterTotal.textContent = `0${slides.length}`
		slideCounterCur.textContent = `0${slideIndex}`
	} else {
		slideCounterTotal.textContent = slides.length
		slideCounterCur.textContent = slideIndex
	}

	slidesField.style.width = 100 * slides.length + '%'
	slidesField.style.display = 'flex'
	slidesField.style.transition = '0.5s all'
	slidesWrapper.style.overflow = 'hidden'

	slides.forEach(slide => {
		slide.style.width = width
	})

	slider.style.position = 'relative'

	const indicators = document.createElement('ol'),
		dots = []
	indicators.classList.add('carousel-indicators')
	slider.append(indicators)

	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li')
		dot.setAttribute('data-slide-to', i + 1)
		dot.classList.add('dot')

		if (i == 0) {
			dot.classList.add('active-dot')
		}

		indicators.append(dot)
		dots.push(dot)
	}

	function slideParameters() {
		if (slides.length < 10) slideCounterCur.textContent = `0${slideIndex}`
		else slideCounterCur.textContent = slideIndex

		dots.forEach(dot => (dot.style.opacity = '.5'))
		dots[slideIndex - 1].style.opacity = '1'
	}

	function convertWidth(str) {
		return +str.replace(/\D/g, '')
	}

	next.addEventListener('click', function () {
		if (offset == convertWidth(width) * (slides.length - 1)) {
			offset = 0
		} else offset += convertWidth(width)

		slidesField.style.transform = `translateX(-${offset}px)`

		if (slideIndex == slides.length) slideIndex = 1
		else slideIndex++

		slideParameters()
	})

	previous.addEventListener('click', function () {
		if (offset == 0) offset = convertWidth(width) * (slides.length - 1)
		else offset -= convertWidth(width)

		slidesField.style.transform = `translateX(-${offset}px)`

		if (slideIndex == 1) slideIndex = slides.length
		else slideIndex--

		slideParameters()
	})

	dots.forEach(dot => {
		dot.addEventListener('click', function (event) {
			const slideTo = event.target.getAttribute('data-slide-to')

			slideIndex = slideTo
			offset = convertWidth(width) * (slideTo - 1)
			slidesField.style.transform = `translateX(-${offset}px)`

			slideParameters()
		})
	})
}

export default slider
