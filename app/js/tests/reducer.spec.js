import expect from 'expect';
import freeze from 'deep-freeze';
import containersReducer from '../reducers/containers';
import imageBuildReducer from '../reducers/imageBuild';
import nodesReducer from '../reducers/nodes';
import servicesReducer from '../reducers/services';
import tasksReducer from '../reducers/tasks';
import mainReducer from '../reducers/main';
import dockerReducer from '../reducers/docker';

describe('containers reducer', () => {
  it('should return initial state [ unknown action ]', () => {
    const action = { type: 'random' };
    expect(containersReducer(undefined, action))
      .toEqual({
        items: [],
        originalCount: 0
      });
  });

  it('should update containers stats', () => {
    const initialState = containersReducer(undefined, { type: 'random ' });
    const action = {
      type: 'DOCKER_UPDATE_STATS',
      containers: [1, 2, 3, 4, 5, 6, 7]
    };
    expect(containersReducer(freeze(initialState), action))
      .toEqual({
        items: action.containers,
        originalCount: action.containers.length
      });
  });
});

describe('docker reducer', () => {
  let initialState;
  it('should return initial state [unknown action]', () => {
    initialState = dockerReducer(undefined, { type: 'random' });
    expect(initialState.common).toEqual({
      isRunning: false,
      authInProgress: false,
      info: {},
      config: {
        connection: '',
        socket: '',
        host: '',
        port: ''
      },
      authResult: null
    });
  });

  it('should update docker stats', () => {
    const action = {
      type: 'DOCKER_UPDATE_STATS',
      isRunning: true,
      images: [],
      containers: [],
      services: [],
      nodes: [],
      tasks: []
    };
    expect(dockerReducer(freeze(initialState), action).common).toEqual({
      isRunning: true,
      authInProgress: false,
      info: {},
      config: {
        connection: '',
        socket: '',
        host: '',
        port: ''
      },
      authResult: null
    });
  });

  it('should update docker info', () => {
    const action = {
      type: 'DOCKER_INFO',
      info: {
        version: '1.2'
      }
    };
    expect(dockerReducer(freeze(initialState), action).common).toEqual({
      isRunning: false,
      authInProgress: false,
      info: {
        version: '1.2'
      },
      config: {
        connection: '',
        socket: '',
        host: '',
        port: ''
      },
      authResult: null
    });
  });

  it('should update docker config', () => {
    const action = {
      type: 'DOCKER_CONFIG',
      socket: 'pathToSocket',
      connection: 'socket'
    };
    expect(dockerReducer(freeze(initialState), action).common).toEqual({
      isRunning: false,
      authInProgress: false,
      info: {},
      config: {
        connection: 'socket',
        socket: 'pathToSocket'
      },
      authResult: null
    });
  });

  it('should update docker auth result', () => {
    const action = {
      type: 'DOCKER_AUTH',
      username: 'hello',
      password: 'world',
      registry: 'google.com'
    };
    expect(dockerReducer(freeze(initialState), action).common).toEqual({
      isRunning: false,
      authInProgress: false,
      info: {},
      config: {
        connection: '',
        socket: '',
        host: '',
        port: ''
      },
      authResult: {
        username: 'hello',
        password: 'world',
        registry: 'google.com'
      }
    });
  });

  it('should start auth', () => {
    const action = {
      type: 'DOCKER_AUTH_START'
    };
    expect(dockerReducer(freeze(initialState), action).common)
      .toEqual(Object.assign({}, initialState.common, { authInProgress: true }));
  });

  it('should end auth', () => {
    const action = {
      type: 'DOCKER_AUTH_END'
    };
    expect(dockerReducer(freeze(initialState), action).common)
      .toEqual(Object.assign({}, initialState.common, { authInProgress: false }));
  });

  it('should log out', () => {
    const stateCopy = Object.assign({}, initialState, {
      common: {
        username: 'hello',
        password: 'world',
        registry: 'google.com'
      }
    });
    const action = {
      type: 'DOCKER_LOG_OUT'
    };

    expect(dockerReducer(freeze(stateCopy), action))
      .toEqual(stateCopy);
  });
});

describe('imageBuild reducer', () => {
  let initialState;
  it('should return initial state [unknown command]', () => {
    initialState = imageBuildReducer(undefined, { type: 'random' });
    expect(initialState).toEqual({
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
    });
  });

  it('should import dockerfile', () => {
    const action = {
      type: 'IMPORT_DOCKERFILE',
      data: {
        HELLO: 'world',
        TO: 'everyone',
        WINTER: 'is coming',
        IM_NOT: 'your father... I guess'
      }
    };
    expect(imageBuildReducer(freeze(initialState), action))
      .toEqual({
        fields: ['FROM', 'CMD', 'EXPOSE', 'ENV', ...Object.keys(action.data)],
        data: {
          FROM: '',
          CMD: '',
          EXPOSE: '',
          ENV: '',
          HELLO: 'world',
          TO: 'everyone',
          WINTER: 'is coming',
          IM_NOT: 'your father... I guess'
        },
        destination: undefined,
        filePath: undefined,
        fileName: undefined
      });
  });

  it('should pick image field [tick]', () => {
    const action = {
      type: 'PICK_IMAGE_FIELD',
      used: true,
      field: 'WORKDIR'
    };
    expect(imageBuildReducer(freeze(initialState), action))
      .toEqual({
        fields: ['FROM', 'CMD', 'EXPOSE', 'ENV', `${action.field}`],
        data: {
          FROM: '',
          CMD: '',
          EXPOSE: '',
          ENV: '',
          [action.field]: ''
        },
        destination: undefined,
        filePath: undefined,
        fileName: undefined
      });
  });

  it('should remove picked image field [untick]', () => {
    const action = {
      type: 'PICK_IMAGE_FIELD',
      used: false,
      field: 'FROM'
    };
    expect(imageBuildReducer(freeze(initialState), action))
      .toEqual({
        fields: ['CMD', 'EXPOSE', 'ENV'],
        data: {
          CMD: '',
          EXPOSE: '',
          ENV: ''
        },
        destination: undefined,
        filePath: undefined,
        fileName: undefined
      });
  });

  it('should set dockerfile destination', () => {
    const action = {
      type: 'SET_DESTINATION',
      destination: '/home/',
      filePath: '/home/',
      fileName: 'Dockerfile'
    };
    expect(imageBuildReducer(freeze(initialState), action))
      .toEqual({
        fields: ['FROM', 'CMD', 'EXPOSE', 'ENV'],
        data: {
          FROM: '',
          CMD: '',
          EXPOSE: '',
          ENV: ''
        },
        destination: action.destination,
        filePath: action.filePath,
        fileName: action.fileName
      });
  });

  it('should delete info about dockerfile', () => {
    const stateWithDockerfileInfo = Object.assign({}, initialState, {
      destination: '/home/',
      filePath: '/home/',
      fileName: 'Dockerfile'
    });
    const action = {
      type: 'DELETE_DOCKERFILE'
    };
    expect(imageBuildReducer(freeze(stateWithDockerfileInfo), action))
      .toEqual(Object.assign({}, initialState, {
        destination: stateWithDockerfileInfo.destination
      }));
  });

  it('should keep changed image value', () => {
    const action = {
      type: 'IMAGE_VALUE_CHANGE',
      field: 'FROM',
      value: 'node:latest'
    };
    expect(imageBuildReducer(freeze(initialState), action))
      .toEqual({
        fields: ['FROM', 'CMD', 'EXPOSE', 'ENV'],
        data: {
          FROM: action.value,
          CMD: '',
          EXPOSE: '',
          ENV: ''
        },
        destination: undefined,
        filePath: undefined,
        fileName: undefined
      });
  });
});

describe('main reducer', () => {
  let initialState;
  it('should return initialState [unknown action]', () => {
    const action = { type: 'unkown' };
    initialState = mainReducer(undefined, action);
    expect(initialState).toEqual({
      sidebarOpen: true,
      showNotification: false,
      notificationMessage: '',
      notificationType: '',
      notificationProgress: null
    });
  });

  it('should toggle sidebar', () => {
    const action = { type: 'TOGGLE_SIDEBAR' };
    expect(mainReducer(freeze(initialState), action))
      .toEqual(Object.assign({}, initialState, {
        sidebarOpen: !initialState.sidebarOpen
      }));
  });

  it('should show notification', () => {
    const action = {
      type: 'SHOW_NOTIFICATION',
      notificationMessage: 'message',
      notificationType: 'ok',
      notificationProgress: 0
    };
    expect(mainReducer(freeze(initialState), action))
      .toEqual(Object.assign({}, initialState, {
        showNotification: true,
        notificationMessage: 'message',
        notificationType: 'ok',
        notificationProgress: 0
      }));
  });

  it('should hide notification', () => {
    const stateWithNotification = {
      sidebarOpen: true,
      showNotification: true,
      notificationMessage: 'message',
      notificationType: 'ok',
      notificationProgress: 0
    };
    const action = { type: 'HIDE_NOTIFICATION' };
    expect(mainReducer(freeze(stateWithNotification), action))
      .toEqual(initialState);
  });
});

describe('nodes reducer', () => {
  let initialState;
  it('should return default state [unknown action]', () => {
    const action = { type: 'random' };
    initialState = nodesReducer(undefined, action);
    expect(initialState).toEqual({
      items: [],
      originalCount: 0
    });
  });

  it('should update docker stats about nodes', () => {
    const action = {
      type: 'DOCKER_UPDATE_STATS',
      nodes: [1, 2, 3, 4, 5]
    };
    expect(nodesReducer(freeze(initialState), action))
      .toEqual({
        items: action.nodes,
        originalCount: action.nodes.length
      });
  });
});

describe('services reducer', () => {
  let initialState;
  it('should return default state [unknown action]', () => {
    const action = { type: 'random' };
    initialState = servicesReducer(undefined, action);
    expect(initialState).toEqual({
      items: [],
      originalCount: 0
    });
  });

  it('should update docker stats about services', () => {
    const action = {
      type: 'DOCKER_UPDATE_STATS',
      services: [1, 2, 3, 4, 5]
    };
    expect(servicesReducer(freeze(initialState), action))
      .toEqual({
        items: action.services,
        originalCount: action.services.length
      });
  });
});

describe('tasks reducer', () => {
  let initialState;
  it('should return default state [unknown action]', () => {
    const action = { type: 'random' };
    initialState = tasksReducer(undefined, action);
    expect(initialState).toEqual({
      items: [],
      originalCount: 0
    });
  });

  it('should update docker stats about services', () => {
    const action = {
      type: 'DOCKER_UPDATE_STATS',
      tasks: [1, 2, 3, 4, 5]
    };
    expect(tasksReducer(freeze(initialState), action))
      .toEqual({
        items: action.tasks,
        originalCount: action.tasks.length
      });
  });
});

