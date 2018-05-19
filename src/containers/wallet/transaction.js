import React, { Component } from 'react'
import { FlatButton, TextField } from 'material-ui';
import ShapeDialog from '../../components/dialog'
import { style } from '../../style'

export default class extends Component {
    state = {
		recipient: '',
		memo: '',
        amount: '',
        loadingReceiveAddress: false,
        receiveAddress: '',
        receiveAddressError: null
    };
    
    componentDidMount() {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        headers['Authorization'] = `Token ${localStorage.getItem('token')}`
        let config = {
            method: 'GET',
            mode: 'cors',
            headers
        }
        
        this.setState({ loadingReceiveAddress: true })
        fetch(process.env.REACT_APP_STELLAR_SERVICE_URL + '/user/account', config)
        .then(response => response.json())
        .then(json => {
            this.setState({ 
                loadingReceiveAddress: false, 
                receiveAddress: 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + encodeURIComponent(json.details.address) + '&choe=UTF-8'
            })
        })
        .catch(err => this.setState({ receiveAddressError: err }))
    }
    render() {
        const { token_dialog_msg, handleClose, createSend, user_data } = this.props
        
        return (
            <ShapeDialog
                is_open={token_dialog_msg ? true : false}
                close={handleClose}
                modal_content={<div>
                    <h2>{token_dialog_msg}</h2>
                    {
                    token_dialog_msg === "Receive Tokens" ?
                        <div className='center'>
                            {
                                this.state.loadingReceiveAddress ?
                                <p>Getting Receive Address...</p> :
                                this.state.receiveAddressError ?
                                <p>{this.state.receiveAddressError}</p> :
                                <img style={style.qr_code} src={this.state.receiveAddress} alt='qr' />
                            }
                        </div> : (
                            <div className="center">
                                <p><b>Add a trustline in the receiving wallet before sending:</b><br />
                                Asset: SHAPE<br />
                                Issuer: BPRS63VQIKJP5VNNEV3TQEH6FCVMTZ6ZHK4CJFPLKKPXLBVYFZ62HJP</p>
                                <TextField 
                                    value={this.state.recipient} 
                                    type="text" 
                                    hintText="Email or stellar address" 
                                    onChange={e => this.setState({ recipient: e.target.value })}
                                />
                                <br/>
                                <TextField 
                                    value={this.state.amount} 
                                    type="number"
                                    onChange={e => this.setState({ amount: e.target.value })}
                                    hintText="Amount" 
                                />
                                <br/>
                                <TextField 
                                    value={this.state.memo} 
                                    type="text" 
                                    onChange={e => this.setState({ memo: e.target.value })}
                                    hintText="Memo" 
                                />
                            </div>
                        )
                }
                <div>
                    <FlatButton
                        label="Close"
                        primary={true}
                        onClick={handleClose}
                    />
                    <FlatButton
                        label="Submit"
                        primary={true}
                        onClick={() => {
                            const data = {
                                reference: this.state.recipient,
                                currency: user_data && user_data.currency && user_data.currency.code,
                                amount: this.state.amount * 10000000,
                                memo: this.state.memo,
                                company: user_data && user_data.company
                            }
                            createSend(data)
                        }}
                    />
                </div>
                </div>}
            />
        )
    }
}