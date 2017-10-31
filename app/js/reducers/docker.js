import _ from 'underscore';
import { combineReducers } from 'redux';
import images from './images';
import imagesBuild from './imageBuild';
import composeBuild from './composeBuild';
import containers from './containers';
import services from './services';
import tasks from './tasks';
import nodes from './nodes';

const initialState = {
  isRunning: false,
  authInProgress: false,
  info: {},
  config: {
    connection: '',
    socket: '',
    host: '',
    port: ''
  },
  authResult: null
};

const docker = (state = initialState, action) => {
  // TODO: refactor, remove duplication
  switch (action.type) {
    case 'DOCKER_UPDATE_STATS': {
      const stats = _.omit(action, 'type');
      if (stats.isRunning !== state.isRunning) {
        return Object.assign({}, state, { isRunning: stats.isRunning });
      }
      return state;
    }
    case 'DOCKER_INFO': {
      return Object.assign({}, state, _.pick(action, 'info'));
    }
    case 'DOCKER_CONFIG': {
      return Object.assign({}, state, { config: _.omit(action, 'type') });
    }
    case 'DOCKER_AUTH': {
      return Object.assign({}, state, { authResult: _.omit(action, 'type') });
    }
    case 'DOCKER_AUTH_START': {
      return Object.assign({}, state, { authInProgress: true });
    }
    case 'DOCKER_AUTH_END': {
      return Object.assign({}, state, { authInProgress: false });
    }
    case 'DOCKER_LOG_OUT': {
      const stateCopy = Object.assign({}, state);
      return _.omit(stateCopy, 'authResult');
    }
    default: {
      return state;
    }
  }
};

module.exports = combineReducers({
  common: docker,
  images,
  build: combineReducers({
    images: imagesBuild,
    compose: composeBuild
  }),
  containers,
  services,
  nodes,
  tasks
});
