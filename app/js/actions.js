import docker from './modules/docker.js';
import { createStore, applyMiddleware } from 'redux';
import combinedReducer from './reducers/reducers.js';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createMemoryHistory';
import storage from 'electron-json-storage';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

// react-router-redux setup
const history = createHistory();
const middleware = routerMiddleware(history);
const store = createStore(combinedReducer, applyMiddleware(middleware));

class Actions {
  constructor() {
    this.store = store;
    this.updateDockerInfo = this.updateDockerInfo.bind(this);
    this.checkDocker = this.checkDocker.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  updateDockerInfo() {
    docker.getVersion()
      .then((info) => {
        this.store.dispatch({
          type: 'UPDATE_DOCKER_INFO',
          info
        });
      });
  }

  checkDocker() {
    this.store.dispatch(showLoading());
    const status = {
      type: 'UPDATE_DOCKER_STATS',
      isRunning: false,
      containers: 0,
      images: 0,
      services: 0,
      nodes: 0,
      tasks: 0
    };
    docker.isRunning().then((running) => {
      if (running) {
        Promise.all([
          docker.getContainers(true),
          docker.getImages(true),
          docker.getServices(),
          docker.getNodes(),
          docker.getTasks()
        ]).then((result) => {
          Object.assign(status, {
            isRunning: running,
            containers: result[0].length,
            images: result[1].length,
            services: result[2].length,
            nodes: result[3].length,
            tasks: result[4].length
          });
          this.store.dispatch(status);
        }).catch(() => {
          this.store.dispatch(status);
        });
      } else {
        this.store.dispatch(status);
        this.store.dispatch(hideLoading());
      }
    });
  }

  logOut() {
    storage.remove('auth');
    this.store.dispatch({ type: 'DOCKER_LOG_OUT' });
  }

  authenticate(data, cached = false) {
    this.store.dispatch(showLoading());
    // if from storage
    if (cached) {
      this.store.dispatch(Object.assign({ type: 'DOCKER_AUTH' }, data));
    }
    this.store.dispatch({ type: 'DOCKER_AUTH_START' });
    const request = {
      username: data.username,
      password: data.password,
      serverAddress: data.customRegistry ? data.registry : docker.config.registry
    };
    docker.instance.checkAuth(request)
      .then((result) => {
        const response = { type: 'DOCKER_AUTH', username: request.username };
        this.store.dispatch(Object.assign(response, result));
        if (data.remember) {
          storage.set('auth', {
            serverAddress: request.serverAddress,
            username: request.username,
            token: result.IdentityToken
          });
        }
        this.store.dispatch({ type: 'DOCKER_AUTH_END' });
        this.store.dispatch(hideLoading());
      })
      .catch((e) => {
        this.store.dispatch({ type: 'DOCKER_AUTH', error: e });
        this.store.dispatch({ type: 'DOCKER_AUTH_END' });
        this.store.dispatch(hideLoading());
      });
  }

  toggleSidebar() {
    this.store.dispatch({ type: 'TOGGLE_SIDEBAR' });
  }
}

module.exports = new Actions();
module.exports.history = history;
