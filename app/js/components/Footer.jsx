import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Footer from 'grommet/components/Footer';
import Title from 'grommet/components/Title';
import Logo from 'grommet/components/SVGIcon';
import Box from 'grommet/components/Box';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import Notification from './Notification.jsx';

class FooterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotification: this.props.showNotification,
      notificationMessage: this.props.notificationMessage,
      notificationType: this.props.notificationType,
      notificationProgress: this.props.notificationProgress
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.showNotification !== nextProps.showNotification ||
      this.state.notificationMessage !== nextProps.notificationMessage ||
      this.state.notificationType !== nextProps.notificationType ||
      this.state.notificationProgress !== nextProps.notificationProgress) {
      this.setState({
        showNotification: nextProps.showNotification,
        notificationMessage: nextProps.notificationMessage,
        notificationType: nextProps.notificationType,
        notificationProgress: nextProps.notificationProgress
      });
    }
  }

  render() {
    return (
      <Box full='horizontal'>
      { this.state.showNotification ?
        <Notification type={this.state.notificationType} message={this.state.notificationMessage} progress={this.state.notificationProgress} />
        :
        <Footer justify='between'
          size='small'
          alignSelf='end'
          pad={{ vertical: 'small', horizontal: 'medium' }}>
          <Title>
            <Logo viewBox={'0 0 280 278'}
            version='1.1'
            type='logo'
            a11yTitle='Riptide'>
              <g transform="translate(0,248) scale(0.080000,-0.080000)" fill="#312c32" stroke="#312c32" strokeWidth='4' strokeLinejoin='round'>
                <path d={'M1215 2769 c-519 -71 -966 -440 -1130 -932 -58 -175 -70 -252 -70 -447 0 -189 13 -279 61 -425 131 -404 444 -731 844 -882 203 -77 483 -103 705 -65 303 52 539 175 755 392 264 265 394 560 407 930 8 237 -31 432 -128 640 -130 277 -364 517 -642 656 -84 43 -244 97 -352 119 -95 20 -350 28 -450 14z m430 -154 c499 -105 872 -479 981 -985 27 -124 25 -372 -3 -495 -12 -49 -31 -115 -42 -147 -39 -101 -165 -210 -309 -265 -89 -34 -247 -43 -342 -19 -215 54 -382 215 -446 431 -21 73 -24 217 -5 295 39 163 174 334 316 399 125 58 138 66 159 94 15 20 21 44 21 77 0 67 -32 99 -138 139 -356 134 -746 118 -1082 -44 -197 -94 -412 -282 -534 -465 l-64 -95 8 45 c77 486 440 893 905 1015 178 47 408 55 575 20z m-180 -504 l50 -7 -80 -18 c-461 -105 -803 -453 -896 -910 -48 -238 -11 -535 92 -739 11 -20 16 -37 11 -37 -20 0 -177 158 -237 238 -115 153 -203 355 -235 537 -11 67 -11 73 14 140 151 397 517 705 929 779 136 25 255 31 352 17z m295 -115 c0 -2 -23 -9 -50 -15 -86 -18 -208 -71 -283 -121 -552 -369 -498 -1188 97 -1475 123 -59 197 -77 351 -84 l130 -6 -82 -37 c-264 -121 -565 -147 -841 -73 -178 48 -203 67 -300 226 -316 518 -114 1204 435 1478 88 44 222 86 318 100 63 9 225 14 225 7z m-261 -262 c-58 -77 -87 -132 -120 -229 -21 -61 -24 -88 -24 -215 0 -131 3 -153 27 -225 39 -114 92 -198 179 -285 89 -89 157 -131 276 -173 155 -54 361 -48 501 13 25 11 47 18 49 16 12 -12 -85 -98 -145 -129 -130 -68 -190 -82 -352 -81 -129 0 -154 3 -223 26 -209 70 -375 226 -456 429 -81 203 -63 451 46 638 49 84 149 191 227 241 33 22 62 40 63 40 1 0 -20 -30 -48 -66z'} />
              </g>
            </Logo>
            Riptide
          </Title>
          <Box direction='row'
            align='center'
            pad={{"between": "medium"}}>
            <Menu direction='row'
              size='small'
              dropAlign={{"right": "right"}}>
              <Anchor href='#'>
                Contact
              </Anchor>
              <Anchor onClick={this.props.openAboutPage}>
                About
              </Anchor>
            </Menu>
          </Box>
        </Footer>
      }
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  showNotification: state.main.showNotification,
  notificationMessage: state.main.notificationMessage,
  notificationType: state.main.notificationType,
  notificationProgress: state.main.notificationProgress
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  openAboutPage: () => dispatch(push('/about'))
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(FooterComponent);
