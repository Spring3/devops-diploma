import React from 'react';
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Button from 'grommet/components/Button';
import ListOfApps from './ListOfApps';

import DockerIcon from 'grommet/components/icons/base/PlatformDocker';
import SettingsIcon from 'grommet/components/icons/base/Configure';

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
              href='#'
              plain={true} />
          </Box>
        </Box>
              
        <Box pad={{ horizontal: 'none', vertical: 'small' }}>
          <Box pad={{ horizontal: 'medium', vertical: 'small' }} direction={'row'}>
            <Title>
              Docker
            </Title>
            <Button
              href='#'
              icon={<SettingsIcon />} />
          </Box>
          <ListOfApps />
        </Box>
      </Box>
    );
  }
}

module.exports = Sidebar;
