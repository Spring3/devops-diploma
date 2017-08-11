import React from 'react';
import { connect } from 'react-redux';
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Label from 'grommet/components/Label';
import Button from 'grommet/components/Button';
import SidebarMenu from './SidebarMenu.jsx';
import { push } from 'react-router-redux';

import DockerIcon from 'grommet/components/icons/base/PlatformDocker';

class Sidebar extends React.Component {
  render() {
    return (
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
              href='#'/>
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

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  dispatch,
  openDockerPage: () => dispatch(push('/docker'))
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Sidebar);
