import _ from 'underscore';

const initialState = {
  isRunning: false,
  containers: {
    items: [],
    originalCount: 0
  },
  images: {
    selected: {},
    searchResult: [],
    items: [],
    originalCount: 0
  },
  services: {
    items: [],
    originalCount: 0
  },
  tasks: {
    items: [],
    originalCount: 0
  },
  nodes: {
    items: [],
    originalCount: 0
  },
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

function mapImages(images) {
  const result = [];
  for (const image of images) {
    const mappedImage = {
      id: image.Id.split(':')[1],
      created: image.Created * 1000,
      size: image.Size
    };
    if (image.RepoTags) {
      for (const tag of image.RepoTags) {
        const imageData = tag.split(':');
        Object.assign(mappedImage, {
          repo: imageData[0],
          tag: imageData.length > 1 ? imageData[1] : '<none>'
        });
        result.push(mappedImage);
      }
    } else if (image.RepoDigests) {
      Object.assign(mappedImage, {
        repo: image.RepoDigests[0].split('@')[0],
        tag: '<none>'
      });
      result.push(mappedImage);
    }
  }
  return result;
}

function searchImages(images, query) {
  if (!query) {
    return [];
  }
  return images.filter((image) => {
    if (image.id.includes(query) || image.repo.includes(query) || image.tag.includes(query)) {
      return true;
    }
    return false;
  });
}

module.exports = (state = initialState, action) => {
  // TODO: refactor, remove duplication
  switch (action.type) {
    case 'DOCKER_UPDATE_STATS': {
      const stats = _.omit(action, 'type');
      const changes = {};
      if (stats.isRunning !== state.isRunning) {
        changes.isRunning = stats.isRunning;
      }
      if (stats.containers.length !== state.containers.originalCount) {
        changes.containers = {
          items: stats.containers,
          originalCount: stats.containers.length
        };
      }
      if (stats.images.length !== state.images.originalCount) {
        changes.images = {
          items: mapImages(stats.images),
          originalCount: stats.images.length
        };
      }
      if (stats.services.length !== state.services.originalCount) {
        changes.services = {
          items: stats.services,
          originalCount: stats.images.length
        };
      }
      if (stats.tasks.length !== state.tasks.originalCount) {
        changes.tasks = {
          items: stats.tasks,
          originalCount: stats.tasks.length
        };
      }
      if (stats.nodes.length !== state.nodes.originalCount) {
        changes.nodes = {
          items: stats.nodes,
          originalCount: stats.nodes.length
        };
      }
      return Object.assign({}, state, changes);
    }
    case 'SELECT_IMAGE' : {
      const newState = Object.assign({}, state);
      newState.images.selected = action.info;
      return newState;
    }
    case 'SEARCH': {
      if (!action.target) {
        return state;
      }
      const { target, query } = action;
      let searchResult;
      switch (target) {
        case 'images': {
          searchResult = searchImages(state.images.items, query);
          break;
        }
        default: {
          searchResult = null;
        }
      }

      if (!searchResult) {
        return state;
      }

      state[target].searchResult = searchResult; // eslint-disable-line no-param-reassign
      return Object.assign({}, state);
    }
    case 'REMOVE_SELECTED_IMAGE': {
      const newState = Object.assign({}, state);
      newState.images.selected = {};
      return newState;
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
