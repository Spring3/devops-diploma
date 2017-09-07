import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import SearchInput from 'grommet/components/SearchInput';

import actions from '../actions/actions.js';

const locationsWithSearch = ['/images'];

class TopMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      historyListener: null,
      pathname: '/'
    };
    this.listener = this.listener.bind(this);
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    const history = this.props.history;
    this.setState({
      historyListener: history.listen(this.listener)
    });
  }

  componentWillUnmount() {
    this.state.historyListener();
  }

  listener({ pathname }) {
    console.log(pathname);
    this.setState({ pathname });
  }

  search(e) {
    let target;
    if (this.state.pathname.includes('images')) {
      target = 'images';
    }
    actions.docker.search(target, e.target.value.trim());
  }

  render() {
    let result = null;
    if (locationsWithSearch.includes(this.state.pathname)) {
      result = (<SearchInput className="borderless" onDOMChange={this.search} />);
    }
    return result;
  }
}

TopMenu.contextTypes = {
  store: PropTypes.object
};

module.exports = withRouter(TopMenu);
