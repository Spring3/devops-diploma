import vagrant from 'vagrant';
import os from 'os';
import Action from './action';

class Vagrant extends Action {
  constructor(store) {
    super();
    this.store = store;

    this.analyseNodeData = this.analyseNodeData.bind(this);
  }

  shouldUpdateCPUUsage({ usage, cores }, threshold, config) {
    const recommendedChanges = {};

    // if one of nodes rebooting
    if (!usage.worker1 || !usage.worker2) return recommendedChanges;
    // console.log(usage.worker1);
    // console.log(usage.worker2);
    // console.log(threshold);
    if (usage.worker1 >= threshold && usage.worker2 >= threshold) {
      if (config.executionCap < 100) {
        recommendedChanges.executionCap = config.executionCap + 20 > 100 ? 100 : config.executionCap + 20;
      } else if (cores.worker1 === cores.worker2 && cores.worker1 < os.cpus().length) {
        recommendedChanges.cpus = config.cores + 1;
      }
    } else if (usage.worker1 < threshold && usage.worker2 < threshold) {
      if (cores.worker1 === cores.worker2 && cores.worker1 > 1) {
        recommendedChanges.cpus = config.cores - 1;
      } else {
        // minimum 10% cpu usage
        recommendedChanges.executionCap = config.executionCap - 20 > 10 ? config.executionCap - 20 : 10;
      }
    }
    return recommendedChanges;
  }

  shouldUpdateRamUsage(usage, threshold, ramPerConfig) {
    const recommendedChanges = {};
    const totalMemory = os.totalmem() / (1024 ** 2);
    // if one of nodes rebooting
    if (!usage.worker1 || !usage.worker2) return recommendedChanges;
    const worker1UsageMB = usage.worker1 / (1024 ** 2);
    const worker2UsageMB = usage.worker2 / (1024 ** 2);
    const worker1UsagePercent = (worker1UsageMB / ramPerConfig) * 100;
    const worker2UsagePercent = (worker2UsageMB / ramPerConfig) * 100;
    // console.log(worker1UsagePercent);
    // console.log(worker2UsagePercent);
    // console.log(threshold);
    // console.log(ramPerConfig);
    if (worker1UsagePercent >= threshold && worker2UsagePercent >= threshold) {
      if (ramPerConfig < totalMemory) {
        recommendedChanges.ram = ramPerConfig + 256 > totalMemory ? totalMemory : ramPerConfig + 256;
      }
    } else if (worker1UsagePercent < threshold && worker2UsagePercent < threshold) {
      if (ramPerConfig > 256) {
        recommendedChanges.ram = ramPerConfig - 256 > 256 ? ramPerConfig - 256 : 256;
      }
    }
    return recommendedChanges;
  }

  analyseNodeData(data) {
    if (!data) return { cpu: {}, ram: {} };
    const state = this.store.getState();
    const cpuTest = {
      usage: data['CPU USED'],
      cores: data['CPU CORES']
    };
    const currentCpuConfig = {
      cores: state.vagrant.cpus,
      executionCap: state.vagrant.cpuPercentage
    };
    const cpuRecommendations = this.shouldUpdateCPUUsage(cpuTest, state.vagrant.cpuThreshold, currentCpuConfig);
    const ramRecommendations = this.shouldUpdateRamUsage(data['MEMORY USED'], state.vagrant.ramThreshold, state.vagrant.ram);
    return {
      cpu: cpuRecommendations,
      ram: ramRecommendations
    };
  }
}

module.exports = Vagrant;
