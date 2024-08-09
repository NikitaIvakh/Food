'use strict'

function tabs(
	tabsSelector,
	tabsContentSelector,
	tabsParentSelector,
	activeClass
) {
	const tabsContent = document.querySelectorAll(tabsContentSelector),
		tabsParent = document.querySelector(tabsParentSelector),
		tabs = document.querySelectorAll(tabsSelector)

	function hideAllTabs() {
		tabsContent.forEach(item => {
			item.classList.add('hide', 'animate__animated', 'animate__bounceIn')
			item.classList.remove('show', 'animate__animated', 'animate__bounceIn')
		})

		tabs.forEach(item => {
			item.classList.remove(activeClass)
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
		tabs[i].classList.add(activeClass)

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

		if (target && target.classList.contains(tabsSelector.slice(1))) {
			tabs.forEach((item, i) => {
				if (target === item) {
					hideAllTabs()
					showActiveTab(i)
				}
			})
		}
	})
}

export default tabs
