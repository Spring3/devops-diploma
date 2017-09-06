import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import SearchInput from 'grommet/components/SearchInput';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';

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
    this.runImage = this.runImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
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

  runImage() {
  }

  deleteImage() {
    const { store } = this.context;
    const selectedImageId = store.getState().docker.images.selected.Id;
    actions.docker.getImage(selectedImageId).remove();
    store.dispatch({ type: 'REMOVE_SELECTED_IMAGE' });
    this.props.history.goBack();
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
    } else if (this.state.pathname === '/images/selected/') {
      result = (
        <Box direction='row' full='horizontal' justify='center'>
          <Button label='Run'
            onClick={this.runImage}
            accent={true}
            className='margin-right' />
          <Button label='Remove'
            onClick={this.deleteImage}
            critical={true}
            className='margin-right' />
        </Box>
      );
    }
    return result;
  }
}

TopMenu.contextTypes = {
  store: PropTypes.object
};

module.exports = withRouter(TopMenu);
