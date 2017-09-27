import { push } from 'react-router-redux';
import docker from './../modules/docker';
import Action from './action';
const tar = require('tar');
const path = require('path');

class ImagesAction extends Action {
  constructor(store) {
    super();
    this.store = store;
  }

  getImages() {
    docker.getImages(true).then(images => this.store.dispatch({ type: 'DOCKER_IMAGES', images }));
  }

  get(id) {
    return docker.instance.getImage(id);
  }

  prune() {
    return docker.instance.pruneImages({
      dangling: 0
    });
  }

  build(dirPath, opts) {
    return new Promise((resolve, reject) => {
      this.store.dispatch({
        type: 'SHOW_NOTIFICATION',
        notificationMessage: 'Creating tarball...',
        notificationType: 'unknown',
        notificationProgress: 30
      });
      const dirName = dirPath.split(path.sep).pop();
      const tarballName = `${dirName}.tar`;
      const tarballPath = path.posix.resolve(dirPath, '../', tarballName);
      tar.create({
        file: tarballPath,
        cwd: dirPath
      }, ['.']).then(() => {
        const state = this.store.getState();
        let registry;
        let username;
        let password;
        if (state.docker.common.authResult) {
          registry = state.docker.common.authResult.serverAddress;
          username = state.docker.common.authResult.username;
          password = Buffer.from(state.docker.common.authResult.password, 'hex').toString('utf8');
        }
        const options = Object.assign({}, opts, {
          registryConfig: {
            [registry]: {
              username,
              password
            }
          }
        });
        this.store.dispatch({
          type: 'SHOW_NOTIFICATION',
          notificationMessage: 'Building image...',
          notificationType: 'unknown',
          notificationProgress: 60
        });
        return docker.instance.buildImage(tarballPath, options)
          .then((data) => {
            console.log(data);
          })
          .then(() => {
            this.store.dispatch({
              type: 'SHOW_NOTIFICATION',
              notificationMessage: 'Removing tarball...',
              notificationType: 'unknown',
              notificationProgress: 90
            });
            return this.deleteFile(tarballPath).then(resolve);
          })
          .catch((e) => {
            console.error(e);
            return this.deleteFile(tarballPath).then(reject);
          });
      });
    });
  }

  select(id) {
    if (!id) {
      this.store.dispatch(push('/images'));
    } else {
      docker.instance.getImage(id).inspect()
        .then((data) => {
          this.store.dispatch({ type: 'SELECT_IMAGE', info: data });
          this.store.dispatch(push('/images/selected/'));
        });
    }
  }
}

module.exports = ImagesAction;
