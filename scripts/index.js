const UI = {
	container: document.querySelector('.container'),
	TOP_MENU: {
		settingsBtn: document.querySelector('.button__settings'),
		logoutBtn: document.querySelector('.button__logout'),
	},
	POPUP : {
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
const URL = 'https://chat1-341409.oa.r.appspot.com/api/user';

let userName = 'Дима';


/* 
	EventListeners
 */
UI.CHAT.form.addEventListener('submit', (e) => {
	e.preventDefault();
	const inputValue = e.target.firstElementChild.value;
	const date = new Date()
	const timeSubmit = date.toTimeString().slice(0, 9);

	const tmpl = generateTemplateMessage(userName, inputValue, timeSubmit);
	UI.CHAT.display.appendChild(tmpl);

	e.target.firstElementChild.value = '';
	UI.CHAT.display.scrollIntoView(0, UI.CHAT.display.scrollHeight)
});

UI.TOP_MENU.settingsBtn.addEventListener('click', () => {
	const {cloneTemplate, closeBtnTmpl, formTmpl} = generateTemplatePopup('Настройки', 'Имя в чате:', 'Введите имя...', 'Ok');
	UI.container.appendChild(cloneTemplate);

	closeBtnTmpl.addEventListener('click', removePopup);
	formTmpl.addEventListener('submit', (e) => {
		e.preventDefault();
		if(e.target[0].value){
			userName = e.target[0].value;
			e.target[0].value = '';
		}
	});
});

UI.TOP_MENU.logoutBtn.addEventListener('click', () => {
	const {cloneTemplate, closeBtnTmpl, formTmpl} = generateTemplatePopup('Авторизация', 'Почта:', 'Введите почту...', 'Получить код');
	UI.container.appendChild(cloneTemplate);

	closeBtnTmpl.addEventListener('click', removePopup);
	formTmpl.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = e.target[0].value;

		fetch(URL, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({email: email})
		})
		.then(response => {
			if(response.ok) {
				return response.json()
			}
			throw new Error(`Response Error status ${response.status}`)
		})
		.then(data => console.log(data))
		.catch(console.log())
	})
});




/*
	Functions
*/
function removePopup(){
	const popup = document.querySelector('.popup__show');
	UI.container.removeChild(popup);
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

	return {cloneTemplate, closeBtnTmpl, formTmpl};
}

function generateTemplateMessage(source, value, time) {
	const cloneTemplate = UI.CHAT.templateMes.content.cloneNode(true);
	
	const textTmpl = cloneTemplate.querySelector('.message__text');
	const sourceTmpl = cloneTemplate.querySelector('.message__source');
	const timeTmpl = cloneTemplate.querySelector('.message__time');

	sourceTmpl.textContent = `${source}: `;
	textTmpl.textContent = value;
	timeTmpl.textContent = time;
	
	return cloneTemplate;
}
