'use strict'

require('es6-promise').polyfill()
import 'nodelist-foreach-polyfill'

import calc from './modules/calc'
import cards from './modules/cards'
import forms from './modules/forms'
import modal, { openModalWindow } from './modules/modal'
import slider from './modules/slider'
import tabs from './modules/tabs'
import timer from './modules/timer'

document.addEventListener('DOMContentLoaded', () => {
	const modalTimerId = setTimeout(
		() => openModalWindow('.modal', '.modal__content', modalTimerId),
		300000
	)

	calc()
	cards()
	forms('form', modalTimerId)
	modal('[data-modal]', '.modal__content', '.modal', modalTimerId)
	slider({
		container: '.offer__slider',
		slide: '.offer__slide',
		nextArrow: '.offer__slider-next',
		prevArrow: '.offer__slider-prev',
		totalCounter: '#total',
		currentCounter: '#current',
		wrapper: '.offer__slider-wrapper',
		field: '.offer__slider-inner',
	})
	tabs(
		'.tabheader__item',
		'.tabcontent',
		'.tabheader__items',
		'tabheader__item_active'
	)
	timer('.timer', '2024-08-25')
})
