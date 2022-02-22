const UI = {
	container: document.querySelector('.container'),
	TOP_MENU: {
		settingsBtn: document.querySelector('.button__settings'),
		logoutBtn: document.querySelector('.button__logout'),
	},
	POPUP: {
		templatePopup: document.querySelector('#template__popup'),
	},
	CHAT: {
		display: document.querySelector('.chat__screen'),
		templateMes: document.querySelector('#template__message'),
		form: document.querySelector('.form__chat'),
		formInput: document.querySelector('.form__chat-input'),
		formBtn: document.querySelector('.form__chat-button'),
	},
};

export default UI;