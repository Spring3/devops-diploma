import { push } from 'react-router-redux';
import docker from './../modules/docker';

class ImagesAction {
  constructor(store) {
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
