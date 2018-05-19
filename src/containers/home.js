import React, { Component } from 'react'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { getWalletData } from '../actions/wallet'
import { BigNumber } from 'bignumber.js' 
import muiThemeable from 'material-ui/styles/muiThemeable';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Loader from '../components/loader'
import { style } from '../style/'
import company_data from './config.json'

class Home extends Component {
	render() {

		const { history, loading, err, data, muiTheme } = this.props
		const { primary3Color } = muiTheme.palette

		const x = data && data.balance && new BigNumber(data.balance.balance)
		const balance = x && x.dividedBy(10000000).toString()

		const icon_folder = '/' + localStorage.getItem('theme');		

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
										<Paper style={style.card_header(primary3Color)} zDepth={3}>
											<div style={style.card_left}>
												<img style={style.card_left_img} src={icon_folder + '/icon3.svg'} alt='logo' />
											</div>
											<div style={style.card_right} className='right'>
												<h3>{ company_data && company_data.card_display_name }</h3>
												<p className='cardtext'>{ company_data && company_data.description }</p>
												<a href="https://rehive.com" rel="noopener noreferrer" target="_blank"><RaisedButton label="Visit Site" secondary={true} /></a>
												<br/><br/>
											</div>
										</Paper>
										<br />
									</div>
									<div className='col-12'>
										<Paper style={style.card} zDepth={3}>
											<div style={style.card_left}>
												<br />
												<h1 className='card-heading'>
													{balance}
													<br />
													{data && data.balance && data.balance.currency && data.balance.currency.code}
												</h1>
											</div>
											<div style={style.card_heading_right} className='right'>
												<h3 className='card-heading'>Balance</h3>
												<p className='cardtext'> View your token balance and transaction history in your wallet. </p>
												<br /><br />
												<RaisedButton onClick={() => history.push('/wallet')} label="Wallet" secondary={true} />
											</div>
										</Paper>
										<br />
									</div>
									<div className='col-6'>
										<Paper style={style.card} zDepth={3}>
											<div style={style.card_left}>
												<img style={style.card_left_img} src={icon_folder + '/icon1.svg'} alt='coins' />
											</div>
											<div style={style.card_right} className='right'>
												<h3 className='card-heading'>Earn Tokens</h3>
												<p className='cardtext'> Get rewarded tokens for completing tasks </p>
												<br /><br />
												<RaisedButton onClick={() => history.push('/rewards')} label="Rewards" secondary={true} />
											</div>
										</Paper>
										<br />
									</div>
									<div className='col-6'>
										<Paper style={style.card} zDepth={3}>
											<div style={style.card_left}>
												<img style={style.card_left_img} src={icon_folder + '/icon2.svg'} alt='market' />
											</div>
											<div style={style.card_right} className='right'>
												<h3 className='card-heading'>Redeem Perks</h3>
												<p className='cardtext'> Use tokens to purchase exclusive perks on the Marketplace.  </p>
												<br /><br />
												<RaisedButton onClick={() => history.push('/perks')} label="Perks" secondary={true} />
											</div>
										</Paper>
										<br />
									</div>
								</div>
						)
				}
			</div>
		)
	}
}

class HomeContainer extends Component {
	componentDidMount() {
		this.props.getWalletData()
	}

	render() {
		const { data, loading, err, history, muiTheme } = this.props
		return (
			<Home 
				history={history} 
				data={data} 
				loading={loading} 
				err={err}
				muiTheme={muiTheme}
			/>
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
		getWalletData: bindActionCreators(getWalletData, dispatch)
	}
}

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(HomeContainer));