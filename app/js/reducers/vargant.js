const initialState = {
  cpus: 1,
  ram: 256,
  cpuPercentage: 1,
  status: 'stopped',
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
    case 'VAGRANT_STATUS_CHANGED': {
      return Object.assign({}, state, { status: action.status });
    }
    case 'VAGRANT_NODE_STATUS_UPDATE': {
      return Object.assign({}, state, {
        'CPU USED': action['CPU USED'],
        'CPU CORES': action['CPU CORES'],
        'MEMORY TOTAL': action['MEMORY TOTAL'],
        'MEMORY FREE': action['MEMORY FREE'],
        'MEMORY CACHED': action['MEMORY CACHED'],
        'MEMORY USED': action['MEMORY USED']
      });
    }
    default:
      return state;
  }
};
