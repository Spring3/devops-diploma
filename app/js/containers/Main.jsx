import React from 'react';
import Box from 'grommet/components/Box';
import MainTabs from '../components/MainTabs.jsx';
import UtilityPane from '../components/UtilityPane.jsx';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box justify={'end'} direction={'row'} full={'horizontal'} alignContent={'end'}>
        <Box flex={true} pad={{ vertical: 'none', horizontal: 'medium' }}>
          <MainTabs />
        </Box>
        <UtilityPane />
      </Box>
    );
  }
}

module.exports = MainPage;
