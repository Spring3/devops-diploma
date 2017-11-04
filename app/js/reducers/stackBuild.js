const initialState = {
  destination: null,
  filePath: null,
  fileName: null,
  volumes: [],
  networks: [],
  services: []
};

module.exports = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_STACK_DESTINATION': {
      return Object.assign({}, state, {
        fileName: action.fileName,
        filePath: action.filePath,
        destination: action.destination
      });
    }
    case 'SET_STACK_VOLUME': {
      if (!action.volume) {
        break;
      }
      return Object.assign({}, state, {
        volumes: [...state.volumes, action.volume]
      });
    }
    case 'REMOVE_STACK_VOLUME': {
      if (!action.volume) {
        break;
      }
      const newVolumes = [];
      for (const volume of state.volumes) {
        if (volume.name !== action.volume) {
          newVolumes.push(volume);
        }
      }
      return Object.assign({}, state, {
        volumes: newVolumes
      });
    }
    case 'SET_STACK_NETWORK': {
      if (!action.network) {
        break;
      }
      return Object.assign({}, state, {
        networks: [...state.networks, action.network]
      });
    }
    case 'REMOVE_STACK_NETWORK': {
      if (!action.network) {
        break;
      }
      const newNetworks = [];
      for (const network of state.networks) {
        if (network.name !== action.network) {
          newNetworks.push(network);
        }
      }
      return Object.assign({}, state, {
        networks: newNetworks
      });
    }
    case 'SET_STACK_SERVICE': {
      if (!action.service) {
        break;
      }
      return Object.assign({}, state, {
        services: [...state.services, action.service]
      });
    }
    case 'REMOVE_STACK_SERVICE': {
      if (!action.service) {
        break;
      }
      const newServices = [];
      for (const service of state.services) {
        if (service.name !== action.service) {
          newServices.push(service);
        }
      }
      return Object.assign({}, state, {
        services: newServices
      });
    }
    default: {
      return state;
    }
  }
};
