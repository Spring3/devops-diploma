import React from 'react';
import { connect } from 'react-redux';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import _ from 'underscore';

class ListOfItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      containers: 0,
      images: 0,
      services: 0,
      nodes: 0,
      tasks: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.state, nextProps)) {
      this.setState(nextProps);
    }
  }

  render() {
    return (
      <List selectable={true}>
        <ListItem justify={'between'} separator={'none'} pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span>
            Containers
          </span>
          <span className='secondary'>
            {this.state.containers}
          </span>
        </ListItem>
        <ListItem justify={'between'} separator={'none'} pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span>
            Services
          </span>
          <span className='secondary'>
            {this.state.services}
          </span>
        </ListItem>
        <ListItem justify={'between'} separator={'none'} pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span>
            Images
          </span>
          <span className='secondary'>
            {this.state.images}
          </span>
        </ListItem>
        <ListItem justify={'between'} separator={'none'} pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span>
            Nodes
          </span>
          <span className='secondary'>
            {this.state.nodes}
          </span>
        </ListItem>
        <ListItem justify={'between'} separator={'none'} pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span>
            Tasks
          </span>
          <span className='secondary'>
            {this.state.tasks}
          </span>
        </ListItem>
      </List>
    );
  }
}

const mapStateToProps = state => ({
  containers: state.docker.containers,
  images: state.docker.images,
  services: state.docker.services,
  nodes: state.docker.nodes,
  tasks: state.docker.tasks
});

const mapDispatchToProps = dispatch => ({
  dispatch
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(ListOfItems);
