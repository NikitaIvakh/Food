'use strict'

import { getResource } from '../services/services'

function cards() {
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
}

export default cards
