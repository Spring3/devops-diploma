import storage from 'electron-json-storage';
import docker from './../modules/docker';
import ImageActions from './imagesAction';

import Action from './action';

class DockerAction extends Action {
  constructor(store) {
    super();
    this.store = store;
    this.updateInfo = this.updateInfo.bind(this);
    this.check = this.check.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.image = new ImageActions(store);
  }

  connect(config, save) {
    const connectionConfig = docker.connect({
      socket: config.connection === 'socket' ? config.socket || undefined : undefined,
      host: config.connection === 'url' ? config.host || undefined : undefined,
      port: config.connection === 'url' ? config.port || undefined : undefined,
      connection: config.connection || undefined
    }, save);
    this.store.dispatch(Object.assign({ type: 'DOCKER_CONFIG' }, connectionConfig));
  }

  updateInfo() {
    docker.getVersion()
      .then((info) => {
        this.store.dispatch({
          type: 'DOCKER_INFO',
          info
        });
      });
  }

  check() {
    const status = {
      type: 'DOCKER_UPDATE_STATS',
      isRunning: false,
      containers: [],
      images: [],
      services: [],
      nodes: [],
      tasks: []
    };
    docker.isRunning().then((running) => {
      if (running) {
        Promise.all([
          docker.getContainers(true),
          docker.getImages(),
          docker.getServices(),
          docker.getNodes(),
          docker.getTasks()
        ]).then((result) => {
          Object.assign(status, {
            isRunning: running,
            containers: result[0],
            images: result[1],
            services: result[2],
            nodes: result[3],
            tasks: result[4]
          });
          this.store.dispatch(status);
        }).catch(() => {
          this.store.dispatch(status);
        });
      } else {
        this.store.dispatch(status);
      }
    });
  }

  logOut() {
    storage.remove('auth');
    this.store.dispatch({ type: 'DOCKER_LOG_OUT' });
  }

  authenticate(data, cached = false) {
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
    return docker.isRunning().then((isRunning) => {
      if (isRunning) {
        docker.instance.checkAuth(request).then((result) => {
          const response = {
            type: 'DOCKER_AUTH',
            username: request.username,
            password: Buffer.from(request.password).toString('hex'),
            serverAddress: request.serverAddress
          };
          this.store.dispatch(Object.assign(response, result));
          if (data.remember) {
            storage.set('auth', {
              serverAddress: request.serverAddress,
              username: request.username,
              password: response.password,
              token: result.IdentityToken
            });
          }
          this.store.dispatch({ type: 'DOCKER_AUTH_END' });
        }).catch((e) => {
          this.store.dispatch({ type: 'DOCKER_AUTH', error: e });
          this.store.dispatch({ type: 'DOCKER_AUTH_END' });
        });
      }
    });
  }

  search(target, value) {
    this.store.dispatch({ type: 'SEARCH', target, query: value });
  }
}

module.exports = DockerAction;
