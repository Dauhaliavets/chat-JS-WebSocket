import Cookies from 'js-cookie';
import UI from './view';
import { END_POINT, sendRequest } from './api';

let token = Cookies.get('token');
let userName;
let userMail;

const socket = new WebSocket(
	`ws://chat1-341409.oa.r.appspot.com/websockets?${token}`
);

socket.onopen = function () {
	console.log(`[open]`);

	socket.onmessage = function (e) {
		console.log(`[message]`);
		console.log(`message ${e.data}`);
		showMessageWS(e.data);
	};
};
/*
	Functions
*/
async function initialize() {
	let responseMe = await sendRequest(END_POINT.me, 'GET', token);
	userName = responseMe.name;
	userMail = responseMe.email;

	// let { messages } = await sendRequest(END_POINT.messages, 'GET', token);

	// if (messages.length) {
	// 	messages.forEach((msg) => showMessage(msg));
	// }
}

initialize();

function generateTemplateMessage(source, text, time, isMe) {
	const cloneTemplate = UI.CHAT.templateMes.content.cloneNode(true);
	const messageTmpl = cloneTemplate.querySelector('.message');
	if (isMe) {
		messageTmpl.classList.add('message__my');
	} else {
		messageTmpl.classList.add('message__other');
	}
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
			settingsSubmit(name);
		}
	});
}

async function settingsSubmit(name) {
	let response = await sendRequest(END_POINT.user, 'PATCH', token, {
		name: name,
	});
	userName = response.name;
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

async function autorizationSubmit(e) {
	const email = e.target[0].value;

	let responseAuth = await sendRequest(END_POINT.user, 'POST', token, {
		email: email,
	});
	console.log('responseAuth: ', responseAuth);
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
		e.preventDefault();
		confirmSubmit(e);
		removePopup();
	});
}

async function confirmSubmit(e) {
	let tokenValue = e.target[0].value;
	Cookies.set('token', tokenValue);

	token = Cookies.get('token');

	let responseConfirm = await sendRequest(END_POINT.user, 'PATCH', token, {
		name: userName,
	});
	console.log('responseConfirm: ', responseConfirm);
}

function removePopup() {
	const popup = document.querySelector('.popup__show');
	UI.container.removeChild(popup);
}

function showMessage(msg) {
	const { username, message, createAt } = msg;
	const tmpl = generateTemplateMessage(username, message, createAt);
	UI.CHAT.display.appendChild(tmpl);
}

function showMessageWS(data) {
	const { user, text, createdAt } = JSON.parse(data);
	let isMe = userMail === user.email;

	const tmpl = generateTemplateMessage(user.name, text, createdAt, isMe);
	UI.CHAT.display.appendChild(tmpl);

	UI.CHAT.wrapper.scrollTo({
		top: UI.CHAT.display.scrollHeight,
		left: 0,
		behavior: 'smooth'
	});
}

/* 
	EventListeners
 */

UI.CHAT.form.addEventListener('submit', (e) => {
	e.preventDefault();
	const textInput = e.target.firstElementChild.value;

	socket.send(JSON.stringify({ text: `${textInput}` }));

	e.target.firstElementChild.value = '';

});

UI.TOP_MENU.settingsBtn.addEventListener('click', createSettingsPopup);
UI.TOP_MENU.logoutBtn.addEventListener('click', createAutorizationPopup);
