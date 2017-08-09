import React from 'react';
import { remote } from 'electron';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import SidebarIcon from 'grommet/components/icons/base/Sidebar';
import DockerIcon from '../components/DockerIcon.jsx';
import Tip from 'grommet/components/Tip';

import docker from '../modules/docker';

class UtilityPane extends React.Component {
  constructor() {
    super();
    this.state = {
      tip: false,
      iconStatus: 'docker'
    };
    this.hideTip = this.hideTip.bind(this);
    this.checkDockerDaemon = this.checkDockerDaemon.bind(this);
  }

  componentWillMount() {
    this.checkDockerDaemon();
  }

  checkDockerDaemon() {
    if (!this.state.tip) {
      docker.isRunning()
      .then((running) => {
        if (!running) {
          this.setState({
            tip: true,
            dockerStatus: 'Docker daemon not running',
            iconStatus: 'docker-down'
          });
        } else {
          this.setState({
            tip: true,
            dockerStatus: 'Docker daemon is OK',
            iconStatus: 'docker-up'
          });
        }
        setTimeout(() => {
          this.hideTip();
        }, 3000);  
      });
    }
  }

  hideTip() {
    this.setState({
      tip: false
    });
  }

  render() {
    const TipComponent = <Tip target={this.state.iconStatus} onClose={this.hideTip} colorIndex='light-2'>{this.state.dockerStatus}</Tip>;
    return (
      <Box direction={'column'} pad={'none'}>
        { this.state.tip ? TipComponent :''}
        <Button icon={<SidebarIcon />}
          href='#'
          onClick={this.toggleSidebar}
          plain={true} />
        <Button icon={<DockerIcon status={this.state.iconStatus}/>}
          onClick={this.checkDockerDaemon}
          plain={true} />
      </Box>
    );
  }
};

module.exports = UtilityPane;
