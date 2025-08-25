"use strict";

let isHeaderMobileMenuInit = false;
let isBottomMobileMenuInit = false;
let isSidebarMenuInit = false;
let ismobilePopupSortInit = false;
let isQuizRawsListActionInit = false;
let openedPopup = null;

function init() {
	const mediaQuery = window.matchMedia("(max-width: 767.98px)");

	const action = () => {
		if (mediaQuery.matches) {
			headerMobileMenuAction();
			bottomMobileMenuAction();
			mobilePopupSort();

			ismobilePopupSortInit = true;
			isHeaderMobileMenuInit = true;
			isBottomMobileMenuInit = true;
		} else {
			collapsedSidebarMenu();
			quizRawsListActionToggle();
			
			isSidebarMenuInit = true;
			isQuizRawsListActionInit = true;
		}
	};

	mediaQuery.addEventListener("change", function () {
		action();
	});

	action();
}

function headerMobileMenuAction() {
	if (isHeaderMobileMenuInit) return;

	const menuTrigger = document.querySelector(".menu__icon");
	const menuBody = document.querySelector(".menu__body");
	const closeBtn = document.querySelector(".menu__close");

	menuTrigger.addEventListener("click", function () {
		togglePopup(menuBody, "menu__body--active");
		toggleSidebarMobile(true);
	});

	closeBtn.addEventListener("click", function () {
		closePopup(menuBody, "menu__body--active");
		toggleSidebarMobile(true);
	});
}

function bottomMobileMenuAction() {
	if (isBottomMobileMenuInit) return;

	const menuItems = document.querySelectorAll(".sidebar-mobile__menu-item");
	const menuMore = document.querySelector("button.sidebar-mobile__menu-action");
	const popup = document.querySelector("[data-popup='menu']");
	const closeBtn = popup.querySelector(".popup__close");

	menuMore.addEventListener("click", function (e) {
		menuItems.forEach(item =>
			item.classList.remove("sidebar-mobile__menu-item--active")
		);

		e.target.parentElement.classList.add("sidebar-mobile__menu-item--active");

		togglePopup(popup);
	});

	closeBtn.addEventListener("click", function (e) {
		closePopup(popup);
	});
}

function mobilePopupSort() {
	if (ismobilePopupSortInit) return;

	const popup = document.querySelector("[data-popup='sort']");
	const closeBtn = popup.querySelector(".popup__close");
	const triggerBtn = document.querySelector('.page__btn-sort');

	triggerBtn.addEventListener("click", function (e) {
		togglePopup(popup);
		toggleSidebarMobile(false);
	});

	closeBtn.addEventListener("click", function (e) {
		closePopup(popup);
		toggleSidebarMobile(true);
	});
}

function toggleSidebarMobile(isShow = true) {
	const sidebarMobile = document.querySelector('.sidebar-mobile');

	if (!isShow) {
		sidebarMobile.classList.add('sidebar-mobile--hidden');
	}
	else {
		sidebarMobile.classList.remove('sidebar-mobile--hidden');
	}
}

function setInteractiveMainContent() {
	const pageContent = document.querySelector('.page__content');

	if (openedPopup) {
		setTimeout(() => pageContent.style.zIndex = 0, 700);
	}
	else {
		setTimeout(() => pageContent.style.zIndex = 15, 700);
	}
}

function togglePopup(popup, cls = "popup--active") {
	if (openedPopup === popup) {
		closePopup(popup, cls);
		return;
	}

	if (openedPopup) closePopup(openedPopup);
	openPopup(popup, cls);
}

function openPopup(popup, activeClass = "popup--active") {
	popup.classList.add(activeClass);
	popup.setAttribute("data-popup-active", "");
	openedPopup = popup;
	setInteractiveMainContent();
}

function closePopup(popup, activeClass = "popup--active") {
	openedPopup = null;
	popup.classList.remove(activeClass);
	popup.removeAttribute("data-popup-active");
	setInteractiveMainContent();
}

function collapsedSidebarMenu() {
	if (isSidebarMenuInit) return;

	const sidebar = document.querySelector(".sidebar");
	const triggerBtn = sidebar.querySelector(".sidebar__trigger-btn");
	const wordsPoints = sidebar.querySelectorAll("span[data-rating-points]");

	let isCollapsed = false;

	triggerBtn.addEventListener("click", function (e) {
		isCollapsed = !isCollapsed;
		sidebar.classList.toggle("sidebar--short");

		if (isCollapsed) {
			wordsPoints.forEach(wordPoint => {
				const str = wordPoint.textContent;
				wordPoint.innerHTML = str.replace("points", "p");
			});
		} else {
			wordsPoints.forEach(wordPoint => {
				const str = wordPoint.textContent;
				wordPoint.innerHTML = str.replace("p", "points");
			});
		}
	});
}

function quizRawsListActionToggle() {
	if (isQuizRawsListActionInit) return;

	const pageItems = document.querySelector('.page__items');

	pageItems.addEventListener("click", function (e) {
		const target = e.target;
		const moreBtn = target.closest('.quiz-raw__more-btn');

		if (!moreBtn) return;

		const actionList = moreBtn.nextElementSibling;

		if (!actionList.classList.contains('quiz-raw__action-list')) return;

		moreBtn.classList.toggle('quiz-raw__more-btn--active');
		actionList.classList.toggle('quiz-raw__action-list--show');
	});
}

init();
