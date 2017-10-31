const initialState = {
  destination: null,
  filePath: null,
  fileName: null
};

module.exports = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_COMPOSE_DESTINATION': {
      return Object.assign({}, state, {
        fileName: action.fileName,
        filePath: action.filePath,
        destination: action.destination
      });
    }
    default: {
      return state;
    }
  }
};
