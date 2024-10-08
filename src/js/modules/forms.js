'use strict'

import { postData } from '../services/services'
import { closeModelWindow, openModalWindow } from './modal'

function forms(formSelector, modalTimerId) {
	const forms = document.querySelectorAll(formSelector)
	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся',
		failure: 'Что-то пошло не так...',
	}

	forms.forEach(item => {
		bindPostData(item)
	})

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
		openModalWindow('.modal', '.modal__content', modalTimerId)

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
			closeModelWindow('.modal', '.modal__content')
		}, 4000)
	}
}

export default forms
