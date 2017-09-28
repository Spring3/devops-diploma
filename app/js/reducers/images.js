import _ from 'underscore';

const initialState = {
  selected: {},
  searchResult: [],
  items: [],
  originalCount: 0
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
  switch (action.type) {
    case 'DOCKER_UPDATE_STATS': {
      const stats = _.omit(action, 'type');
      let shouldUpdate = false;
      if (state.items.length > 0) {
        const newestImage = state.items[0];
        shouldUpdate = newestImage.repo === '<none>' && newestImage.tag === '<none>';
      }
      if (stats.images.length !== state.originalCount || shouldUpdate) {
        return {
          items: mapImages(stats.images),
          originalCount: stats.images.length
        };
      }
      return state;
    }
    case 'SELECT_IMAGE' : {
      return Object.assign({}, state, { selected: action.info });
    }
    case 'SEARCH': {
      if (!action.target) {
        return state;
      }
      const { target, query } = action;
      let searchResult;
      switch (target) {
        case 'images': {
          searchResult = searchImages(state.items, query);
          break;
        }
        default: {
          searchResult = null;
        }
      }

      if (!searchResult) {
        return state;
      }

      state.searchResult = searchResult; // eslint-disable-line no-param-reassign
      return Object.assign({}, state);
    }
    case 'REMOVE_SELECTED_IMAGE': {
      return Object.assign({}, state, { selected: {} });
    }
    default: {
      return state;
    }
  }
};
