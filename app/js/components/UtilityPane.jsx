import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import SidebarIcon from 'grommet/components/icons/base/Sidebar';
import DockerIcon from '../components/DockerIcon.jsx';
import Tip from 'grommet/components/Tip';

const actions = require('../actions.js');

class UtilityPane extends React.Component {
  constructor() {
    super();
    this.state = {
      tip: false,
      iconStatus: 'docker',
      timout: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isRunning !== this.state.isRunning) {
      this.setState({
        tip: true,
        iconStatus: nextProps.isRunning ? 'docker-up' : 'docker-down',
        dockerStatus: nextProps.isRunning ? 'Docker is UP' : 'Docker is DOWN',
        isRunning: nextProps.isRunning,
        timeout: true
      }, () => {
        setTimeout(() => {
          this.setState({
            tip: false,
            timeout: false
          });
        }, 3000);  
      });
    }
  }

  stub() {}

  render() {
    const TipComponent = <Tip target={this.state.iconStatus} onClose={this.stub} colorIndex='light-2'>{this.state.dockerStatus}</Tip>;
    return (
      <Box direction={'column'} pad={'none'}>
        { this.state.tip && this.state.dockerStatus ? TipComponent :''}
        <Button icon={<SidebarIcon />}
          href='#'
          onClick={this.props.toggleSidebar}
          plain={true} />
        <Button icon={<DockerIcon status={this.state.iconStatus}/>}
          href='#'
          plain={true} />
      </Box>
    );
  }
};

const mapStateToProps = state => ({
  isRunning: state.docker.isRunning
});
const mapDispatchToProps = () => ({
  toggleSidebar: () => actions.toggleSidebar()
});

UtilityPane.contextProps = {
  store: PropTypes.object
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(UtilityPane);
