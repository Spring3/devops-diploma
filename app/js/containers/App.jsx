import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Route } from 'react-router';
import Wrapper from 'grommet/components/App';
import Split from 'grommet/components/Split';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Title from 'grommet/components/Title';
import Animate from 'grommet/components/Animate';

import MainMenu from '../components/MainMenu.jsx';
import Modal from '../components/Modal';

import Sidebar from '../components/Sidebar.jsx';
import Footer from '../components/Footer.jsx';
import LoginForm from '../components/LoginForm.jsx';
import TopMenu from '../components/TopMenu.jsx';


// pages
import About from '../containers/About.jsx';
import ImageBuildPage from '../containers/ImageBuildPage.jsx';
import ImagesPage from '../containers/Images.jsx';
import ImagesStatusPage from '../containers/ImageStatus.jsx';
import DockerPage from '../containers/Docker.jsx';
import SidebarIcon from 'grommet/components/icons/base/Sidebar';

// icons
import DockerIcon from 'grommet/components/icons/base/PlatformDocker';
import DockerStatusIcon from '../components/DockerIcon.jsx';
import DockerLogo from '../components/DockerIcon.jsx';
import AddIcon from 'grommet/components/icons/base/Add';
import CaretLeft from 'grommet/components/icons/base/CaretBack';

const actions = require('../actions/actions.js');
const contextMenu = require('../modules/contextMenu.js');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      sidebarOpen: this.props.sidebarOpen
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.sidebarOpen !== nextProps.sidebarOpen) {
      this.setState({ sidebarOpen: nextProps.sidebarOpen });
    }
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <Wrapper centered={false}>
        <Split flex={'right'} priority={'right'}>
          <Animate  
          enter={{ animation: 'slide-right', duration: 350, delay: 0 }}
          leave={{ animation: 'slide-right', duration: 350, delay: 0 }}
          keep={false}
          visible={this.state.sidebarOpen}>
            <Sidebar toggleModal={this.toggleModal.bind(this)}/>
          </Animate>
          <Box pad={'none'} justify={'between'} full={'vertical'} align={'start'}>
            <Box pad={{horizontal: 'small'}} direction='row' full='horizontal' align='center'>
              <Button
                icon={<CaretLeft/>}
                onClick={this.props.history.goBack}
                className='notPadded'
              />
              <TopMenu/>
            </Box>
            <Box justify={'between'} direction={'row'} full={'horizontal'} flex={true} alignContent={'end'}>
              <Box flex={true} pad={{ vertical: 'none', horizontal: 'small' }} className='left-padded'>
                <Route exact path='/' component={MainMenu} />
                <Route path='/docker' component={DockerPage} />
                <Route exact path='/image' component={ImageBuildPage} />
                <Route exact path='/images' component={ImagesPage} />
                <Route path='/images/selected' component={ImagesStatusPage} />
                <Route path='/about' component={About} />
                {
                  this.state.modal ? 
                    <Modal closeBtn={true} toggleModal={this.toggleModal.bind(this)}>
                      <LoginForm toggleModal={this.toggleModal.bind(this)}/>
                    </Modal>
                  :
                  ''
                }
              </Box>
            </Box>
            <Box className='utility'>
              <Button icon={<SidebarIcon />}
                href='#'
                onClick={actions.toggleSidebar}
                plain={true} />
              <DockerStatusIcon />
            </Box>
            <Footer />
          </Box>
        </Split>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  sidebarOpen: state.main.sidebarOpen
});

const mapDispatchToProps = () => ({
  auth: (data) => actions.docker.authenticate(data)
});

App.contextTypes = {
  store: PropTypes.object
}

module.exports = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
