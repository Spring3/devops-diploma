import React from 'react';
import { connect } from 'react-redux';
import Box from 'grommet/components/Box';
import Select from 'grommet/components/Select';
import Title from 'grommet/components/Title';
import Label from 'grommet/components/Label';
import Button from 'grommet/components/Button';
import Tip from 'grommet/components/Tip';
import Spinning from 'grommet/components/icons/Spinning';
import SidebarMenu from './SidebarMenu.jsx';
import { push } from 'react-router-redux';

import _ from 'underscore';

import DockerIcon from 'grommet/components/icons/base/PlatformDocker';

class Sidebar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      authInProgress: false,
      authResult: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authInProgress !== this.state.authInProgress ||
      !_.isEqual(nextProps.authResult, this.state.authResult)) {
      this.setState({
        authInProgress: nextProps.authInProgress,
        authResult: nextProps.authResult
      });
    }
  }

  profileOptionSelected(e, option) {
    console.log(option);
  }

  render() {
    let component;
    if (!this.state.authInProgress) {
      if (this.state.authResult && !this.state.authResult.error) {
        component = <Select className='shrinkSelect' options={['Log out']} value={this.state.authResult.username} onChange={this.profileOptionSelected}/>
      } else if (this.state.authResult && this.state.authResult.error) {
        component = (<Box pad='none'>
            <Button icon={<DockerIcon />} label='Sign in' id='authBtn' onClick={this.props.toggleModal}/>
            <Tip target={'authBtn'} onClose={() => {}} colorIndex='light-2'>Wrong username or password</Tip>
          </Box>);
      } else {
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
  openDockerPage: () => dispatch(push('/docker'))
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Sidebar);
