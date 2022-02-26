const URL = 'https://chat1-341409.oa.r.appspot.com/api/';

const END_POINT = {
	user: 'user/',
	me: 'user/me/',
	messages: 'messages/',
};

async function sendRequest(endPoint, method, token, body) {
	let requestUrl = `${URL}${endPoint}`;

	let options = {
		method: `${method}`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	};

	if (method !== 'GET') {
		options.body = JSON.stringify(body);
	}

	// console.log('requestUrl: ', requestUrl);
	// console.log('options: ', options);


	return await fetch(requestUrl, options)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			throw new Error(`Response Error status ${response.status}`);
		})
		.catch(console.error);
}

export { URL, END_POINT, sendRequest };
