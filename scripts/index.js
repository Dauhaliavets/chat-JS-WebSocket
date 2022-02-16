console.log('Hello');

const UI = {
	SETTINGS: {
		btn: document.querySelector('.button__settings'),
		dispalay: document.querySelector('.settings'),
		closeBtn: document.querySelector('.settings__top-close'),
	},
	CHAT: {
		dispalay: document.querySelector('.chat__screen'),
		template: document.querySelector('#template'),
		form: document.querySelector('.form__chat'),
		formInput: document.querySelector('.form__chat-input'),
		formBtn: document.querySelector('.form__chat-button'),
	},
};

UI.SETTINGS.btn.addEventListener('click', () => {
	UI.SETTINGS.dispalay.classList.add('settings__show');
});
UI.SETTINGS.closeBtn.addEventListener('click', () => {
	UI.SETTINGS.dispalay.classList.remove('settings__show');
});

function generateTemplate(source, value, time) {
	const cloneTemplate = UI.CHAT.template.content.cloneNode(true);
	
	const textTmpl = cloneTemplate.querySelector('.message__text');
	const sourceTmpl = cloneTemplate.querySelector('.message__source');
	const timeTmpl = cloneTemplate.querySelector('.message__time');

	sourceTmpl.textContent = source;
	textTmpl.textContent = value;
	timeTmpl.textContent = time;
	
	return cloneTemplate;
}

UI.CHAT.form.addEventListener('submit', (e) => {
	e.preventDefault();
	const inputValue = e.target.firstElementChild.value;
	const date = new Date()
	const timeSubmit = date.toTimeString().slice(0, 9);

	const tmpl = generateTemplate('Я: ', inputValue, timeSubmit);
	UI.CHAT.dispalay.appendChild(tmpl);

	e.target.firstElementChild.value = '';
});
