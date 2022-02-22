import Cookies from 'js-cookie';
import UI from './view';


const URL = 'https://chat1-341409.oa.r.appspot.com/api/user';
const URL_MESSAGES = 'https://chat1-341409.oa.r.appspot.com/api/messages/';

let userName = 'Дима';

// let messages;

let token;

/* 
	EventListeners
 */
window.addEventListener('load', () => {
	token = Cookies.get('token');

	fetch('https://chat1-341409.oa.r.appspot.com/api/user/me', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	.then(response => response.json())
	.then(data => console.log("me: ", data))
	.catch(console.error)

	fetch(URL_MESSAGES, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	.then(response => response.json())
	.then(data => {
		if(data.messages.length) {
			data.messages.forEach(msg => showMessage(msg));
		}	
	});

	
});

function showMessage(msg) {
	const {username, message, createAt} = msg;
	const tmpl = generateTemplateMessage(username, message, createAt);
	UI.CHAT.display.appendChild(tmpl);
}

UI.CHAT.form.addEventListener('submit', (e) => {
	e.preventDefault();
	const inputValue = e.target.firstElementChild.value;
	const date = new Date();
	const timeSubmit = date.toTimeString().slice(0, 9);

	const tmpl = generateTemplateMessage(userName, inputValue, timeSubmit);
	UI.CHAT.display.appendChild(tmpl);

	e.target.firstElementChild.value = '';
	UI.CHAT.display.scrollIntoView(0, UI.CHAT.display.scrollHeight);
});

UI.TOP_MENU.settingsBtn.addEventListener('click', () => createSettingsPopup());
UI.TOP_MENU.logoutBtn.addEventListener('click', () => createAutorizationPopup());

/*
	Functions
*/
function generateTemplateMessage(source, text, time) {
	const cloneTemplate = UI.CHAT.templateMes.content.cloneNode(true);
	const textTmpl = cloneTemplate.querySelector('.message__text');
	const sourceTmpl = cloneTemplate.querySelector('.message__source');
	const timeTmpl = cloneTemplate.querySelector('.message__time');

	sourceTmpl.textContent = `${source}: `;
	textTmpl.textContent = text;
	timeTmpl.textContent = time;

	return cloneTemplate;
}

function generateTemplatePopup(title, subtitle, placeholder, textBtn) {
	const cloneTemplate = UI.POPUP.templatePopup.content.cloneNode(true);
	const titleTmpl = cloneTemplate.querySelector('.popup__top-title');
	const closeBtnTmpl = cloneTemplate.querySelector('.popup__top-close');
	const subtitleTmpl = cloneTemplate.querySelector('.popup-subtitle');
	const formTmpl = cloneTemplate.querySelector('.form__popup');
	const inputTmpl = cloneTemplate.querySelector('.form__popup-input');
	const btnTmpl = cloneTemplate.querySelector('.form__popup-button');

	titleTmpl.textContent = title;
	closeBtnTmpl.textContent = '+';
	subtitleTmpl.textContent = subtitle;
	inputTmpl.placeholder = placeholder;
	btnTmpl.textContent = textBtn;

	return { cloneTemplate, closeBtnTmpl, formTmpl };
}

function createSettingsPopup() {
	const { cloneTemplate, closeBtnTmpl, formTmpl } = generateTemplatePopup(
		'Настройки',
		'Имя в чате:',
		'Введите имя...',
		'Ok'
	);
	UI.container.appendChild(cloneTemplate);

	closeBtnTmpl.addEventListener('click', removePopup);

	formTmpl.addEventListener('submit', (e) => {
		e.preventDefault();
		let name = e.target[0].value;
		if (name) {
			userName = name;
			settingsSubmit(name)
		}
	});
}

function settingsSubmit(name) {
	// let token = Cookies.get('token');

	fetch(URL, {
		method: 'PATCH',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ name: name }),
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			throw new Error(`Response Error status ${response.status}`);
		})
		.then((data) => console.log(data))
		.catch(console.log());
}

function createAutorizationPopup() {
	const { cloneTemplate, closeBtnTmpl, formTmpl } = generateTemplatePopup(
		'Авторизация',
		'Почта:',
		'Введите почту...',
		'Получить код'
	);
	UI.container.appendChild(cloneTemplate);

	closeBtnTmpl.addEventListener('click', removePopup);

	formTmpl.addEventListener('submit', (e) => {
		autorizationSubmit(e);
		removePopup();
		createConfirmPopup();
	});
}

function autorizationSubmit(e) {
	e.preventDefault();
	const email = e.target[0].value;

	fetch(URL, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email: email }),
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			throw new Error(`Response Error status ${response.status}`);
		})
		.then((data) => {
			console.log(data);
			console.log('userName in response server:', userName);
		})
		.catch(console.log());
}

function createConfirmPopup() {
	const { cloneTemplate, closeBtnTmpl, formTmpl } = generateTemplatePopup(
		'Подтверждение',
		'Код:',
		'Введите код...',
		'Войти'
	);
	UI.container.appendChild(cloneTemplate);

	closeBtnTmpl.addEventListener('click', removePopup);

	formTmpl.addEventListener('submit', (e) => {
		confirmSubmit(e);
		removePopup();
	});
}

function confirmSubmit(e) {
	e.preventDefault();
	let tokenValue = e.target[0].value;
	Cookies.set('token', tokenValue);

	token = Cookies.get('token');

	fetch(URL, {
		method: 'PATCH',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${tokenValue}`,
		},
		body: JSON.stringify({ name: userName }),
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			throw new Error(`Response Error status ${response.status}`);
		})
		.then((data) => console.log(data))
		.catch(console.log());
}

function removePopup() {
	const popup = document.querySelector('.popup__show');
	UI.container.removeChild(popup);
}