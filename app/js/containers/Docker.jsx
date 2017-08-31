import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Box from 'grommet/components/Box';
import Headline from 'grommet/components/Headline';
import Columns from 'grommet/components/Columns';
import Button from 'grommet/components/Button';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import CheckBox from 'grommet/components/CheckBox';
import TextInput from 'grommet/components/TextInput';
import Image from 'grommet/components/Image';
import Label from 'grommet/components/Label';
import Select from 'grommet/components/Select';

import _ from 'underscore';
import docker from '../modules/docker.js';

import CaretLeft from 'grommet/components/icons/base/CaretBack';

const actions = require('../actions/actions.js');

const path = require('path');
const dockerLogoPath = path.posix.resolve('./app/img/docker-logo.jpg');

class DockerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRunning: props.isRunning,
      config: {
        connection: docker.config.connection,
        socket: docker.config.socket,
        host: docker.config.host,
        port: docker.config.port
      },
      info: props.info,
      timeout: null
    };
  }

  componentWillMount() {
    actions.docker.updateInfo();
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.isRunning !== this.state.isRunning) {
      this.setState({ isRunning: nextProps.isRunning });
    }
    if (!_.isEqual(nextProps.info, this.state.info)) {
      this.setState({ info: nextProps.info });
    }
    console.log(nextProps.config);
    if (!_.isEqual(nextProps.config, this.state.config)) {
      console.log('Docker.jsx');
      console.log(nextProps.config);
      this.setState({ config: nextProps.config });
    }
  }

  commonChangeHandler(e, param) {
    if (this.state.timeout) {
      clearTimeout(this.state.timeout)
    }
    const config = this.state.config;
    config[param] = e.target.value;
    this.setState({
      config: config,
      timeout: null
    });
    this.sync();
  }

  connectionChange(data) {
    if (this.state.config.connection !== data.option) {
      const config = this.state.config;
      config.connection = data.option;
      this.setState({ config: config });
      this.sync();
    }
  }

  hostChange(e) {
    this.commonChangeHandler(e, 'host');
  }

  portChange(e) {
    this.commonChangeHandler(e, 'port');
  }

  socketChange(e) {
    this.commonChangeHandler(e, 'socket');
  }

  sync() {
    if (!this.state.timeout) {
      const self = this;
      this.setState({
        timeout: setTimeout(() => {
          actions.docker.connect(self.state.config, true);
          self.setState({
            timeout: null
          });
        }, 1000)
      });
    }
  }

  stub() {}

  render() {
    return (
      <Box direction='column'>
        <Box justify='center' full='horizontal' align='center' pad='none' margin={{vertical: 'small', horizontal: 'none'}} direction='row'>
          <Box>
            <Image
              src={dockerLogoPath}
              size='small'
              className='grommetux-image--xsmall'
            />
          </Box>
          <Box pad='medium' margin={{vertical: 'small', horizontal: 'none'}}>
            <Headline size='small' strong={true}>Docker</Headline>
            <Label margin='none'>Version: v{this.state.info.Version || 'N/A'}</Label>
            <Label margin='small'>Api: v{this.state.info.ApiVersion || 'N/A'}</Label>
          </Box>
        </Box>
        <Box justify='center' full='horizontal' align='center' pad='none' margin={{vertical: 'small', horizontal: 'none'}} direction='column'>
          <Box direction='row'>
            <Label margin='small'>Connected to docker via</Label>
            <div style={{width: 100}}>
              <Select placeHolder='socket'
                options={['socket', 'url']}
                value={this.state.config.connection}
                className='borderless'
                onChange={this.connectionChange.bind(this)}/>
            </div>
          </Box>
          <hr/>
          <Form>
            {this.state.config.connection === 'url' ? 
              <Box direction='row'>
                <FormField label='Host' className='borderless'>
                  <TextInput name='host' value={this.state.config.host} onDOMChange={this.hostChange.bind(this)} onChange={this.stub} placeHolder='127.0.0.1' className='borderless'/>
                </FormField>
                <FormField label='Port' className='borderless'>
                  <TextInput name='port' value={this.state.config.port} onDOMChange={this.portChange.bind(this)} onChange={this.stub} placeHolder='2375' className='borderless'/>
                </FormField>
              </Box>
              :
              <FormField label='Path to socket' className='borderless'>
                <TextInput name='host' value={this.state.config.socket} onDOMChange={this.socketChange.bind(this)} onChange={this.stub} placeHolder={docker.defaultSocketPath} className='borderless'/>
              </FormField>
            }
          </Form>
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  isRunning: state.docker.isRunning,
  info: state.docker.info,
  config: state.docker.config
});

const mapDispatchToProps = () => ({});

DockerPage.contextTypes = {
  store: PropTypes.object
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(DockerPage);
