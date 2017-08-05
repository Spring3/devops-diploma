import React from 'react';
import Header from '../components/Header.jsx';
import Wrapper from 'grommet/components/App';
import Box from 'grommet/components/Box';
import Navbar from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Menu from 'grommet/components/Menu';
import ActionsIcon from 'grommet/components/icons/base/Action';
import LoginIcon from 'grommet/components/icons/base/Login';
import Button from 'grommet/components/Button';

class App extends React.Component {
  render() {
    return (
      <Wrapper centered={false}>
        <Header/>
        <Box pad={'small'} separator={'bottom'}>
          <Navbar fixed={true} size={'small'}>
            <Title>
              Yen
            </Title>
            <Box flex={true} justify={'end'} direction={'row'}>
              <Button icon={<LoginIcon />}
                label='Sign in'
                href='#'
                primary={false}
                secondary={false}
                accent={false}
                critical={false}
                plain={true} />
            </Box>
          </Navbar>
        </Box>
      </Wrapper>
    );
  }
}

module.exports = App;
