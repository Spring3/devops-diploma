import React from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Route } from 'react-router';
import Wrapper from 'grommet/components/App';
import Split from 'grommet/components/Split';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Title from 'grommet/components/Title';
import Animate from 'grommet/components/Animate';
import _ from 'underscore';

import snmpWorker from './../modules/worker-snmp.js';

import MainMenu from '../components/MainMenu.jsx';
import Modal from '../components/Modal';

import Sidebar from '../components/Sidebar.jsx';
import Footer from '../components/Footer.jsx';
import LoginForm from '../components/LoginForm.jsx';
import TopMenu from '../components/TopMenu.jsx';

// pages
import About from './About.jsx';
import ImageBuildPage from './ImageBuildPage.jsx';
import ComposeBuildPage from './ComposeBuildPage.jsx';
import StackBuildPage from './StackBuildPage.jsx';
import VagrantInfoPage from './VagrantInfoPage.jsx';
import VagrantPage from './VagrantPage.jsx';
import ImagesPage from './Images.jsx';
import ImagesStatusPage from './ImageStatus.jsx';
import DockerPage from './Docker.jsx';
import SidebarIcon from 'grommet/components/icons/base/Sidebar';

// icons
import DockerIcon from 'grommet/components/icons/base/PlatformDocker';
import DockerStatusIcon from '../components/DockerIcon.jsx';
import DockerLogo from '../components/DockerIcon.jsx';
import AddIcon from 'grommet/components/icons/base/Add';
import CaretLeft from 'grommet/components/icons/base/CaretBack';

const actions = require('../actions/actions.js');
const contextMenu = require('../modules/contextMenu.js');

const request = require('request-promise-native');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      sidebarOpen: this.props.sidebarOpen
    };
    this.snmpConfigSynced = false;
    this.updateSNMP = this.updateSNMP.bind(this);
    this.syncSNMPConfig = this.syncSNMPConfig.bind(this);
    this.callUpdate = this.callUpdate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.sidebarOpen !== nextProps.sidebarOpen) {
      this.setState({ sidebarOpen: nextProps.sidebarOpen });
    }
  }

  // update vagrantfile config based on the data from a running infrastructure
  // When app is open while the infrastructure is already running, all slide-bars will have a default value
  syncSNMPConfig(data) {
    if (this.snmpConfigSynced || !data['CPU CORES'].manager) {
      return;
    }

    this.props.dispatch({
      type: 'CPU_CHANGED',
      cpus: data['CPU CORES'].manager
    });

    this.props.dispatch({
      type: 'RAM_CHANGED',
      ram: data['MEMORY TOTAL'].manager / (1024 ** 2)
    });

    this.props.dispatch({
      type: 'CPU_PERCENT_CHANGED',
      cpuPercentage: 35
    });
    this.snmpConfigSynced = true;
  }

  callUpdate(e, data) {
    const { config } = data;
    const interval = setInterval(() => {
      console.log('tick');
      request({ uri: 'http://192.168.10.3:8080', json: true })
      .then(() => request({ uri: 'http://192.168.10.4:8080', json: true }))
      .then(() => {
        const { store } = this.context;
        const state = store.getState();
        console.log(config.metadata.nodesCount);
        console.log(Object.keys(state.vagrant['CPU CORES']).length);
        if (config.metadata.nodesCount !== Object.keys(state.vagrant['CPU CORES']).length) {
          return;
        } else {
          clearInterval(interval);
          const nodes = _.without(Object.keys(state.vagrant['CPU CORES']), 'manager', ...state.vagrant.updatedNodes);  
          console.log(nodes);
          if (nodes.length > 0) {
            this.props.dispatch({ type: 'VAGRANT_NODE_UPDATE', node: nodes[0]})
            ipcRenderer.send('update', { type: 'vagrant', node: nodes[0], config });
          } else {
            this.props.dispatch({ type: 'VAGRANT_NODE_UPDATE_COMPLETE', config });
          }
        }
      }).catch(console.error);
    }, 3000);
  }

  updateSNMP(data) {
    this.syncSNMPConfig(data);
    this.props.dispatch(Object.assign({ type: 'VAGRANT_NODE_STATUS_UPDATE' }, data));
    const { store } = this.context;
    const state = store.getState();
    // if none of the nodes are updating. This is done to prevent continuous calls.
    // Fist node update must be fired here. All the others update calls will be fired from inside teh :rs listener
    if (this.snmpConfigSynced && state.vagrant.updatedNodes.length === 0) {
      const recommendations = actions.vagrant.analyseNodeData(data);
      console.log(recommendations);
      if (Object.keys(recommendations.cpu).length > 0 || Object.keys(recommendations.ram).length > 0) {
        const config = {
          cpus: recommendations.cpu.cpus || state.vagrant.cpus,
          cpuexecutioncap: recommendations.cpu.executionCap || state.vagrant.cpuPercentage,
          ram: Math.ceil(recommendations.ram.ram || state.vagrant.ram),
          metadata: {
            nodesCount: Object.keys(state.vagrant['CPU CORES']).length
          }
        };
        console.log(config);
        const nodes = _.without(Object.keys(state.vagrant['CPU CORES']), 'manager');
        if (nodes.length > 0) {
          this.props.dispatch({ type: 'VAGRANT_NODE_UPDATE', node: nodes[0]})
          ipcRenderer.send('update', { type: 'vagrant', node: nodes[0], config });
        } 
      }
    }
  }

  componentDidMount() {
    this.worker = snmpWorker.start(this.updateSNMP);
    this.checkListener = (e, status) => this.props.dispatch({
      type: 'VAGRANT_STATUS_CHANGED',
      status
    });
    ipcRenderer.on('vagrantStatus:rs', this.checkListener);
    ipcRenderer.send('vagrantStatus', {});
    ipcRenderer.on('update:rs', this.callUpdate);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('vagrantStatus:rs', this.checkListener);
    ipcRenderer.removeListener('update:rs', this.callUpdate);
    this.worker.stop();
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <Wrapper centered={false}>
        <Split flex={'right'} priority={'right'}>
          <Animate  
          enter={{ animation: 'slide-right', duration: 350, delay: 0 }}
          leave={{ animation: 'slide-right', duration: 350, delay: 0 }}
          keep={false}
          visible={this.state.sidebarOpen}>
            <Sidebar toggleModal={this.toggleModal.bind(this)}/>
          </Animate>
          <Box pad={'none'} justify={'between'} full={'vertical'} align={'start'}>
            <Box pad={{horizontal: 'small'}} direction='row' full='horizontal' align='center'>
              <Button
                icon={<CaretLeft/>}
                onClick={this.props.history.goBack}
                className='notPadded'
              />
              <TopMenu/>
            </Box>
            <Box justify={'between'} direction={'row'} full={'horizontal'} flex={true} alignContent={'end'}>
              <Box flex={true} pad={{ vertical: 'none', horizontal: 'small' }} className='left-padded'>
                <Route exact path='/' component={MainMenu} />
                <Route path='/docker' component={DockerPage} />
                <Route path='/compose' component={ComposeBuildPage} />
                <Route path='/stack' component={StackBuildPage} />
                <Route exact path='/image' component={ImageBuildPage} />
                <Route exact path='/images' component={ImagesPage} />
                <Route path='/images/selected' component={ImagesStatusPage} />
                <Route path='/about' component={About} />
                <Route exact path='/vagrant' component={VagrantPage} />
                <Route path='/vagrant/info' component={VagrantInfoPage} />
                {
                  this.state.modal ? 
                    <Modal closeBtn={true} toggleModal={this.toggleModal.bind(this)}>
                      <LoginForm toggleModal={this.toggleModal.bind(this)}/>
                    </Modal>
                  :
                  ''
                }
              </Box>
            </Box>
            <Box className='utility'>
              <Button icon={<SidebarIcon />}
                href='#'
                onClick={actions.toggleSidebar}
                plain={true} />
              <DockerStatusIcon />
            </Box>
            <Footer />
          </Box>
        </Split>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  sidebarOpen: state.main.sidebarOpen
});

const mapDispatchToProps = dispatch => ({
  auth: (data) => actions.docker.authenticate(data),
  dispatch
});

App.contextTypes = {
  store: PropTypes.object
}

module.exports = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
