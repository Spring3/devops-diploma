import _ from 'underscore';

const initialState = {
  cpus: 1,
  ram: 256,
  cpuPercentage: 1,
  status: 'stopped',
  cpuThreshold: 50,
  ramThreshold: 50,
  updatedNodes: [],
  'CPU USED': {},
  'CPU CORES': {},
  'MEMORY TOTAL': {},
  'MEMORY FREE': {},
  'MEMORY CACHED': {},
  'MEMORY USED': {}
};


module.exports = (state = initialState, action) => {
  if (!action) return state;
  switch (action.type) {
    case 'CPU_CHANGED': {
      return Object.assign({}, state, { cpus: action.cpus });
    }
    case 'RAM_CHANGED': {
      return Object.assign({}, state, { ram: action.ram });
    }
    case 'CPU_PERCENT_CHANGED': {
      return Object.assign({}, state, { cpuPercentage: action.cpuPercentage });
    }
    case 'CPU_THRESHOLD_CHANGED': {
      return Object.assign({}, state, { cpuThreshold: action.cpuThreshold });
    }
    case 'RAM_THRESHOLD_CHANGED': {
      return Object.assign({}, state, { ramThreshold: action.ramThreshold });
    }
    case 'VAGRANT_STATUS_CHANGED': {
      return Object.assign({}, state, { status: action.status });
    }
    case 'VAGRANT_NODE_UPDATE': {
      return Object.assign({}, state, { updatedNodes: [...state.updatedNodes, action.node] });
    }
    case 'VAGRANT_NODE_UPDATE_COMPLETE': {
      return Object.assign({}, state, { updatedNodes: [] }, { cpus: action.config.cpus, ram: action.config.ram, cpuPercentage: action.config.cpuexecutioncap });
    }
    case 'VAGRANT_NODE_STATUS_UPDATE': {
      const nextStatus = _.isEqual(action['CPU CORES'], {}) ? state.status : 'running';
      return Object.assign({}, state, {
        'CPU USED': action['CPU USED'],
        'CPU CORES': action['CPU CORES'],
        'MEMORY TOTAL': action['MEMORY TOTAL'],
        'MEMORY FREE': action['MEMORY FREE'],
        'MEMORY CACHED': action['MEMORY CACHED'],
        'MEMORY USED': action['MEMORY USED'],
        status: nextStatus
      });
    }
    default:
      return state;
  }
};
