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
import Stop from 'grommet/components/icons/base/Stop';
import Slider from 'react-rangeslider';
import snmpWorker from './../modules/worker-snmp.js';
import actions from './../actions/actions.js';

const os = require('os');

class VagrantPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cpus: this.props.cpus,
      ram: this.props.ram,
      cpuPercentage: this.props.cpuPercentage,
      status: this.props.status
    };

    this.cpuChanged = this.cpuChanged.bind(this);
    this.ramChanged = this.ramChanged.bind(this);
    this.cpuPercentChange = this.cpuPercentChange.bind(this);
    this.statusChanged = this.statusChanged.bind(this);
    this.showInfo = this.showInfo.bind(this);
    this.updateCharts = this.updateCharts.bind(this);
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

  updateCharts(data) {
    this.props.dispatch(Object.assign({ type: 'VAGRANT_NODE_STATUS_UPDATE' }, data));
  }

  componentDidMount() {
    this.worker = snmpWorker.start(this.updateCharts);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('build:rs', this.listener);
    this.worker.stop();
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
    this.setState(nextState);
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
                onClick={this.statusChanged}
                a11yTitle='Run'
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
                onClick={this.showInfo}
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
              <FormField label='Max CPU usage %'>
                <Slider
                  value={this.state.cpuPercentage}
                  max={100}
                  step={1}
                  min={1}
                  orientation="horizontal"
                  onChange={this.cpuPercentChange}
                />
              </FormField>
              <FormField label='RAM MB'>
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
          </Box>
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  cpus: state.vagrant.cpus,
  ram: state.vagrant.ram,
  cpuPercentage: state.vagrant.cpuPercentage
});
const mapDispatchToProps = dispatch => ({ dispatch });

module.exports = connect(mapStateToProps, mapDispatchToProps)(VagrantPage);
