import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Select from 'grommet/components/Select';
import Title from 'grommet/components/Title';
import Label from 'grommet/components/Label';
import Button from 'grommet/components/Button';
import Spinning from 'grommet/components/icons/Spinning';
import SidebarMenu from './SidebarMenu.jsx';
import { push } from 'react-router-redux';

import _ from 'underscore';
import storage from 'electron-json-storage';

import DockerIcon from 'grommet/components/icons/base/PlatformDocker';

import Tip from './Tip';
import actions from '../actions.js';

class Sidebar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      authInProgress: false,
      authResult: null
    }
  }

  componentWillMount() {
    // loading authResult from state store if exists
    const { store } = this.context;
    const state = store.getState();
    if (!state.docker.authResult) {
      storage.get('auth', (e, data) => {
        if (data.username) {
          actions.authenticate(data, true);
        }
      });
    } else {
      this.setState({
        authResult: state.docker.authResult
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authInProgress !== this.state.authInProgress ||
      !_.isEqual(nextProps.authResult, this.state.authResult)) {
      console.log('Sidebar.jsx');
      this.setState({
        authInProgress: nextProps.authInProgress,
        authResult: nextProps.authResult
      });
    }
  }

  profileOptionSelected(e) {
    switch(e.option) {
      case 'Log out': {
        actions.logOut();
        break;
      }
      default: {
        break;
      }
    }
  }

  render() {
    let component;
    if (!this.state.authInProgress) {
        // if authenticated successfully
      if (this.state.authResult && !this.state.authResult.error) {
        component = <Select className='shrinkSelect' options={['Log out']} value={this.state.authResult.username} onChange={this.profileOptionSelected}/>
        // if with error
      } else if (this.state.authResult && this.state.authResult.error) {
        component = (<Box pad='none'>
            <Button icon={<DockerIcon />} label='Sign in' id='authBtn' onClick={this.props.toggleModal}/>
            <Tip target={'authBtn'} onClose={this.props.logOut} text={'Unable to log in with given credentials'} />
          </Box>);
      } else {
        // not authorized
        component = <Button icon={<DockerIcon />} label='Sign in' onClick={this.props.toggleModal}/>
      }
    }
    return (
      <Box colorIndex={'grey-3'} full={'vertical'}>
        <Box justify={'start'} align={'center'} direction={'column'}>
          <Box justify={'between'} direction={'row'} alignContent={'between'} pad={{ vertical: 'medium', horizontal: 'medium' }} colorIndex={'grey-2'} className='sidebar'>
            <Box justify={'center'}>
              <Title>
                Riptide
              </Title>
            </Box>
            <Box justify={'center'}>
              { this.state.authInProgress ?
                <Spinning />
                :
                component
              }
            </Box>
          </Box>
        </Box>
              
        <Box pad={{ horizontal: 'none', vertical: 'small' }}>
          <Box pad={{ horizontal: 'small', vertical: 'small' }} direction={'row'} justify={'start'}>
            <Button
              label={<Label className={'bold'} align={'start'}>Docker</Label>}
              onClick={this.props.openDockerPage}
              plain={true} />
          </Box>
          <SidebarMenu />
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  authInProgress: state.docker.authInProgress,
  authResult: state.docker.authResult
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  openDockerPage: () => dispatch(push('/docker')),
  logOut: () => actions.logOut()
});

Sidebar.contextTypes = {
  store: PropTypes.object
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(Sidebar);
