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

import ListOfApps from '../components/ListOfApps.jsx';
import MainTabs from '../components/MainTabs.jsx';
import Footer from '../components/Footer.jsx';

// icons
import DockerIcon from 'grommet/components/icons/base/PlatformDocker';
import SidebarIcon from 'grommet/components/icons/base/Sidebar';
import AddIcon from 'grommet/components/icons/base/Add';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: true,
      sidebarVisible: true
    };

    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  toggleSidebar() {
    this.setState({
      sidebarOpen: !this.state.sidebarOpen,
    });
  }

  render() {
    return (
      <Wrapper centered={false}>
        <Header/>
        <Split flex={'right'} priority={'right'}>
          <Animate  
          enter={{ animation: 'slide-right', duration: 1000, delay: 0 }}
          leave={{ animation: 'slide-right', duration: 1000, delay: 0 }}
          keep={false}
          visible={this.state.sidebarOpen}>
            <Box colorIndex={'grey-3'} full={'vertical'}>
              <Box justify={'start'} align={'center'} direction={'column'}>
                <Box justify={'end'} direction={'row'} pad={{ vertical: 'medium', horizontal: 'medium' }} colorIndex={'grey-2'}>
                  <Box justify={'center'}>
                    <Title>
                      Riptide
                    </Title>
                  </Box>
                  <Button icon={<DockerIcon />}
                    label='Sign in'
                    href='#'
                    plain={true} />
                </Box>
              </Box>
              
              <Box pad={{ horizontal: 'none', vertical: 'small' }}>
                <Box pad={{ horizontal: 'medium', vertical: 'none' }} direction={'row'}>
                  <Title>
                    Apps
                  </Title>
                  <Button
                    href='#'
                    icon={<AddIcon />} />
                </Box>
                <ListOfApps />
              </Box>
            </Box>
          </Animate>
          <Box justify={'between'} align={'end'} full={'vertical'} direction={'column'}>
            <Box justify={'end'} direction={'row'} full={'horizontal'} alignContent={'end'}>
              <Box flex={true} pad={{ vertical: 'none', horizontal: 'medium' }}>
                <MainTabs />
              </Box>
              <Button icon={<SidebarIcon />}
                href='#'
                onClick={this.toggleSidebar}
                plain={true} />
            </Box>
            Right
            <Footer />
          </Box>
        </Split>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  dispatch
});

App.contextTypes = {
  store: PropTypes.object
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(App);
