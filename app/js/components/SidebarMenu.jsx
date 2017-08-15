import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CountTo from 'react-count-to';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import _ from 'underscore';

class SidebarMenu extends React.Component {
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
  componentDidMount() {
    const { store } = this.context;
    const state = _.pick(store.getState().docker, 'containers', 'images', 'services', 'nodes', 'tasks');
    this.setState(state);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.state, nextProps)) {
      console.log('SidebarMenu.jsx');
      console.log(nextProps);
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
            <CountTo to={this.state.containers} speed={1000} />
          </span>
        </ListItem>
        <ListItem justify={'between'} separator={'none'} pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span>
            Services
          </span>
          <span className='secondary'>
            <CountTo to={this.state.services} speed={1000} />
          </span>
        </ListItem>
        <ListItem justify={'between'} separator={'none'} pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span>
            Images
          </span>
          <span className='secondary'>
            <CountTo to={this.state.images} speed={1000} />
          </span>
        </ListItem>
        <ListItem justify={'between'} separator={'none'} pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span>
            Nodes
          </span>
          <span className='secondary'>
            <CountTo to={this.state.nodes} speed={1000} />
          </span>
        </ListItem>
        <ListItem justify={'between'} separator={'none'} pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span>
            Tasks
          </span>
          <span className='secondary'>
            <CountTo to={this.state.tasks} speed={1000} />
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

SidebarMenu.contextTypes = {
  store: PropTypes.object
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(SidebarMenu);
