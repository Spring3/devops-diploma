import React from 'react';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';

class ListOfApps extends React.Component {
  render() {
    return (
      <List selectable={true}>
        <ListItem justify={'between'} separator={'none'} pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span>
            Containers
          </span>
          <span className='secondary'>
            0
          </span>
        </ListItem>
        <ListItem justify={'between'} separator={'none'} pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span>
            Services
          </span>
          <span className='secondary'>
            0
          </span>
        </ListItem>
        <ListItem justify={'between'} separator={'none'} pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span>
            Images
          </span>
          <span className='secondary'>
            0
          </span>
        </ListItem>
      </List>
    );
  }
}

module.exports = ListOfApps;
