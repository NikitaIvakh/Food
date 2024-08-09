'use strict'

document.addEventListener('DOMContentLoaded', () => {
	// Tabs
	const tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items'),
		tabs = document.querySelectorAll('.tabheader__item')

	function hideAllTabs() {
		tabsContent.forEach(item => {
			item.classList.add('hide', 'animate__animated', 'animate__bounceIn')
			item.classList.remove('show', 'animate__animated', 'animate__bounceIn')
		})

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active')
		})
	}

	function showActiveTab(i = 0) {
		tabsContent[i].classList.remove(
			'hide',
			'animate__animated',
			'animate__bounceIn'
		)
		tabsContent[i].classList.add(
			'show',
			'animate__animated',
			'animate__bounceIn'
		)
		tabs[i].classList.add('tabheader__item_active')

		const textElements = tabsContent[i].querySelectorAll('.tabcontent__descr')
		textElements.forEach(element => {
			animateTyping(element, 20)
		})
	}

	function animateTyping(element, speed) {
		if (element.hasAttribute('data-animating')) return

		const text = element.textContent
		element.textContent = ''
		element.setAttribute('data-animating', 'true')

		let i = 0
		function type() {
			if (i < text.length) {
				element.textContent += text.charAt(i)
				i++
				setTimeout(type, speed)
			} else {
				element.removeAttribute('data-animating')
			}
		}
		type()
	}

	hideAllTabs()
	showActiveTab()

	tabsParent.addEventListener('click', event => {
		const target = event.target

		if (target && target.matches('.tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target === item) {
					hideAllTabs()
					showActiveTab(i)
				}
			})
		}
	})

	// Timer
	const deadLine = '2024-08-25'

	function getTimeRemaining(endTime) {
		let days, hours, minutes, seconds
		const t = Date.parse(endTime) - Date.parse(new Date())

		if (t <= 0) {
			days = 0
			hours = 0
			minutes = 0
			seconds = 0
		} else {
			days = Math.floor(t / (1000 * 60 * 60 * 24))
			hours = Math.floor((t / (1000 * 60 * 60)) % 24)
			minutes = Math.floor((t / 1000 / 60) % 60)
			seconds = Math.floor((t / 1000) % 60)
		}

		return {
			total: t,
			days,
			hours,
			minutes,
			seconds,
		}
	}

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`
		} else return num
	}

	function setClock(selector, endTime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(updateClock, 1000)

		updateClock()

		function updateClock() {
			const t = getTimeRemaining(endTime)

			days.textContent = getZero(t.days)
			hours.textContent = getZero(t.hours)
			minutes.textContent = getZero(t.minutes)
			seconds.textContent = getZero(t.seconds)

			if (t.total <= 0) {
				clearInterval(timeInterval)
			}
		}
	}

	setClock('.timer', deadLine)

	// Modal
	const modal = document.querySelector('.modal'),
		modalContent = modal.querySelector('.modal__content'),
		openModal = document.querySelectorAll('[data-modal]')

	openModal.forEach(item => {
		item.addEventListener('click', openModalWindow)
	})

	function openModalWindow() {
		modalContent.classList.add('animate__animated', 'animate__bounceIn')
		modal.classList.add('show')
		modal.classList.remove('hide')
		document.body.style.overflow = 'hidden'
		clearInterval(modalTimerId)
	}

	function closeModelWindow() {
		modalContent.classList.remove('animate__animated', 'animate__bounceIn')
		modal.classList.add('hide')
		modal.classList.remove('show')
		document.body.style.overflow = ''
	}

	modal.addEventListener('click', event => {
		if (
			event.target === modal ||
			event.target.getAttribute('data-close') == ''
		) {
			closeModelWindow()
		}
	})

	document.addEventListener('keydown', event => {
		if (event.code === 'Escape' && modal.matches('.show')) {
			closeModelWindow()
		}
	})

	const modalTimerId = setTimeout(openModalWindow, 50000)

	function showModalByScroll() {
		if (
			window.scrollY + document.documentElement.clientHeight >=
			document.documentElement.scrollHeight
		) {
			openModalWindow()
			window.removeEventListener('scroll', showModalByScroll)
		}
	}

	window.addEventListener('scroll', showModalByScroll)

	// Use Class for cards
	class MenuItem {
		constructor(src, alt, title, descr, price, parentSelector, ...classes) {
			this.src = src
			this.alt = alt
			this.title = title
			this.descr = descr
			this.price = price
			this.parentSelector = document.querySelector(parentSelector)
			this.classes = classes
			this.transfer = 3.2
			this.changeToBel()
		}

		changeToBel() {
			this.price = +parseFloat((this.price * this.transfer).toFixed(2))
		}

		render() {
			const element = document.createElement('div')
			if (this.classes.length === 0) {
				this.element = 'menu__item'
				element.classList.add(this.element)
			} else {
				this.classes.forEach(className => element.classList.add(className))
			}

			element.innerHTML = `
					<img src=${this.src} alt=${this.alt} />
					<h3 class="menu__item-subtitle">${this.title}</h3>
					<div class="menu__item-descr">
						${this.descr}
					</div>
					<div class="menu__item-divider"></div>
					<div class="menu__item-price">
						<div class="menu__item-cost">Цена:</div>
						<div class="menu__item-total">
							<span>${this.price}</span> BYN/день
						</div>
					</div>
				`

			this.parentSelector.append(element)
		}
	}

	const getResource = async url => {
		const res = await fetch(url)

		if (!res.ok)
			throw new Error(`Could not fetch ${url}, status: ${res.status}`)

		return await res.json()
	}

	getResource('http://localhost:3000/menu').then(data => {
		data.forEach(({ img, altimg, title, descr, price }) => {
			new MenuItem(
				img,
				altimg,
				title,
				descr,
				price,
				'.menu .container .menu__items'
			).render()
		})
	})

	// Send form

	const forms = document.querySelectorAll('form')
	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся',
		failure: 'Что-то пошло не так...',
	}

	forms.forEach(item => {
		bindPostData(item)
	})

	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: 'POST',
			body: data,
			headers: {
				'Content-type': 'application/json; charset=utf-8',
			},
		})

		return await res.json()
	}

	function bindPostData(form) {
		form.addEventListener('submit', function (event) {
			event.preventDefault()

			const statusMessage = document.createElement('img')
			statusMessage.src = message.loading
			statusMessage.classList.add('loading-elem')
			form.insertAdjacentElement('afterend', statusMessage)

			const formData = new FormData(form)
			const json = JSON.stringify(Object.fromEntries(formData.entries()))

			postData('http://localhost:3000/requests', json)
				.then(data => {
					console.log(data)
					showThanksModal(message.success)
					statusMessage.remove()
				})
				.catch(() => showThanksModal(message.failure))
				.finally(() => {
					form.reset()
				})
		})
	}

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog')

		prevModalDialog.classList.add('hide')
		openModalWindow()

		const thanksModal = document.createElement('div')
		thanksModal.classList.add('modal__dialog')
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div class="modal__close" data-close>&times;</div>
				<div class="modal__title">
					${message}
				</div>
			</div>
		`

		document.querySelector('.modal').append(thanksModal)
		setTimeout(() => {
			thanksModal.remove()
			prevModalDialog.classList.add('show')
			prevModalDialog.classList.remove('hide')
			closeModelWindow()
		}, 4000)
	}

	// Slider (Variant 2)
	const slides = document.querySelectorAll('.offer__slide'),
		slider = document.querySelector('.offer__slider'),
		previous = document.querySelector('.offer__slider-prev'),
		next = document.querySelector('.offer__slider-next'),
		slideCounterTotal = document.querySelector('#total'),
		slideCounterCur = document.querySelector('#current'),
		slidesWrapper = document.querySelector('.offer__slider-wrapper'),
		slidesField = document.querySelector('.offer__slider-inner'),
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
})
