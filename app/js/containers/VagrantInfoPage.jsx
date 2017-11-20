import React from 'react';
import { connect } from 'react-redux';
import Box from 'grommet/components/Box';
import Label from 'grommet/components/Label';
import Heading from 'grommet/components/Heading';
import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter';
import Chart from '../components/Chart';
import Spinning from 'grommet/components/icons/Spinning';
import _ from 'underscore';

class VagrantInfoPage extends React.Component {
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
    return (
      <Box style={{ display: 'inline-block' }}>
        { Object.keys(this.state.cores).length === 0 ?
          <Box justify='center' direction='row'>
            <Box>
              <Spinning id='spinner' />
            </Box>
            <Label margin='none' htmlFor='spinner' style={{ marginLeft: '10px' }}>Waiting for data...</Label>
          </Box>
          : ''
        }
        {
          Object.keys(this.state.cpu).map((node, i) =>
          <Box key={node} style={{ marginTop: i === 0 ? '0px' : '20px' }}>
            <Heading tag='h4' margin='none' strong={true} style={{ textAlign: 'center' }}>{node}</Heading>
            <Box direction='row' style={{ justifyContent: 'space-around' }}>
              <Box>
                <Label style={{ textAlign: 'center' }} margin='none'>CPU</Label>
                <Box direction='row'>
                  <Box>
                    <Chart type='circle' label={this.state.cpu[node]} units='%' value={this.state.cpu[node]} size='xsmall' />
                    <Label style={{ textAlign: 'center' }} margin='none'>Usage</Label>
                  </Box>
                  <Box>
                    <Chart type='circle' label={this.state.cores[node]} units='CPU' value={this.state.cores[node]} size='xsmall' />
                    <Label style={{ textAlign: 'center' }} margin='none'>Cores</Label>
                  </Box>
                </Box>
              </Box>
              <Box style={{ marginTop: '20px' }} >              
                <Chart
                  type='circle'
                  label={Math.ceil(this.state.totalMemory[node] / 1024 / 1000)}
                  units='MB'
                  stacked={true}
                  size='xsmall'
                  series={[
                    {"label": "Memory Used", "value": this.state.usedMemory[node] / 1024 / 1000, "colorIndex": "graph-1"},
                    {"label": "Memory Cached", "value": this.state.cachedMemory[node] / 1024 / 1000, "colorIndex": "graph-2"},
                    {"label": "Free Memory", "value": this.state.freeMemory[node] / 1024 / 1000, "colorIndex": "light-2"}
                  ]}
                />
                <Label style={{ textAlign: 'center' }} margin='none'>RAM</Label>
              </Box>
            </Box>
          </Box>
          )
        }
      </Box>
    );
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(VagrantInfoPage);
