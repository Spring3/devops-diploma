import React from 'react';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';

class ListOfApps extends React.Component {
  render() {
    return (
      <List selectable={true}>
        <ListItem justify={'start'} separator={'none'} pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span>
            Alan
          </span>
        </ListItem>
        <ListItem justify={'start'} separator={'none'} pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span>
            Chris
          </span>
        </ListItem>
        <ListItem justify={'start'} separator={'none'} pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span>
            Eric
          </span>
        </ListItem>
      </List>
    );
  }
}

module.exports = ListOfApps;
