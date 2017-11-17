import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';

import Download from 'grommet/components/icons/base/DocumentDownload';
import Search from 'grommet/components/icons/base/Search';
import Trash from 'grommet/components/icons/base/Trash';
import Up from 'grommet/components/icons/base/Up';
import Open from 'grommet/components/icons/base/FolderOpen';

import actions from '../actions/actions.js';

class ComposeBuildPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toast: false,
      toastMessage: '',
      destination: '',
      fileName: this.props.fileName,
      filePath: this.props.filePath
    };
    this.pickDestination = this.pickDestination.bind(this);
  }

  componentDidMount() {
    this.destinationPicker.directory = true;
    this.destinationPicker.webkitdirectory = true;
  }

  componentWillReceiveProps(nextProps) {
    const nextState = {};
    if (this.state.destination !== nextProps.destination) {
      nextState.destination = nextProps.destination;
    }

    if (this.state.fileName !== nextProps.fileName || this.state.filePath !== nextProps.filePath) {
      nextState.fileName = nextProps.fileName;
      nextState.filePath = nextProps.filePath;
    }

    this.setState(nextState);
  }

  pickDestination(e) {
    const { store } = this.context;
    const file = e.target.files[0];
    actions.lookupComposeFile(file)
    .then((filePath) => {
      store.dispatch({
        type: 'SET_COMPOSE_DESTINATION',
        destination: file.path,
        filePath: file.path,
        fileName: 'docker-compose.yml'
      });
    })
    .catch(() => {
      store.dispatch({
        type: 'SET_COMPOSE_DESTINATION',
        destination: file.path,
        filePath: undefined,
        fileName: undefined
      });
    });
  }

  render() {
    return(
      <Box>
        <Box direction='row' pad={{ horizontal: 'medium' }} className='left-padded' style={{ marginRight: '220px' }}>
          <Box className='wrapper-borderless' full='horizontal' alignContent="stretch">
            <Box direction='row' justify='start' alignSelf='stretch' align='center' style={{ background: 'white', position: 'fixed', zIndex: 999, width: '100%' }}>
              <Button icon={<Open />}
                  box={true}
                  label='Destination'
                  plain={true}
                  onClick={() => this.destinationPicker.click()}
                  a11yTitle='Destination'
                  className='btn-small'
                />
                <Button icon={<Download />}
                  box={true}
                  label='Save'
                  onClick={this.state.destination ? this.buildComposeFile : null}
                  plain={true}
                  a11yTitle='Save'
                  className='btn-small' />
                <Button icon={<Up />}
                  onClick={this.state.filePath ? this.composeUp : null}
                  a11yTitle='Up'
                  label='Up'
                  plain={true}
                  className='btn-small'
                />
                <Button icon={<Search />}
                  box={true}
                  onClick={this.state.fileName ? this.togglePreview : null}
                  a11yTitle='Preview'
                  label='Preview'
                  plain={true}
                  className='btn-small'
                  />
                <Button icon={<Trash />}
                  box={true}
                  label='Delete'
                  a11yTitle='Delete'
                  onClick={this.state.fileName ? this.deleteFile : null}
                  plain={true}
                  className='btn-small'
                  />
                <input ref={ input => this.destinationPicker = input } onChange={this.pickDestination} type='file' style={{ visibility: 'hidden' }} />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

const mapDispatchToProps = dispatch => ({ dispatch });

const mapStateToProps = state => ({
  destination: state.docker.build.compose.destination,
  fileName: state.docker.build.compose.fileName,
  filePath: state.docker.build.compose.filePath
});

ComposeBuildPage.contextTypes = {
  store: PropTypes.object
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ComposeBuildPage);
