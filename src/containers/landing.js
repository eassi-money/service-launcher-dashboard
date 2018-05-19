import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ShapeDialog from '../components/dialog';
import { style } from '../style'
import Loader, { SmallLoader } from '../components/loader'

import { signup, login } from '../actions/auth'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'


class Landing extends Component {

	state = {
		open: false,
		email: "",
		password: "",
		loading: false
	};

	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};


	componentDidMount() {
		this.setState({ loading: true })
		fetch('./config.json')
		.then(response => response.json())
		.then(json => {
			console.log(json);
			this.setState({ loading: false, data: json })
		})

	}

	render() {
		const { signup, login, signupErr, signupData, signupLoading, loginErr, loginLoading } = this.props
		
		var pattern = '\\+'
		var reg = new RegExp(pattern, '');

		const notAllowedEmail = this.state.email.search(reg) > -1 ? true : false

		return (
			<div>
				<AppBar
					showMenuIconButton={false}
					iconElementRight={<FlatButton onClick={this.handleOpen} label="Login" />}
				/>

				<ShapeDialog
					
					is_open={this.state.open}
					close={this.handleClose}
					modal_content={
						<div>
							{
								loginLoading ?
									<SmallLoader /> :
									<form style={style.modal_content} onSubmit={(e) => {
										e.preventDefault()
										login(this.state.email, this.state.password)
									}}>
										<h3>Login</h3>
										{
											loginErr ?
												<p>Error: {loginErr}</p> : null
										}
										<TextField
											value={this.state.email}
											onChange={e => this.setState({ email: e.target.value })}
											hintText="Email"
											type='email'
										/><br />
										<TextField
											value={this.state.password}
											onChange={e => this.setState({ password: e.target.value })}
											hintText="Password"
											type='password'
										/><br />
										<FlatButton
											label="Cancel"
											primary={true}
											onClick={this.handleClose}
										/>
										<FlatButton
											label="Login"
											primary={true}
											keyboardFocused={true}
											type='submit'
										/>
										<div className='row'>
											<br/>
											<Link to='/resetpassword'>Reset Password</Link>
											<br/><br/>
										</div>
									</form>
							}
						</div>
					}
				/>

				<div className='spacer'></div>
				{
					this.state.loading ?
					<Loader/> :
						<div className='row'>

							{
								signupData ?
									<div className='col-6 center row'>
										<h1 className='title'>Thank you for signing up to {signupData.company}</h1>
										<p className='subtitle'>Check your email for the link to create your password and login</p>

									</div> :
									<div className='landing-row'>
										<div className='container'>
											<h1 className='title'>{this.state.data && this.state.data.display_name}</h1>
											<p className='subtitle'>{this.state.data && this.state.data.subtitle}</p>
											{
												signupErr ?
													<p>Error: {signupErr}</p> : 
													notAllowedEmail ? <span style={style.error_color}>Email with '+' not allowed</span> : null
											}
											<form onSubmit={(e) => {
												e.preventDefault()
												signup(this.state.email)
											}}>
												
											</form>
											<br /><br />
										</div>
									</div>
							}
						</div>
				}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		signupErr: state.signup.err,
		signupData: state.signup.data,
		signupLoading: state.signup.loading,
		loginErr: state.login.err,
		loginData: state.login.data,
		loginLoading: state.login.loading
	}
}

function mapDispatchToProps(dispatch) {
	return {
		signup: bindActionCreators(signup, dispatch),
		login: bindActionCreators(login, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing)