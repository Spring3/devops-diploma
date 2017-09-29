import _ from 'underscore';

const initialState = {
  sidebarOpen: true,
  showNotification: false,
  notificationMessage: '',
  notificationType: '',
  notificationProgress: null
};

module.exports = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR': {
      // sidebarOpen
      return Object.assign({}, state, { sidebarOpen: !state.sidebarOpen });
    }
    case 'SHOW_NOTIFICATION': {
      /*
        notificationMessage,
        notificationType,
        notificationProgress
       */
      return Object.assign({}, state, _.omit(action, 'type'), { showNotification: true });
    }
    case 'HIDE_NOTIFICATION': {
      return {
        sidebarOpen: state.sidebarOpen,
        showNotification: false,
        notificationMessage: '',
        notificationType: '',
        notificationProgress: null
      };
    }
    default: {
      return state;
    }
  }
};
