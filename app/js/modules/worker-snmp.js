const request = require('request-promise-native').defaults({ jar: true });

const cookies = request.jar();
const FIVE_SECONDS = 5000;

class SNMPWorker {
  constructor(callback) {
    this.authorized = false;
    this.check = this.check.bind(this);
    this.stop = this.stop.bind(this);
    this.callback = callback;
    this.authorize();
    this.interval = setInterval(this.check, FIVE_SECONDS);
  }

  calculateCPUCores(response) {
    const metrics = response.data.result;
    const result = {};
    for (const metric of metrics) {
      const node = metric.metric.node_name;
      if (!result[node]) {
        result[node] = 1;
      } else {
        result[node] += 1;
      }
    }
    return result;
  }

  processResponse(response) {
    const metrics = response.data.result;
    return metrics.map(metric => ({ [metric.metric.node_name]: parseInt(metric.values.pop()[1], 10) })).reduce((sum, next) => Object.assign(sum, next));
  }

  authorize() {
    request({ method: 'POST', uri: 'http://192.168.10.2:3000/login', body: { user: 'admin', password: 'admin' }, json: true })
      .then((response) => {
        console.log(response);
        this.authorized = true;
      }).catch(console.error);
  }

  check() {
    if (!this.authorized) {
      this.authorize();
    } else {
      const toSeconds = Math.ceil(Date.now() / 1000);
      const fromSeconds = toSeconds - 5;
      const endpoints = [
        {
          link: `http://192.168.10.2:3000/api/datasources/proxy/1/api/v1/query_range?query=100%20-%20(avg(irate(node_cpu%7Bmode%3D%22idle%22%7D%5B30s%5D)%20%20*%20on(instance)%20group_left(node_name)%20node_meta%7Bnode_id%3D~%22.%2B%22%7D%20*%20100)%20by%20(node_name))&start=${fromSeconds}&end=${toSeconds}&step=1`,
          label: 'CPU USED'
        },
        {
          link: `http://192.168.10.2:3000/api/datasources/proxy/1/api/v1/query_range?query=node_cpu%7Bmode%3D%22idle%22%7D%20*%20on(instance)%20group_left(node_name)%20node_meta%7Bnode_id%3D~%22.%2B%22%7D&start=${fromSeconds}&end=${toSeconds}&step=1`,
          label: 'CPU CORES'
        },
        {
          link: `http://192.168.10.2:3000/api/datasources/proxy/1/api/v1/query_range?query=sum((node_memory_MemTotal)%20*%20on(instance)%20group_left(node_name)%20node_meta%7Bnode_id%3D~%22.%2B%22%7D)%20by%20(node_name)&start=${fromSeconds}&end=${toSeconds}&step=1`,
          label: 'MEMORY TOTAL'
        },
        {
          link: `http://192.168.10.2:3000/api/datasources/proxy/1/api/v1/query_range?query=sum((node_memory_MemFree)%20*%20on(instance)%20group_left(node_name)%20node_meta%7Bnode_id%3D~%22.%2B%22%7D)%20by%20(node_name)&start=${fromSeconds}&end=${toSeconds}&step=1`,
          label: 'MEMORY FREE'
        },
        {
          link: `http://192.168.10.2:3000/api/datasources/proxy/1/api/v1/query_range?query=sum(node_memory_Cached%20*%20on(instance)%20group_left(node_name)%20node_meta%7Bnode_id%3D~%22.%2B%22%7D)%20by%20(node_name)&start=${fromSeconds}&end=${toSeconds}&step=1`,
          label: 'MEMORY CACHED'
        },
        {
          link: `http://192.168.10.2:3000/api/datasources/proxy/1/api/v1/query_range?query=sum((node_memory_MemTotal%20-%20node_memory_MemFree%20-%20node_memory_Cached%20-%20node_memory_Buffers%20-%20node_memory_Slab)%20*%20on(instance)%20group_left(node_name)%20node_meta%7Bnode_id%3D~%22.%2B%22%7D)%20by%20(node_name)&start=${fromSeconds}&end=${toSeconds}&step=1`,
          label: 'MEMORY USED'
        }
      ];
      const promises = [];
      for (const endpoint of endpoints) {
        promises.push(request({ uri: endpoint.link, json: true }));
      }
      Promise.all(promises).then(resonses => this.callback(resonses.map((response, i) => {
        if (endpoints[i].label !== 'CPU CORES') {
          return {
            [endpoints[i].label]: this.processResponse(response)
          };
        }
        return {
          [endpoints[i].label]: this.calculateCPUCores(response)
        };
      }).reduce((sum, next) => Object.assign(sum, next)))); // eslint-disable-line
    }
  }

  stop() {
    clearInterval(this.interval);
  }
}

module.exports.start = callback => new SNMPWorker(callback);
