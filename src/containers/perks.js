import React, { Component } from 'react'
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField/TextField';
import { RaisedButton, FlatButton } from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Loader from '../components/loader'
import { BigNumber } from 'bignumber.js' 
import company_data from './config.json'
import { addPerkData, deletePerkData } from '../actions/admin'
import ShapeDialog from '../components/dialog'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getPerkData } from '../actions/perk'
import { createSend } from '../actions/transaction'

import { callApi } from '../utils'

import { style } from '../style/'

class Market extends Component {
	constructor(props) {
		super(props)
		this.state = {
			perk_name: '',
			perk_amount: false,
			modal_type: false,
			
			// For add
			name: "",
			description: "",
			amount: '',
			user_limit: '',

			// For delete
			delete_name: null
		}
	}


	render() {
		const { data, createSend, debit_data, debit_loading, debit_error, addPerkData, deletePerkData, muiTheme } = this.props
		const { primary3Color } = muiTheme.palette
		const user_data = JSON.parse(localStorage.getItem('user'))
		const isAdmin = user_data && user_data.groups.filter(i => i.name ===  'admin').length > 0;
		const icon_folder =  '/' + localStorage.getItem('theme');

		return (
			<div className='container'>
				{
					isAdmin ?
					<ShapeDialog
						is_open={this.state.modal_type ? true : false}
						close={() => this.setState({ modal_type: null })}
						modal_content={<div style={style.modal_content}>
							<h3>{this.state.modal_type === "Delete" ? "Delete Perk" : "Add Perk" }</h3>
							<form onSubmit={(e) => {
								e.preventDefault()
								let data
								const token = localStorage.getItem('token')
	
								
								 if (this.state.modal_type === "Add") {
									data = { 
										company: process.env.REACT_APP_COMPANY_IDENTIFIER,
										perk_name: this.state.name, 
										description: this.state.description,
										perk_amount: this.state.amount,
										user_limit: this.state.user_limit
									}
									addPerkData(data, token)
								} else {
									deletePerkData(this.state.delete_name, token)
								}
							}}>
								{
									this.state.modal_type !== "Delete" ?
									<div>
											<TextField
												value={this.state.name}
												onChange={e => this.setState({ name: e.target.value })}
												hintText={this.state.modal_type + " Name"}
												type='text'
											/><br />
											<TextField
												value={this.state.description}
												onChange={e => this.setState({ description: e.target.value })}
												hintText={this.state.modal_type + " Description"}
												type='text'
											/><br />
											<TextField
												value={this.state.amount}
												onChange={e => this.setState({ amount: e.target.value })}
												hintText="Amount"
												type='number'
											/><br />
											<TextField
												value={this.state.user_limit}
												onChange={e => this.setState({ user_limit: e.target.value })}
												hintText={this.state.modal_type + " User Limit"}
												type='number'
											/><br />
									</div> :
									<h5>Are you sure you want to delete this perk?</h5>
								}
								<FlatButton
									label="Cancel"
									primary={true}
									onClick={() => this.setState({ modal_type: null, delete_name: null })}
								/>
								<FlatButton
									label={this.state.modal_type === "Delete" ? "Delete" : "Add"}
									primary={true}
									keyboardFocused={true}
									type='submit'
								/>
							</form>
						</div>}
					/> : null
				}
				<ShapeDialog
					is_open={this.state.perk_amount ? true : false}
					close={() => this.setState({ perk_amount: ''})}
					modal_content={<div style={style.perk_modal_content}>
						<h3>Are you sure you want to purchase this perk?</h3>
						{
							debit_error ?
								<h3>{debit_error}</h3> : null
						}
						<form onSubmit={(e) => {
							e.preventDefault()
							const data = {
								reference: company_data.admin_email,
								currency: user_data && user_data.currency && user_data.currency.code,
								amount: this.state.perk_amount,
								company: process.env.REACT_APP_COMPANY_IDENTIFIER
							}

							const route = process.env.REACT_APP_API_URL + '/user/perk/'
							const token = localStorage.getItem('token')

							callApi('POST', route, token, {"company": process.env.REACT_APP_COMPANY_IDENTIFIER, "perk_name": this.state.perk_name })
								.then(json => {
									if (json.status === 'success') {
										createSend(data)
									}
								})
								.catch(err => {
									console
									.log("ERROR ", err)
								})
						}}>
							<FlatButton
								label="Cancel"
								primary={true}
								onClick={() => this.setState({ perk_amount: '' })}
							/>
							<FlatButton
								label="Yes"
								primary={true}
								keyboardFocused={true}
								type='submit'
							/>
						</form>
					</div>}
				/>
				<div >
					<br />
					{
						debit_loading ?
						<Loader/> :
						<div>
								{
									debit_data ?
										<div className='col-12'>
											<Paper style={style.transaction_card} zDepth={3}>
												<div className='container center'>
													<br />
													<h3>Successfully Bought</h3>
													<br />
												</div>
											</Paper>
											<br />
										</div> :
										<div className='row'>
											<div className='col-12'>
												<Paper style={style.card_header(primary3Color)} zDepth={3}>
													<div style={style.card_left}>
														<img style={style.card_left_img} src={icon_folder + '/icon2.svg'} alt='earn' />
													</div>
													<div style={style.card_right} className='right'>
														<h3>Purchase Perks</h3>
														<p>Use your tokens to buy Supporter perks!</p>
														{ isAdmin ? <RaisedButton fullWidth={true} onClick={() => this.setState({ modal_type: "Add" })} className="f-right" primary={true} label="Add Perk" /> : null}
													</div>
												</Paper>
												<br />
											</div>
											{
												data && data.length > 0 ?
													data.map((item, index) => {
														
														const x = new BigNumber(item.perk_amount)
														const perk_amount = x.dividedBy(10000000).toString()
														return (
															<div key={index} className='col-6'>
																<Paper style={style.curr_card} zDepth={3}>
																	{
																		isAdmin ?
																		<i style={style.settings_close} onClick={() => this.setState({ modal_type: "Delete", delete_name: item.identifier })} className="material-icons f-right">close</i> :
																		null
																	}
																	<div className='container'>
																		<img style={style.card_img} alt='logo' src={icon_folder + '/icon2.svg'} />
																		<div style={style.card_left_curr} className='row'>
																			<h3 className='card-heading'>{item.perk_name}</h3>
																			<span>{item.description}</span>
																			<h2 className='card-heading'>{perk_amount} {user_data && user_data.currency && user_data.currency.code}</h2>
																		</div>
																		<RaisedButton onClick={() => this.setState({ perk_amount: item.perk_amount, perk_name: item.perk_name })} className="f-left" primary={true} label="Buy"/>
																	</div>
																</Paper>
																<br />
															</div>
														)
													}) :
													<div className='col-12'>
														<Paper style={style.transaction_card} zDepth={3}>
															<div className='container center'>
																<br />
																<h3>No perks</h3>
																<br />
															</div>
														</Paper>
														<br />
													</div>
											}
										</div>
								}
						</div>
					}
				</div>
			</div>
		)
	}
}

class MarketContainer extends Component {
	componentDidMount() {
		const user_data = JSON.parse(localStorage.getItem('user'))
		this.props.getPerkData(user_data.company)
	}

	render() {
		const { 
			loading, 
			data, 
			createSend, 
			debit_data, 
			debit_loading, 
			debit_error, 
			addPerkData, 
			deletePerkData, 
			add_result, 
			muiTheme 
		} = this.props

		if (add_result) {
			window.location.reload()
		}

		return (
			<div>
				{
					loading ?
					<Loader/> :
					<Market 
						debit_data={debit_data} 
						debit_loading={debit_loading} 
						debit_error={debit_error} 
						createSend={createSend} 
						data={data}
						addPerkData={addPerkData}
						deletePerkData={deletePerkData}
						muiTheme={muiTheme}
					/>
				}
			</div>
		)
	}
}

function mapStateToProps(state) {
	const { data, loading } = state.perk
	return {
		data,
		loading,
		debit_data: state.transaction.data,
		debit_loading: state.transaction.loading,
		debit_error: state.transaction.err,

		add_result: state.admin && state.admin.data
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getPerkData: bindActionCreators(getPerkData, dispatch),
		createSend: bindActionCreators(createSend, dispatch),

		addPerkData: bindActionCreators(addPerkData, dispatch),
		deletePerkData: bindActionCreators(deletePerkData, dispatch)
	}
}

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(MarketContainer))