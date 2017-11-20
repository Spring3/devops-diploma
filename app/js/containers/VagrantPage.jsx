import React from 'react';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Heading from 'grommet/components/Heading';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import ChartIcon from 'grommet/components/icons/base/BarChart';
import Play from 'grommet/components/icons/base/Play';
import Pause from 'grommet/components/icons/base/Pause';
import Stop from 'grommet/components/icons/base/Stop';
import Slider from 'react-rangeslider';
import actions from './../actions/actions.js';
import _ from 'underscore';

const os = require('os');

class VagrantPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cpus: this.props.cpus,
      ram: this.props.ram,
      ramThreshold: this.props.ramThreshold,
      cpuPercentage: this.props.cpuPercentage,
      cpuThreshold: this.props.cpuThreshold,
      status: this.props.status,
      snmp : this.props.snmp || {}
    };
    this.checked = false;

    this.cpuChanged = this.cpuChanged.bind(this);
    this.ramChanged = this.ramChanged.bind(this);
    this.cpuPercentChange = this.cpuPercentChange.bind(this);
    this.statusChanged = this.statusChanged.bind(this);
    this.showInfo = this.showInfo.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
    this.cpuThresholdChanged = this.cpuThresholdChanged.bind(this);
    this.ramThresholdChanged = this.ramThresholdChanged.bind(this);
  }

  componentWillMount() {
    this.listener = (e, data) => {
      console.log(data);
      this.props.dispatch({
        type: 'VAGRANT_STATUS_CHANGED',
        status: 'running'
      });
    };
    ipcRenderer.on('build:rc', this.listener);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('build:rs', this.listener);
  }

  componentWillReceiveProps(nextProps) {
    const nextState = {};
    if (this.state.cpus !== nextProps.cpus) {
      nextState.cpus = nextProps.cpus;
    }
    if (this.state.ram !== nextProps.ram) {
      nextState.ram = nextProps.ram;
    }
    if (this.state.cpuPercentage !== nextProps.cpuPercentage) {
      nextState.cpuPercentage = nextProps.cpuPercentage;
    }
    if (!_.isEqual(this.state.snmp), nextProps.snmp) {
      nextState.snmp = nextProps.snmp;
    }
    if (this.state.status !== nextProps.status) {
      nextState.status = nextProps.status;
    }
    if (this.state.cpuThreshold !== nextProps.cpuThreshold) {
      nextState.cpuThreshold = nextProps.cpuThreshold;
    }
    if (this.state.ramThreshold !== nextProps.ramThreshold) {
      nextState.ramThreshold = nextProps.ramThreshold;
    }
    this.setState(nextState, this.updateConfig);
  }

  // update vagrantfile config based on the data from a running infrastructure
  // When app is open while the infrastructure is already running, all slide-bars will have a default value
  updateConfig() {
    if (this.checked || !this.state.snmp.cores.manager) {
      return;
    }

    this.cpuChanged(this.state.snmp.cores.manager);
    this.ramChanged(this.state.snmp.totalMemory.manager / 1024 / 1000);
    this.cpuPercentChange(35);
    this.checked = true;
  }

  cpuChanged(e) {
    this.props.dispatch({
      type: 'CPU_CHANGED',
      cpus: e
    });
  }

  ramChanged(e) {
    this.props.dispatch({
      type: 'RAM_CHANGED',
      ram: e
    });
  }

  cpuPercentChange(e) {
    this.props.dispatch({
      type: 'CPU_PERCENT_CHANGED',
      cpuPercentage: e
    });
  }

  cpuThresholdChanged(e) {
    this.props.dispatch({
      type: 'CPU_THRESHOLD_CHANGED',
      cpuThreshold: e
    });
  }

  ramThresholdChanged(e) {
    this.props.dispatch({
      type: 'RAM_THRESHOLD_CHANGED',
      ramThreshold: e
    });
  }

  showInfo(e) {
    this.props.history.push('/vagrant/info');
  }

  statusChanged(status) {
    this.props.dispatch({
      type: 'VAGRANT_STATUS_CHANGED',
      status: 'booting'
    });
    ipcRenderer.send('build', {
      type: 'Vagrantfile',
      payload: {
        cpus: this.state.cpus,
        ram: this.state.ram,
        cpuPercentage: this.state.cpuPercentage
      }
    });
  }

  render() {
    const totalMemoryMB = os.totalmem() / 1024**2
    return (
      <Box>
        <Box direction='row' pad={{ horizontal: 'medium' }}>
          <Box className='wrapper-borderless' full='horizontal' alignContent="stretch">
            <Box direction='row' justify='start' alignSelf='stretch' align='center' style={{ background: 'white', position: 'fixed', zIndex: 999, width: '100%' }}>
              <Button icon={<Play />}
                box={true}
                label='Run'
                plain={true}
                onClick={['stopped', 'paused'].includes(this.state.status) ? this.statusChanged : null}
                a11yTitle='Run'
                className='btn-small'
              />
              <Button icon={<Pause />}
                box={true}
                label='Pause'
                a11yTitle='Pause'
                plain={true}
                onClick={this.state.status === 'running' ? this.statusChanged.bind(this, 'paused') : null }
                className='btn-small'
              />
              <Button icon={<Stop />}
                box={true}
                label='Stop'
                a11yTitle='Stop'
                plain={true}
                onClick={this.state.status === 'running' ? this.statusChanged.bind(this, 'stopped') : null}
                className='btn-small'
              />
              <Button icon={<ChartIcon />}
                box={true}
                label='Info'
                a11yTitle='Info'
                plain={true}
                onClick={this.state.status === 'running' ? this.showInfo : null}
                className='btn-small'
              />
              <input ref={ input => this.destinationPicker = input } onChange={this.saveToDestination} type='file' style={{ visibility: 'hidden' }} />
            </Box>
            <Heading tag='h4' strong={true} style={{ marginTop: '60px' }} margin='none'>Configuration</Heading>
            <Box>
              <FormField label='CPUs'>
                <Slider
                  value={this.state.cpus}
                  max={os.cpus().length}
                  step={1}
                  min={1}
                  orientation="horizontal"
                  onChange={this.cpuChanged}
                />
              </FormField>
              <FormField label='Max CPU usage, %'>
                <Slider
                  value={this.state.cpuPercentage}
                  max={100}
                  step={1}
                  min={1}
                  orientation="horizontal"
                  onChange={this.cpuPercentChange}
                />
              </FormField>
              <FormField label='RAM, mb'>
                <Slider
                  value={this.state.ram}
                  max={totalMemoryMB}
                  step={256}
                  min={256}
                  orientation="horizontal"
                  onChange={this.ramChanged}
                />
              </FormField>
            </Box>
            <Heading tag='h4' strong={true} style={{ marginTop: '20px' }} margin='none'>Thresholds</Heading>
            <Box>
              <FormField label='CPU Usage, %'>
                <Slider
                  value={this.state.cpuThreshold}
                  max={100}
                  step={1}
                  min={1}
                  orientation="horizontal"
                  onChange={this.cpuThresholdChanged}
                />
              </FormField>
              <FormField label='RAM Usage, %'>
                <Slider
                  value={this.state.ramThreshold}
                  max={100}
                  step={1}
                  min={1}
                  orientation="horizontal"
                  onChange={this.ramThresholdChanged}
                />
              </FormField>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  cpus: state.vagrant.cpus,
  ram: state.vagrant.ram,
  cpuPercentage: state.vagrant.cpuPercentage,
  status: state.vagrant.status,
  cpuThreshold: state.vagrant.cpuThreshold,
  ramThreshold: state.vagrant.ramThreshold,
  snmp: {
    cpu: state.vagrant['CPU USED'],
    cores: state.vagrant['CPU CORES'],
    totalMemory: state.vagrant['MEMORY TOTAL']
  }
});
const mapDispatchToProps = dispatch => ({ dispatch });

module.exports = connect(mapStateToProps, mapDispatchToProps)(VagrantPage);
