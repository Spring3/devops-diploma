const initialState = {
  fields: ['FROM', 'CMD', 'EXPOSE', 'ENV'],
  data: {
    FROM: '',
    CMD: '',
    EXPOSE: '',
    ENV: ''
  }
};

module.exports = (state = initialState, action) => {
  switch (action.type) {
    case 'IMPORT_DOCKERFILE': {
      const nextState = Object.assign({}, state);
      nextState.data = action.data;
      nextState.fields = Object.keys(action.data);
      return nextState;
    }
    case 'PICK_IMAGE_FIELD': {
      // if should be used
      if (action.used && !state.fields.includes(action.field)) {
        return {
          fields: [...state.fields, action.field],
          data: Object.assign(state.data, { [action.field]: '' })
        };
      } else if (!action.used && state.fields.includes(action.field)) {
        const data = Object.assign({}, state.data);
        delete data[action.field];
        return {
          fields: state.fields.filter(i => i !== action.field),
          data
        };
      }
      return state;
    }
    case 'IMAGE_VALUE_CHANGE': {
      const { field, value } = action;
      if (state.fields.includes(field) && {}.hasOwnProperty.call(state.data, field)) {
        const data = Object.assign({}, state.data, { [field]: value });
        return {
          fields: state.fields,
          data
        };
      }
      return state;
    }
    default: {
      return state;
    }
  }
};
