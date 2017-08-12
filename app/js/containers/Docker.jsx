import React from 'react';
import PropTypes from 'prop-types';
import { remote } from 'electron';
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

const path = remote.require('path');
const dockerLogoPath = path.resolve('./app/img/docker-logo.jpg');

class DockerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRunning: false
    };
  }

  componentWillMount() {
    docker.getVersion()
    .then((info) => {
      this.props.dispatch({
        type: 'UPDATE_DOCKER_INFO',
        info
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.info, this.state)) {
      console.log('Docker.jsx');
      console.log(nextProps);
      this.setState(nextProps.info);
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
        <Box justify='center' full='horizontal' align='center' pad='none' margin={{vertical: 'small', horizontal: 'none'}} direction='row'>
          <Form>
            <CheckBox label='URL' toggle={true} />
            <Box direction='row'>
              <FormField label='Protocol' className='borderless'>
                <Select placeHolder='http'
                  options={['http', 'https']}
                  value={'http'} />
              </FormField>
              <FormField label='Host' className='borderless'>
                <TextInput name='host' className='borderless'/>
              </FormField>
              <FormField label='Port' className='borderless'>
                <TextInput name='port' className='borderless'/>
              </FormField>
            </Box>
          </Form>
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  info: Object.assign({ isRunning: state.docker.isRunning }, state.docker.info)
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

DockerPage.contextTypes = {
  store: PropTypes.object
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(DockerPage);
