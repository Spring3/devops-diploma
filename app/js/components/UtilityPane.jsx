import React from 'react';
import { connect } from 'react-redux';

import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import SidebarIcon from 'grommet/components/icons/base/Sidebar';
import DockerIcon from '../components/DockerIcon.jsx';
import Tip from '../components/Tip';

const actions = require('../actions/actions.js');

class UtilityPane extends React.Component {
  constructor() {
    super();
    this.state = {
      iconStatus: 'docker-pending',
      dockerStatus: 'Checking docker'
    };
    this.updateStatusIcon = this.updateStatusIcon.bind(this);
    // when on start docker is down, the state does not change by worker,
    // so we need to manually change icon status to DOWN
    this.timeout = setTimeout(() => this.updateStatusIcon(this.state), 2000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isRunning !== this.state.isRunning) {
      this.updateStatusIcon(nextProps);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  updateStatusIcon(nextProps) {
    this.setState({
      iconStatus: nextProps.isRunning ? 'docker-up' : 'docker-down',
      dockerStatus: nextProps.isRunning ? 'Docker is UP' : 'Docker is DOWN',
      isRunning: nextProps.isRunning
    });
  }

  render() {
    return (
      <Box direction={'column'} pad={'none'}>
        <Tip target={this.state.iconStatus} text={this.state.dockerStatus} />
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(UtilityPane);
