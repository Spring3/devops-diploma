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

const actions = require('../actions.js');

const path = require('path');
const dockerLogoPath = path.posix.resolve('./app/img/docker-logo.jpg');

class DockerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRunning: false,
      connection: '',
      host: '',
      port: '',
      socket: '',
      timeout: null
    };
  }

  componentWillMount() {
    actions.updateDockerInfo();
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isRunning !== this.state.isRunning) {
      this.setState({
        isRunning: nextProps.isRunning
      });
    }
    if (!_.isEqual(nextProps.info, this.state)) {
      console.log('Docker.jsx');
      this.setState(nextProps.info);
    }
    console.log(this.state);
  }

  commonChangeHandler(e, param) {
    if (this.state.timeout) {
      clearTimeout(this.state.timeout)
    }
    this.setState({
      [param]: e.target.value,
      timeout: null
    });
    this.sync();
  }

  connectionChange(data) {
    if (this.state.connection !== data.option) {
      this.setState({
        connection: data.option,
        host: '',
        port: '',
        socket: ''
      });
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
          docker.connect(self.state);
          self.setState({
            timeout: null
          });
        }, 2000)
      });
    }
  }

  render() {
    return (
      <Box direction='column'>
        <Box direction='row'>
          <Box justify='start' flex={false}>
            <Button
              icon={<CaretLeft/>}
              onClick={this.props.history.goBack}
              className='notPadded'
            />
          </Box>
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
              <Label margin='none'>Version: v{this.state.Version || 'N/A'}</Label>
              <Label margin='small'>Api: v{this.state.ApiVersion || 'N/A'}</Label>
            </Box>
          </Box>
        </Box>
        <Box justify='center' full='horizontal' align='center' pad='none' margin={{vertical: 'small', horizontal: 'none'}} direction='column'>
          <Box direction='row'>
            <Label margin='small'>Connected to docker via</Label>
            <div style={{width: 100}}>
              <Select placeHolder='socket'
                options={['socket', 'url']}
                value={this.state.connection}
                className='borderless'
                onChange={this.connectionChange.bind(this)}/>
            </div>
          </Box>
          <hr/>
          <Form>
            {this.state.connection === 'url' ? 
              <Box direction='row'>
                <FormField label='Host' className='borderless'>
                  <TextInput name='host' value={this.state.host} onDOMChange={this.hostChange.bind(this)} placeHolder='127.0.0.1' className='borderless'/>
                </FormField>
                <FormField label='Port' className='borderless'>
                  <TextInput name='port' value={this.state.port} onDOMChange={this.portChange.bind(this)} placeHolder='2375' className='borderless'/>
                </FormField>
              </Box>
              :
              <FormField label='Path to socket' className='borderless'>
                <TextInput name='host' value={this.state.socket} onDOMChange={this.socketChange.bind(this)} placeHolder={docker.config.socket} className='borderless'/>
              </FormField>
            }
          </Form>
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  info: state.docker.info,
  isRunning: state.docker.isRunning
});

const mapDispatchToProps = () => ({});

DockerPage.contextTypes = {
  store: PropTypes.object
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(DockerPage);
