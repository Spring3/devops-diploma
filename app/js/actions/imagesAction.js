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
    const dirName = dirPath.split(path.sep).pop();
    const tarballName = `${dirName}.tar`;
    const tarballPath = path.posix.resolve(dirPath, '../', tarballName);
    const cwd = path.posix.resolve(dirPath, '../');
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
      return docker.instance.buildImage(tarballPath, options)
        .then((data) => {
          console.log(data);
        })
        .then(() => this.deleteFile(tarballPath))
        .catch((e) => {
          console.error(e);
          return this.deleteFile(tarballPath);
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
