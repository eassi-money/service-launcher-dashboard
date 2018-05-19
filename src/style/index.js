import { cyanA200, purpleA700, white, purple50 } from 'material-ui/styles/colors';

export const style = {
	bodyBg: (file) => ({
		background: file,
		backgroundSize: "cover",
		backgroundPosition: "center center",
		backgroundRepeat:  "no-repeat",
		backgroundAttachment: "fixed",
	}),
	card: {
		display: 'flex',
		position: 'relative',
		padding: '20px 30px',
		flexDirection: 'row',
		borderRadius: '0px',
		height: '260px',
		alignItems: 'center'
	},
	curr_card: {
		display: 'flex',
		position: 'relative',
		padding: '10px 20px',
		flexDirection: 'row',
		borderRadius: '0px',
		height: '260px',
		alignItems: 'center'
	},
	card_header: (bg) => ({
		display: 'flex',
		width: '100%',
		position: 'relative',
		padding: '10px 10px 10px',
		flexDirection: 'row',
		borderRadius: '0px',
		alignItems: 'center',
		backgroundColor: bg
	}),
	card_right: {
		width: '40%',
		alignItems: 'center'
	},
	card_left: {
		width: '50%',
		textAlign: 'center',
		paddingRight: '20px'
	},
	card_left_curr: {
		width: '80%',
		paddingRight: '20px'
	},
	card_left_img: {
		width: '100%',
		maxHeight: '220px'
	},
	card_img: {
		height: '100px',
		width: 'auto',
		position: 'absolute',
		right: '20px',
		top: '30px'
	},
	balance_card: {
		textAlign: 'center',
		borderRadius: '0px',
		alignItems: 'center',
		padding: '30px 15px 25px',
		position: 'relative',
	},
	transaction_card: {
		borderRadius: '0px',
	  	alignItems: 'center',
		padding: '30px 40px',
		position: 'relative',

	},
	user_nav_view: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0
	},
	drawer_logo: {
		margin: '30px auto 30px',
		display: 'block',
		height: '120px'
	},
	drawer_link: {
		position: 'absolute',
		left: '60%'
	},
	drawer_link_highlight: (path, route, color) => ({
		backgroundColor: path === route ? color : null,
		color: path === route ? white : null,
	}),
	drawer_link_icon: (path, route, color) => ({ 
		color: path === route ? white : cyanA200,
		position: 'absolute', 
		left: '35%',
		top: '-19px',
		height: '60px',
		width: 'auto'
	}),
	nav_menu_icon: { 
		color: purpleA700, 
		position: 'absolute', 
		left: 20, 
		paddingTop: '5px' 
	},
	settings_card: {
		borderRadius: '0px',
		alignItems: 'center',
		padding: '0 0 30px',
		position: 'relative'
	},
	settings_close: {
		position: 'absolute',
		right: '5%', 
		top: 15
	},
	logout_btn: {
		float: 'right',
		color: 'black',
		zIndex: 104
	},
	dialog_content_style: {
		width: '100%',
		maxWidth: '450px',
		maxHeight: '100% !important'
	},
	dialog_body_style: {
		maxHeight: '100% !important'
	},
	dialog_style: {
		paddingTop:'0 !important',
		marginTop:'-65px !important',
		bottom: '0 !important',
		overflow: 'scroll !important',
		height: 'auto !important'
	},
	card_heading_right: { width: '200px' },
	error_color: {color: 'red'},
	input_black: { color: "#000" },
	hint_black: { color: "#999" },
	left_button_margin: { marginLeft: '8px' },
	right_button_margin: { marginRight: '8px' },
	modal_content: {
		alignContent: 'center',
		textAlign: 'center'
	},
	white: { color: 'white' },
	qr_code: {
		height: 300,
		width: 300
	}
};
