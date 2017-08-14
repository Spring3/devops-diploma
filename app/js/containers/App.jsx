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

import Header from '../components/Header.jsx';
import MainTabs from '../components/MainTabs.jsx';
import UtilityPane from '../components/UtilityPane.jsx';
import Modal from '../components/Modal';

import Sidebar from '../components/Sidebar.jsx';
import Footer from '../components/Footer.jsx';
import LoginForm from '../components/LoginForm.jsx';

// pages
import About from '../containers/About.jsx';
import DockerPage from '../containers/Docker.jsx';

// icons
import DockerIcon from 'grommet/components/icons/base/PlatformDocker';
import DockerLogo from '../components/DockerIcon.jsx';
import AddIcon from 'grommet/components/icons/base/Add';

const actions = require('../actions.js');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sidebarOpen !== this.state.sidebarOpen) {
      this.setState({
        sidebarOpen: nextProps.sidebarOpen
      });
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
        <Header/>
        <Split flex={'right'} priority={'right'}>
          <Animate  
          enter={{ animation: 'slide-right', duration: 350, delay: 0 }}
          leave={{ animation: 'slide-right', duration: 350, delay: 0 }}
          keep={false}
          visible={this.state.sidebarOpen}>
            <Sidebar toggleModal={this.toggleModal.bind(this)}/>
          </Animate>
          <Box justify={'between'} align={'end'} full={'vertical'} direction={'column'}>
            <Box justify={'end'} direction={'row'} full={'horizontal'} alignContent={'end'}>
              <Box flex={true} pad={{ vertical: 'none', horizontal: 'medium' }}>
                <Route exact path='/' component={DockerPage} />
                <Route path='/docker' component={DockerPage} />
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
              <UtilityPane />
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
  auth: (data) => actions.authenticate(data)
});

App.contextTypes = {
  store: PropTypes.object
}

module.exports = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
