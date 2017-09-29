import _ from 'underscore';

const initialState = {
  items: [],
  originalCount: 0
};


module.exports = (state = initialState, action) => {
  switch (action.type) {
    case 'DOCKER_UPDATE_STATS': {
      const stats = _.omit(action, 'type');
      if (stats.nodes.length !== state.originalCount) {
        return {
          items: stats.nodes,
          originalCount: stats.nodes.length
        };
      }
      return state;
    }
    default: {
      return state;
    }
  }
};
