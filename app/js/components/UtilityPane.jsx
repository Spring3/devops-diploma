import React from 'react';
import { connect } from 'react-redux';

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
      timeout: false
    };
    this.updateStatusIcon = this.updateStatusIcon.bind(this);
  }

  componentWillMount() {
    this.setState({
      tip: true,
      iconStatus: 'docker-pending',
      dockerStatus: 'Checking docker',
      timeout: true
    }, () => {
      setTimeout(() => {
        this.setState({
          tip: false,
          timeout: false
        });
        this.updateStatusIcon(this.props);
      }, 1000);  
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isRunning !== this.state.isRunning) {
      this.updateStatusIcon(nextProps);
    }
  }

  updateStatusIcon(nextProps) {
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
      }, 2000);  
    });
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(UtilityPane);
