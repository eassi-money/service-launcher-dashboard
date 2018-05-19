import React, { Component } from 'react'
import muiThemeable from 'material-ui/styles/muiThemeable';
import { FlatButton } from 'material-ui'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List'
import FontIcon from 'material-ui/FontIcon'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { logout } from '../actions/auth'
import { style } from '../style/'

class Nav extends Component {
	constructor(props) {
		super(props)
		this.state = {
			open: false
		}
	}

	render() {
		const { history, match, logout, muiTheme } = this.props
		const { path } = match

		const { primary1Color } = muiTheme.palette
		const user_data = JSON.parse(localStorage.getItem('user'))
		
		const isAdmin = user_data && user_data.groups.filter(i => i.name === 'admin').length > 0;
		const icon_folder =  '/' + localStorage.getItem('theme');

		const drawer_contents = [
			<img style={style.drawer_logo} key={0} alt='logo' src={icon_folder + '/icon_top.svg'} />,
			
			<MenuItem
				key={6}
				style={style.drawer_link_highlight(path, '/', primary1Color)}
				onClick={() => history.push('/')}>
				<span style={style.drawer_link}>Home</span>
			</MenuItem>,

			<MenuItem
				key={2}
				style={style.drawer_link_highlight(path, '/wallet', primary1Color)}
				onClick={() => history.push('/wallet')}>
				<span style={style.drawer_link}>Bank</span>
			</MenuItem>,

			<MenuItem
				key={3}
				style={style.drawer_link_highlight(path, '/rewards', primary1Color)}
				onClick={() => history.push('/rewards')}>
				<span style={style.drawer_link}>Earn</span>
			</MenuItem>,

			<MenuItem
				key={4}
				style={style.drawer_link_highlight(path, '/perks', primary1Color)}
				onClick={() => history.push('/perks')}>
				<span style={style.drawer_link}>Spend</span>
			</MenuItem>
		]

		if (isAdmin) {
			drawer_contents.push(
				<MenuItem
					key={5}
					style={style.drawer_link_highlight(path, '/reward_requests', primary1Color)}
					onClick={() => history.push('/reward_requests')}>
					<span style={style.drawer_link}>Requests</span>
				</MenuItem>,
			)
		}

		drawer_contents.push(
			<List key={drawer_contents.length + 1} style={style.user_nav_view}>
				<ListItem
					className='center'
					onClick={() => window.open('https://rehive.com', '_blank')}
					secondaryText="Powered by Rehive"
				/>
				<ListItem
					disabled
					className='center'
					onClick={() => history.push('/')}
					primaryText={user_data.username}
					secondaryText={user_data.email}
				/>
				{
					isAdmin ?
					<ListItem
						className='center'
						onClick={() => {
							switch (localStorage.getItem('theme')) {
								case '6' || undefined || null:
									localStorage.setItem('theme', 1);
									break;
							
								case '1':
									localStorage.setItem('theme', 2);
									break;
							
								case '2':
									localStorage.setItem('theme', 3);
									break;

								case '3':
									localStorage.setItem('theme', 4);
									break;

								case '4':
									localStorage.setItem('theme', 5);
									break;
								
								case '5':
									localStorage.setItem('theme', 6);
									break;
								default:
									break;
							}
							window.location.reload();
						}}
						primaryText={"Toggle Theme"}
					/> : null
				}
				{
					isAdmin ?
					<ListItem
						className='center'
						onClick={() => {
							switch (localStorage.getItem('bg')) {
								case '2':
								case null:
								case undefined:
									localStorage.setItem('bg', 1);
									break;
							
								case '1':
									localStorage.setItem('bg', 2);
									break;
								default:
									break;
							}
							window.location.reload();
						}}
						primaryText={"Toggle Background"}
					/> : null
				}
			</List>
		)

		return (
			<div>
				<br />
				<FontIcon onClick={() => { this.setState({ open: !this.state.open }) }} style={style.nav_menu_icon} className="material-icons">menu</FontIcon>
				<FlatButton onClick={() => logout()} style={style.logout_btn} label="Logout" />
				<FlatButton onClick={() => window.location.reload()} style={style.logout_btn} label="Refresh" />
				<br/>
				<Drawer onClick={() => this.setState({ open: false })} className="drawer">
					{ drawer_contents.map(i => i) }
				</Drawer>
				<Drawer width={225} docked={false} onRequestChange={() => this.setState({ open: false })} open={this.state.open} className="mobile_drawer">
					{ drawer_contents.map(i => i) }
				</Drawer>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		data: state.login
	}
}

function mapDispatchToProps(dispatch) {
	return {
		logout: bindActionCreators(logout, dispatch)
	}
}

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(Nav))