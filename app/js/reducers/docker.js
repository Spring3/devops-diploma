const initialState = {
  isRunning: false
};

module.exports = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_DOCKER_DAEMON_STATUS': {
      return Object.assign({}, state, { isRunning: action.isRunning });
    }
    default: {
      return state;
    }
  }
};
