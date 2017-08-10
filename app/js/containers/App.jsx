import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Wrapper from 'grommet/components/App';
import Header from '../components/Header.jsx';
import Split from 'grommet/components/Split';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Pulse from 'grommet/components/icons/Pulse';
import Title from 'grommet/components/Title';
import Animate from 'grommet/components/Animate';

import UtilityPane from '../components/UtilityPane.jsx';
import Sidebar from '../components/Sidebar.jsx';
import MainTabs from '../components/MainTabs.jsx';
import Footer from '../components/Footer.jsx';

// icons
import DockerIcon from 'grommet/components/icons/base/PlatformDocker';
import AddIcon from 'grommet/components/icons/base/Add';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sidebarOpen !== this.state.sidebarOpen) {
      this.setState({
        sidebarOpen: nextProps.sidebarOpen
      });
    }
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
            <Sidebar/>
          </Animate>
          <Box justify={'between'} align={'end'} full={'vertical'} direction={'column'}>
            <Box justify={'end'} direction={'row'} full={'horizontal'} alignContent={'end'}>
              <Box flex={true} pad={{ vertical: 'none', horizontal: 'medium' }}>
                <MainTabs />
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

const mapDispatchToProps = dispatch => ({
  dispatch
});

App.contextTypes = {
  store: PropTypes.object
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(App);
