const os = require('os');
const path = require('path');
const fs = require('fs');
const DockerAPI = require('dockerode');
const storage = require('electron-json-storage');

const defaultSocketPath = os.platform() === 'win32' ? path.normalize('//./pipe/docker_engine') : '/var/run/docker.sock';

class Docker {
  constructor() {
    this.defaultSocketPath = defaultSocketPath;
    this.config = {
      socket: defaultSocketPath,
      registry: 'https://index.docker.io/v1',
      connection: 'socket',
      host: '127.0.0.1',
      port: '2375'
    };
  }

  connect(data, save = false) {
    if (!data) {
      return undefined;
    }

    const { connection = 'socket', host = '127.0.0.1', port = '2375', socket = defaultSocketPath } = data;
    const config = {
      connection: connection.trim(),
      host: host.trim(),
      port: port.trim(),
      socket: socket.trim()
    };

    if (save) {
      storage.set('config', config);
    }
    switch (data.connection) {
      case 'url': {
        this.instance = new DockerAPI({
          protocol: 'http',
          host: config.host,
          port: config.port,
        });
        break;
      }
      default: {
        // socket
        const stats = fs.statSync(config.socket);
        if (!stats.isSocket()) {
          throw new Error('Unable to locate docker daemon');
        }
        this.instance = new DockerAPI({
          socketPath: config.socket
        });
        break;
      }
    }
    Object.assign(this.config, config);
    return this.config;
  }

  getContainers(all = false) {
    return this.instance.listContainers({ all });
  }

  getImages(all = false) {
    return this.instance.listImages({ all });
  }

  getServices() {
    return this.instance.listServices();
  }

  getNodes() {
    return this.instance.listNodes();
  }

  getTasks() {
    return this.instance.listTasks();
  }

  getVersion() {
    return this.instance.version();
  }

  isRunning() {
    return new Promise((resolve) => {
      if (!this.instance) {
        storage.get('config', (e, config) => {
          if (e) {
            return resolve(false);
          }
          try {
            if (Object.keys(config).length > 0) {
              this.connect(config);
            } else {
              this.connect({
                connection: 'socket',
                socket: defaultSocketPath
              });
            }
            return resolve(true);
          } catch (error) {
            console.error(error);
            return resolve(false);
          }
        });
        return resolve(false);
      }
      return this.instance.ping()
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }
}

module.exports = new Docker();
