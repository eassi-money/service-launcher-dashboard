import React, { Component } from 'react'
import Paper from 'material-ui/Paper';
import { RaisedButton } from 'material-ui';
import TransactionDialog from './transaction'
import moment from 'moment'
import { BigNumber } from 'bignumber.js'
import { getWalletData } from '../../actions/wallet'
import { createSend } from '../../actions/transaction'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loader from '../../components/loader'
import { style } from '../../style/'

class Wallet extends Component {
	state = {
		token_dialog_msg: ""
	};

	handleToken_dialog_msg = (msg) => {
		this.setState({ token_dialog_msg: msg });
	};

	handleClose = () => {
		this.setState({ token_dialog_msg: "" });
	};

	render() {

		const { data, loading, err, createSend } = this.props

		const user_data = JSON.parse(localStorage.getItem('user'))

		const x = data && data.balance && new BigNumber(data.balance.balance)
		const balance = x && x.dividedBy(10000000).toString() + ' ' + data.balance.currency.code
		
		return (
			<div className='container'>
				{
					loading ?
					<Loader/> :
						(
							err ?
							<h3>{err}</h3> :
								<div className='row'>
									<br />
									<div className='col-12'>
										<Paper style={style.balance_card} zDepth={3}>
											<div className='container'>
												<p>Balance</p>
												<h1>{ balance } </h1>
											</div>
											<div className='row'>
												<div className='col-6-sm'>
													<RaisedButton onClick={() => this.handleToken_dialog_msg("Receive Tokens")} primary={true} label="Receive" />
												</div>
												<div className='col-6-sm'>
													<RaisedButton onClick={() => this.handleToken_dialog_msg("Send Tokens")} primary={true} label="Send" />
												</div>
											</div>
											<br />
										</Paper>
									</div>
									<div className='col-12'>
										<Paper style={style.transaction_card} zDepth={3}>
											<div className='container'>
												<div className='row'>
													<br />
													<h3>Transactions</h3>
												</div>
												{
													data && data.transactions && data.transactions.length > 0 ?
														data.transactions.map((t, index) => {
															const x = new BigNumber(t.amount)
															const amount = x.dividedBy(10000000).toString()
															return (
																<div key={index} className='row'>
																	<h5 className='f-right'>{amount}</h5>
																	<h5 className='f-left'>{moment(t.created).fromNow()} ({t.status})</h5>
																</div>
															)
														}) :
														<div className='row'>
															<h5 className='f-left'>No Transactions</h5>
														</div>
												}
											</div>
										</Paper>
									</div>
								</div>
						)
				}
				<TransactionDialog
					token_dialog_msg={this.state.token_dialog_msg}
					handleClose={this.handleClose}
					createSend={createSend}
					user_data={user_data}
				/>
			</div>
		)
	}
}

class WalletContainer extends Component {
	componentDidMount() {
		this.props.getWalletData()
	}

	render() {
		const { data, loading, err, createSend } = this.props
		return (
			<Wallet data={data} loading={loading} createSend={createSend} err={err}/>
		)
	}
}

function mapStateToProps(state) {
	return {
		data: state.wallet.data,
		loading: state.wallet.loading,
		err: state.wallet.err
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getWalletData: bindActionCreators(getWalletData, dispatch),
		createSend: bindActionCreators(createSend, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletContainer)