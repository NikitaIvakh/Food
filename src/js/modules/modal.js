'use strict'

function openModalWindow(modalSelector, modalContentSelector, modalTimerId) {
	const modal = document.querySelector(modalSelector),
		modalContent = modal.querySelector(modalContentSelector)

	modalContent.classList.add('animate__animated', 'animate__bounceIn')
	modal.classList.add('show')
	modal.classList.remove('hide')
	document.body.style.overflow = 'hidden'

	if (modalTimerId) {
		clearInterval(modalTimerId)
	}
}

function closeModelWindow(modalSelector, modalContentSelector) {
	const modal = document.querySelector(modalSelector),
		modalContent = modal.querySelector(modalContentSelector)

	modalContent.classList.remove('animate__animated', 'animate__bounceIn')
	modal.classList.add('hide')
	modal.classList.remove('show')
	document.body.style.overflow = ''
}

function modal(
	triggerSelector,
	modalContentSelector,
	modalSelector,
	modalTimerId
) {
	const modal = document.querySelector(modalSelector),
		modalTrigger = document.querySelectorAll(triggerSelector)

	modalTrigger.forEach(item => {
		item.addEventListener('click', () =>
			openModalWindow(modalSelector, modalContentSelector, modalTimerId)
		)
	})

	modal.addEventListener('click', event => {
		if (
			event.target === modal ||
			event.target.getAttribute('data-close') == ''
		) {
			closeModelWindow(modalSelector, modalContentSelector)
		}
	})

	document.addEventListener('keydown', event => {
		if (event.code === 'Escape' && modal.matches('.show')) {
			closeModelWindow(modalSelector, modalContentSelector)
		}
	})

	function showModalByScroll() {
		if (
			window.scrollY + document.documentElement.clientHeight >=
			document.documentElement.scrollHeight
		) {
			openModalWindow(modalSelector, modalContentSelector, modalTimerId)
			window.removeEventListener('scroll', showModalByScroll)
		}
	}

	window.addEventListener('scroll', showModalByScroll)
}

export default modal
export { closeModelWindow, openModalWindow }
