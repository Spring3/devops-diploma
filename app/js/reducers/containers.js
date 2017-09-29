import _ from 'underscore';

const initialState = {
  items: [],
  originalCount: 0
};

module.exports = (state = initialState, action) => {
  switch (action.type) {
    case 'DOCKER_UPDATE_STATS': {
      const stats = _.omit(action, 'type');
      if (stats.containers.length !== state.originalCount) {
        return {
          items: stats.containers,
          originalCount: stats.containers.length
        };
      }
      return state;
    }
    default: {
      return state;
    }
  }
};
