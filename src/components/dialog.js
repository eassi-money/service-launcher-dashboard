import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import { style } from '../style'

export default class extends Component {
    render() {
        const { modal_content, is_open, close } = this.props;
        return (
            <Dialog
                    repositionOnUpdate={false}
                    autoDetectWindowHeight={false}
                    autoScrollBodyContent={false}
                    contentStyle={style.dialog_content_style}
                    bodyStyle={style.dialog_body_style}
                    style={style.dialog_style}
                    open={is_open}
                    onRequestClose={() => close()}
                >
                { modal_content }
            </Dialog>
        )
    }
}