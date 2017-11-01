import { push } from 'react-router-redux';
import tar from 'tar';
import path from 'path';
import docker from './../modules/docker';
import Action from './action';

const REGEX_TAG = /:\w+$/;

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
        const config = {
          [this.credentials.serverAddress]: {
            username: this.credentials.username,
            password: this.credentials.password
          }
        };
        const options = Object.assign({}, opts, { registryConfig: config });
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

  push(name) {
    return new Promise((resolve, reject) => {
      if (!name) return reject();
      if (!this.credentials.password) return reject('Not Authorized');
      const matching = name.match(REGEX_TAG);
      const tagStartIndex = Array.isArray(matching) ? matching.index : undefined;
      const imageName = tagStartIndex ? name.substring(0, tagStartIndex) : name;
      // +1 because the tag includes :
      const tag = tagStartIndex ? name.substring(tagStartIndex + 1, name.length) : undefined;
      console.log('pushing');
      console.log(this.credentials);
      return this.get(imageName).push({
        name: imageName,
        tag,
        authconfig: this.credentials
      }).then(resolve).catch(reject);
    });
  }

  search(filter) {
    return docker.instance.searchImages({
      term: filter,
      limit: 5
    }).then(data => data.map(img => img.name));
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
