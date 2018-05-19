import React, {Component} from 'react'
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux'
import Loader from './components/loader'
import Nav from './containers/nav'
import Home from './containers/home'
import Wallet from './containers/wallet/'
import Perks from './containers/perks'
import Rewards from './containers/rewards'
import Landing from './containers/landing'
import SetPassword from './containers/set_password'
import ResetPassword from './containers/reset_password'
import Count from './containers/count'
import RewardRequests from './containers/reward_requests'
import { style } from './style/index'
import { callApi, makeMuiTheme } from './utils'

import { configureStore } from './store'
import { 
	purpleA700, purple50, grey600, white,
} from 'material-ui/styles/colors';

const themes = {
	'1': makeMuiTheme('#61338C', '#F1C246', '#D9DAE2', '#ffffff'),
	'2': makeMuiTheme(purpleA700, grey600, purple50, white),
	'3': makeMuiTheme('#ff9900','#d4c068','#bed39b','#ffcc5c'),
	'4': makeMuiTheme('#99ccff','#ccccff','#b3ccff','#e6ccff'),
	'5': makeMuiTheme('#008ce6','#00b3cc','#00d9b3','#00ff99'),
	'6': makeMuiTheme('#d93366','#66ccff','#b36699','#8c99cc')
}

let initial_theme = '1';
let initial_bg = '1'//localStorage.getItem('bg') === '1' || localStorage.getItem('bg') === undefined ? 1 : 2;

let muiTheme = themes[initial_theme];
let bgImage = "url('/1/bg1.svg')";

switch (localStorage.getItem('theme')) {
	case null:
	case undefined:
		localStorage.setItem('theme', initial_theme);
		break;
	case '1':
		muiTheme = themes['1'];
		bgImage = "url('/1/bg" + initial_bg + ".svg')";
		break;

	case '2':
		muiTheme = themes['2'];
		bgImage = "url('/2/bg" + initial_bg + ".svg')";
		break;

	case '3':
		muiTheme = themes['3'];
		bgImage = "url('/3/bg" + initial_bg + ".svg')";
		break;

	case '4':
		muiTheme = themes['4'];
		bgImage = "url('/4/bg" + initial_bg + ".svg')";
		break;

	case '5':
		muiTheme = themes['5'];
		bgImage = "url('/5/bg" + initial_bg + ".svg')";
		break;

	case '6':
		muiTheme = themes['6'];
		bgImage = "url('/6/bg" + initial_bg + ".svg')";
		break;
	default:
		break;
}

const store = configureStore()
// Protect routes after login works
export default class extends Component {

	componentDidMount() {
		const token = localStorage.getItem('token')

		if (token) {
			const route = process.env.REACT_APP_REHIVE_API_URL + '/user/'
			callApi('GET', route, token)
				.then(json => {
					if (json.status !== 'success') {
						this.logoutInvalidToken()
					}
				})
				.catch(err => {
					this.logoutInvalidToken()
				})
		}
	}

	logoutInvalidToken = () => {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		window.location = '/'
	}

render() {
		const token = localStorage.getItem('token')

		const user_data = JSON.parse(localStorage.getItem('user'))
		const isAdmin = user_data && user_data.groups.filter(i => i.name === 'admin').length > 0;

		const nav_routes = ['/', '/wallet', '/rewards', '/perks']

		if (isAdmin) {
			nav_routes.push('/reward_requests')
		}



		return (
			<Provider store={store}>
				{
					muiTheme && typeof muiTheme === 'object' ?
					<MuiThemeProvider muiTheme={muiTheme}>
					<Router>
						<div style={style.bodyBg(bgImage)}>
							<div className='main-land'>
								{
									token ?
										<div className='main'>
											{
												nav_routes.map((route, index) => (
													<Route key={index} exact path={route} component={Nav} />
												))
											}
											<Route exact path='/' component={Home} />
											<Route exact path='/wallet' component={Wallet} />
											<Route exact path='/rewards' component={Rewards} />
											<Route exact path='/perks' component={Perks} />
											{
												isAdmin ?
													<Route exact path='/reward_requests' component={RewardRequests} /> :
													null
											}
										</div> :
										<div>
											<Route exact path='/' component={Landing} />
											<Route exact path='/setpassword' component={SetPassword} />
										</div>
								}
								<div>
									<Route exact path='/resetpassword' component={ResetPassword} />
									<Route exact path='/count' component={Count} />
								</div>
							</div>
						</div>
					</Router>
				</MuiThemeProvider> :
				<Loader/>
				}
			</Provider>
		)
	}
}