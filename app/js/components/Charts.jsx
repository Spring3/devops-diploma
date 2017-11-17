import React from 'react';
import { connect } from 'react-redux';
import Meter from 'grommet/components/Meter';
import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter';
import Box from 'grommet/components/Box';
import Value from 'grommet/components/Value';
import Label from 'grommet/components/Label';
import _ from 'underscore';

class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cpu: this.props.cpu,
      cores: this.props.cores,
      totalMemory: this.props.totalMemory,
      freeMemory: this.props.freeMemory,
      cachedMemory: this.props.cachedMemory,
      usedMemory: this.props.usedMemory
    };
  }

  componentWillReceiveProps(nextProps) {
    const nextState = {};
    if (!_.isEqual(this.state.cpu, nextProps.cpu)) {
      nextState.cpu = nextProps.cpu
    }
    if (!_.isEqual(this.state.cores, nextProps.cores)) {
      nextState.cores = nextProps.cores
    }
    if (!_.isEqual(this.state.totalMemory, nextProps.totalMemory)) {
      nextState.totalMemory = nextProps.totalMemory;
    }
    if (!_.isEqual(this.state.freeMemory, nextProps.freeMemory)) {
      nextState.freeMemory = nextProps.freeMemory;
    }
    if (!_.isEqual(this.state.cachedMemory, nextProps.cachedMemory)) {
      nextState.cachedMemory = nextProps.cachedMemory;
    }
    if (!_.isEqual(this.state.usedMemory, nextProps.usedMemory)) {
      nextState.usedMemory = nextProps.usedMemory;
    }
    this.setState(nextState);
  }

  render() {
    let sum = 0;
    for (const key of Object.keys(this.state.cores)) {
      sum += this.state.cores[key];
    }
    console.log(sum);
    return (
    <Box>
      <Box direction="row">
        {
          Object.keys(this.state.cpu).map((node) =>
            <Box key={node}>
              <Meter type='circle'
                label={<Value value={this.state.cpu[node]} units='%' size='small' />}
                size='small'
                value={this.state.cpu[node]}
              />

              <Meter type='circle'
                series={[
                  {"label": "Memory Used", "value": this.state.usedMemory[node] / 1024 / 1024, "colorIndex": "graph-1"},
                  {"label": "Memory Cached", "value": this.state.cachedMemory[node] / 1024 / 1024, "colorIndex": "graph-2"},
                  {"label": "Free Memory", "value": this.state.freeMemory[node] / 1024 / 1024, "colorIndex": "light-2"}
                ]}
                label={<Value value={Math.ceil(this.state.totalMemory[node] / 1024 / 1024)}
                units='MB' />}
                stacked={true}
              />
            </Box>
          )
        }
      </Box>
      <Box>
        {
          <AnnotatedMeter legend={true}
            size='small'
            type='bar'
            max={sum}
            series={Object.keys(this.state.cores).map((key, i) => ({ label: key, value: this.state.cores[key], colorIndex: `graph-${i}` }))} />
        }
      </Box>
    </Box>);
  }
}

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = state => ({
  cpu: state.vagrant['CPU USED'],
  cores: state.vagrant['CPU CORES'],
  totalMemory: state.vagrant['MEMORY TOTAL'],
  freeMemory: state.vagrant['MEMORY FREE'],
  cachedMemory: state.vagrant['MEMORY CACHED'],
  usedMemory: state.vagrant['MEMORY USED']
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Charts);
