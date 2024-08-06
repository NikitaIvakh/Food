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
		event.preventDefault()
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
		openModal = document.querySelectorAll('[data-modal]'),
		closeModal = document.querySelector('[data-close]')

	function openModalWindow() {
		modalContent.classList.add('animate__animated', 'animate__bounceIn')
		modal.classList.toggle('show')
		document.body.style.overflow = 'hidden'
		clearInterval(modalTimerId)
	}

	openModal.forEach(item => {
		item.addEventListener('click', event => {
			event.preventDefault()
			openModalWindow()
		})
	})

	function closeModelWindow() {
		modalContent.classList.remove('animate__animated', 'animate__bounceIn')
		modal.classList.toggle('show')
		document.body.style.overflow = ''
	}

	closeModal.addEventListener('click', event => {
		event.preventDefault()
		closeModelWindow()
	})

	modal.addEventListener('click', event => {
		event.preventDefault()

		if (event.target == modal) {
			closeModelWindow()
		}
	})

	document.addEventListener('keydown', event => {
		event.preventDefault()

		if (event.code === 'Escape' && modal.matches('.show')) {
			closeModelWindow()
		}
	})

	const modalTimerId = setTimeout(openModalWindow, 15000)

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
		constructor(src, alt, title, descr, price, parentSelector) {
			this.src = src
			this.alt = alt
			this.title = title
			this.descr = descr
			this.price = price
			this.transfer = 3.2
			this.parentSelector = document.querySelector(parentSelector)
			this.changeToBel()
		}

		changeToBel() {
			this.price = +parseFloat((this.price * this.transfer).toFixed(2))
		}

		render() {
			const element = document.createElement('div')
			element.innerHTML = `
					<div class="menu__item">
						<img src=${this.src} alt=${this.alt} />
						<h3 class="menu__item-subtitle">${this.title}</h3>
						<div class="menu__item-descr">
							${this.descr}
						</div>
						<div class="menu__item-divider"></div>
						<div class="menu__item-price">
							<div class="menu__item-cost">Цена:</div>
							<div class="menu__item-total"><span>${this.price}</span> BYN/день</div>
						</div>
					</div>
				`

			this.parentSelector.append(element)
		}
	}

	new MenuItem(
		'img/tabs/vegy.jpg',
		'vegy',
		'Меню "Фитнес"',
		'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
		10,
		'.menu .container'
	).render()

	new MenuItem(
		'img/tabs/elite.jpg',
		'elite',
		'Меню “Премиум”',
		'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
		14,
		'.menu .container'
	).render()

	new MenuItem(
		'img/tabs/post.jpg',
		'post',
		'Меню "Постное"',
		'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
		12,
		'.menu .container'
	).render()
})
