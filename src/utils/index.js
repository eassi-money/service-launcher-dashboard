import getMuiTheme from 'material-ui/styles/getMuiTheme';

export const callApi = (method, route, token, data) => {

	let headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}

	if (token) { 
		if (
			route.search('accounts/') > -1 || 
			route.search('transactions/') > -1 ||
			route.search('admin/') > -1 ||
			route.search('request/') > -1 ||
			route.search(process.env.REACT_APP_REHIVE_API_URL + '/user/') > -1
		) {
			headers['Authorization'] = `Token ${token}`
		} else {
			headers['Authorization'] = `Bearer ${token}`
		}
	}

	let config = {
		// credentials: 'include',
		method,
		mode: 'cors',
		headers
	}

	if (data) { config['body'] = JSON.stringify(data) }

	return Promise.resolve(
		fetch(route, config)
		.then(response => response.json())
		.catch(err => err)
	)
}

export const makeMuiTheme = (color1, color2, color3, canvasColor) => (
	getMuiTheme({
		palette: {
			primary1Color: color1,
			primary2Color: color2,
			primary3Color: color3,
			canvasColor,
			accent1Color: color1,
			accent2Color: color2,
			accent3Color: color3,
		},
		appBar: {
		},
	})
)