import React, { Component } from 'react'
import Paper from 'material-ui/Paper';
import ShapeDialog from '../components/dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Loader from '../components/loader'
import muiThemeable from 'material-ui/styles/muiThemeable';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getRewardRequests, approveReward, rejectReward } from '../actions/reward_requests'
import { style } from '../style/'
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
  } from 'material-ui/Table';
import TextField from 'material-ui/TextField/TextField';

class RewardRequests extends Component {
	constructor(props) {
		super(props)
		this.state = {
			reward_identifier: false,
			filter_value: ''
		}
	}

	render() {
		const { data, err, approveReward, rejectReward } = this.props
		
		return (
			<div>
				<ShapeDialog
					is_open={this.state.reward_identifier ? true : false}
					close={() => this.setState({ reward_identifier: '' })}
					modal_content={<div style={style.modal_content}>
						<h3>Are you sure you want to {
							this.state.reject ? "reject" : "approve"
						} this request?</h3>
						{
							err ?
								<h3>{err}</h3> : null
						}
						<form onSubmit={(e) => {
							e.preventDefault()
							if (this.state.reject) {
								rejectReward({ identifier: this.state.reward_identifier })
							} else {
								approveReward({ identifier: this.state.reward_identifier })
							}
						}}>
							<FlatButton
								label="Cancel"
								primary={true}
								onClick={() => this.setState({ reward_identifier: '', reject: null })}
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
				<div className='container'>
					<Paper>
						<div className="container center">
							<TextField value={this.state.filter_value} onChange={e => this.setState({ filter_value: e.target.value })} fullWidth={true} floatingLabelText="Search Email..."/>
							<br/><br/>
						</div>
					</Paper>
					<br/>
					<Paper>
						<Table selectable={false}>
							<TableHeader>
							<TableRow>
								<TableHeaderColumn>Type</TableHeaderColumn>
								<TableHeaderColumn>Email</TableHeaderColumn>
								<TableHeaderColumn>Status</TableHeaderColumn>
							</TableRow>
							</TableHeader>
							<TableBody>
							{
								data && data.filter(i => i.state === 'pending').length > 0 ?
									data.filter(i => i.state === 'pending' && i.user.includes(this.state.filter_value) ).map((item, index) => {
										return (
											<TableRow key={index}>
												<TableRowColumn>{item.reward_type}</TableRowColumn>
												<TableRowColumn>{item.user}</TableRowColumn>
												<TableRowColumn>
												{
													item.state === 'pending' ?
														<RaisedButton style={style.right_button_margin} onClick={() => this.setState({ reward_identifier: item.identifier })} primary={true} label="Approve" /> :
														<RaisedButton className="f-right" disabled={true} label="Approved" />
												}
												{
													item.state === 'pending' ?
														<RaisedButton onClick={() => this.setState({ reward_identifier: item.identifier, reject: true })} primary={true} label="Reject" /> :
														null
												}
												</TableRowColumn>
											</TableRow>
										)
									}) : null
							}
							</TableBody>
						</Table>
					</Paper>
				</div>
			</div>
		)
	}
}

class RewardRequestsContainer extends Component {
	componentDidMount() {
		const user_data = JSON.parse(localStorage.getItem('user'))
		const { reward_success, getRewardRequests } = this.props
		if (reward_success) {
			getRewardRequests(user_data.company)
		} else {
			getRewardRequests(user_data.company)
		}
	}
	

	render() {
		const { loading, data, err, approveReward, rejectReward, reward_success, getRewardRequests, muiTheme } = this.props
		const user_data = JSON.parse(localStorage.getItem('user'))
		const { primary3Color } = muiTheme.palette
		const icon_folder =  '/' + localStorage.getItem('theme');
		return (
			<div>
				<div className='container'>
					<Paper style={style.card_header(primary3Color)} zDepth={3}>
						<div style={style.card_left}>
							<img style={style.card_left_img} src={icon_folder + '/icon1.svg'} alt='earn' />
						</div>
						<div style={style.card_right} className='right'>
							<h3>Reward Requests</h3>
							<p>Approve reward claim requests</p>
						</div>
					</Paper>
					<br/>
				</div>
				{
					loading ?
						<Loader /> :
						err ?
						<div className="container center">
								<h3>An error occurred</h3>
						</div> :
							<RewardRequests 
								err={err} 
								data={data} 
								approveReward={approveReward} 
								rejectReward={rejectReward}
							/>
				}
			</div>
		)
	}
}

function mapStateToProps(state) {
	const { data, loading, err, reward_success } = state.reward_requests
	return {
		data,
		loading,
		err,
		reward_success
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getRewardRequests: bindActionCreators(getRewardRequests, dispatch),
		approveReward: bindActionCreators(approveReward, dispatch),
		rejectReward: bindActionCreators(rejectReward, dispatch)
	}
}

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(RewardRequestsContainer))