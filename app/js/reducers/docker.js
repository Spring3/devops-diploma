import _ from 'underscore';

const initialState = {
  isRunning: false,
  containers: 0,
  images: 0,
  services: 0,
  tasks: 0,
  nodes: 0
};

module.exports = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_DOCKER_STATS': {
      return Object.assign({}, state, _.omit(action, 'type'));
    }
    default: {
      return state;
    }
  }
};
