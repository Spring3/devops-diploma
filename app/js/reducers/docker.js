import _ from 'underscore';

const initialState = {
  isRunning: false,
  containers: 0,
  images: 0,
  services: 0,
  tasks: 0,
  nodes: 0,
  authInProgress: false,
  authResult: null
};

module.exports = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_DOCKER_STATS': {
      return Object.assign({}, state, _.omit(action, 'type'));
    }
    case 'UPDATE_DOCKER_INFO': {
      return Object.assign({}, state, _.omit(action, 'type'));
    }
    case 'DOCKER_AUTH': {
      return Object.assign({}, state, { authResult: _.omit(action, 'type') });
    }
    case 'DOCKER_AUTH_RESET': {
      return Object.assign({}, _.omit(state, 'authResult'));
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
