import expect from 'expect';
import freeze from 'deep-freeze';
import mainReducer from '../reducers/main';
import dockerReducer from '../reducers/docker';

describe('main reducer', () => {
  const initialState = {
    sidebarOpen: true
  };

  it('should return initialState [unknown action]', () => {
    expect(mainReducer(freeze(initialState), { type: 'random' }))
      .toEqual(initialState);
  });

  it('should toggle sidebar', () => {
    expect(mainReducer(freeze(initialState), { type: 'TOGGLE_SIDEBAR' }))
      .toEqual({ sidebarOpen: !initialState.sidebarOpen });
  });
});

describe('docker reducer', () => {
  const initialState = {
    isRunning: false,
    containers: 0,
    images: 0,
    services: 0,
    tasks: 0,
    nodes: 0,
    authInProgress: false,
    authResult: null
  };

  it('should return initial state [unknown action]', () => {
    expect(dockerReducer(freeze(initialState), { type: 'random' }))
      .toEqual(initialState);
  });

  it('should start auth', () => {
    const newState = dockerReducer(freeze(initialState), { type: 'DOCKER_AUTH_START' });
    expect(newState.authInProgress).toEqual(true);
  });

  it('should end auth', () => {
    const newState = dockerReducer(freeze(initialState), { type: 'DOCKER_AUTH_END' });
    expect(newState.authInProgress).toEqual(false);
  });

  it('should authenticate', () => {
    const authResult = {
      hello: 'world',
      to: 'everyone'
    };
    const action = freeze(Object.assign({ type: 'DOCKER_AUTH' }, authResult));
    const newState = dockerReducer(undefined, action);
    expect(newState.authResult).toEqual(authResult);
  });

  it('should logout', () => {
    const state = Object.assign({}, initialState, { authResult: {
      hello: 'world',
      to: 'everyone'
    } });
    const newState = dockerReducer(freeze(state), { type: 'DOCKER_LOG_OUT' });
    expect(newState.authResult).toEqual(null);
  });

  it('should update docker stats', () => {
    const action = {
      type: 'DOCKER_UPDATE_STATS',
      containers: 10,
      images: 20
    };
    const newState = dockerReducer(undefined, action);
    expect(newState.containers).toEqual(10);
    expect(newState.images).toEqual(20);
  });
});
