const initialState = {
  fields: ['FROM', 'CMD', 'EXPOSE', 'ENV'],
  data: {
    FROM: '',
    CMD: '',
    EXPOSE: '',
    ENV: ''
  },
  destination: undefined,
  filePath: undefined,
  fileName: undefined
};

module.exports = (state = initialState, action) => {
  switch (action.type) {
    case 'IMPORT_DOCKERFILE': {
      const nextState = Object.assign({}, state);
      nextState.data = Object.assign({}, state.data, action.data);
      nextState.fields = state.fields.concat(Object.keys(action.data)
        .filter(item => !state.fields.includes(item)));
      return nextState;
    }
    // checkboxes on image build page
    case 'PICK_IMAGE_FIELD': {
      // if not ticked, but should be used
      if (action.used && !state.fields.includes(action.field)) {
        // tick
        return Object.assign({}, state, {
          fields: [...state.fields, action.field],
          data: Object.assign({}, state.data, { [action.field]: '' })
        });
      // if ticked and it should'b be
      } else if (!action.used && state.fields.includes(action.field)) {
        // untick
        const data = Object.assign({}, state.data);
        delete data[action.field];
        return Object.assign({}, state, {
          fields: state.fields.filter(i => i !== action.field),
          data
        });
      }
      return state;
    }
    case 'SET_DESTINATION': {
      return Object.assign({}, state, {
        destination: action.destination,
        filePath: action.filePath,
        fileName: action.fileName
      });
    }
    case 'DELETE_DOCKERFILE': {
      return Object.assign({}, state, {
        filePath: undefined,
        fileName: undefined
      });
    }
    case 'IMAGE_VALUE_CHANGE': {
      const { field, value } = action;
      if (state.fields.includes(field) && {}.hasOwnProperty.call(state.data, field)) {
        const data = Object.assign({}, state.data, { [field]: value });
        return Object.assign({}, state, {
          fields: state.fields,
          data
        });
      }
      return state;
    }
    default: {
      return state;
    }
  }
};
