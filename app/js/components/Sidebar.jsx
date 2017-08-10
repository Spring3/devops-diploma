import React from 'react';
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Label from 'grommet/components/Label';
import Button from 'grommet/components/Button';
import ListOfItems from './ListOfItems.jsx';

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
              href='#'
              plain={true} />
          </Box>
          <ListOfItems />
        </Box>
      </Box>
    );
  }
}

module.exports = Sidebar;
