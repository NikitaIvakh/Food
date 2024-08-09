'use strict'

function modals() {
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
}

module.exports = modals
