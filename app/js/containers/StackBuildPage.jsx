import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Heading from 'grommet/components/Heading';
import TextInput from 'grommet/components/TextInput';
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import Footer from 'grommet/components/Footer';
import Select from 'grommet/components/Select';
import NumberInput from 'grommet/components/NumberInput';
import CheckBox from 'grommet/components/CheckBox';

import AddIcon from 'grommet/components/icons/base/Add';

import Download from 'grommet/components/icons/base/DocumentDownload';
import Search from 'grommet/components/icons/base/Search';
import Trash from 'grommet/components/icons/base/Trash';
import Up from 'grommet/components/icons/base/Up';
import Open from 'grommet/components/icons/base/FolderOpen';
import Label from 'grommet/components/Label';

import actions from '../actions/actions';
import ServiceModal from  '../components/Modal.jsx';
import NetworkModal from  '../components/Modal.jsx';
import VolumeModal from  '../components/Modal.jsx';

class StackBuildPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: {},
      volumes: [],
      service: {},
      services: [],
      network: {},
      networks: [],
      deployMode: undefined,
      imageLookup: [],
      lookupTimeout: undefined,
      serviceModalVisible: false,
      networkModalVisible: false,
      volumeModalVisible: false,
      toast: false,
      toastMessage: '',
      destination: '',
      fileName: this.props.fileName,
      filePath: this.props.filePath
    };
    this.pickDestination = this.pickDestination.bind(this);
    this.toggleServiceModal = this.toggleServiceModal.bind(this);
    this.toggleNetworkModal = this.toggleNetworkModal.bind(this);
    this.toggleVolumeModal = this.toggleVolumeModal.bind(this);
    this.suggestionSelected = this.suggestionSelected.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.lookupImage = this.lookupImage.bind(this);
  }

  componentDidMount() {
    this.destinationPicker.directory = true;
    this.destinationPicker.webkitdirectory = true;
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.destination !== nextProps.destination) {
      this.setState({
        destination: nextProps.destination
      });
    }

    if (this.state.fileName !== nextProps.fileName || this.state.filePath !== nextProps.filePath) {
      this.setState({
        fileName: nextProps.fileName,
        filePath: nextProps.filePath
      });
    }
  }

  pickDestination(e) {
    const { store } = this.context;
    const file = e.target.files[0];
    actions.lookupStackFile(file)
      .then((filePath) => {
        store.dispatch({
          type: 'SET_STACK_DESTINATION',
          destination: file.path,
          filePath: file.path,
          fileName: `${file.name.toLowerCase()}.yml`
        });
      })
      .catch(() => {
        store.dispatch({
          type: 'SET_STACK_DESTINATION',
          destination: file.path,
          filePath: undefined,
          fileName: undefined
        });
      });
  }

  toggleServiceModal(submit) {
    const { store } = this.context;
    if (submit) {
      store.dispatch({
        type: 'SET_STACK_SERVICE',
        service: this.state.service
      });
    }
    this.setState({
      serviceModalVisible: !this.state.serviceModalVisible
    });
  }

  toggleVolumeModal(submit) {
    const { store } = this.context;
    if (submit) {
      store.dispatch({
        type: 'SET_STACK_VOLUME',
        volume: this.state.volume
      });
    }
    this.setState({
      volumeModalVisible: !this.state.volumeModalVisible
    });
  }

  toggleNetworkModal(submit) {
    const { store } = this.context;
    if (submit) {
      store.dispatch({
        type: 'SET_STACK_NETWORK',
        network: this.state.network
      });
    }
    this.setState({
      networkModalVisible: !this.state.networkModalVisible
    });
  }

  suggestionSelected(suggestion) {
    this.setState({
      service: Object.assign({}, this.state.service, { image: suggestion.suggestion })
    });
  }

  lookupImage(e) {
    const { store } = this.context;
    if (this.state.lookupTimeout) {
      clearTimeout(this.state.lookupTimeout);
      this.setState({ lookupTimeout: undefined });
    }
    const self = this;
    var value = e.target.value;
    const timeout = setTimeout(() => {
      actions.docker.image.search(value).then((data) => {
        self.setState({
          imageLookup: data
        });
      });
    }, 300);
    this.setState({
      lookupTimeout: timeout,
      service: Object.assign({}, this.state.service, { image: value })
    });
  }

  deployModeChanged(e) {
    this.setState({
      deployMode: e.option,
      replicas: e.option === 'global' ? undefined : this.state.replicas
    });
  }

  replicasChange(e) {
    this.setState({
      replicas: e.target.value
    });
  }

  networksChange(e) {
    this.setState({
      networks: e.value
    });
  }

  valueChange(e) {
    const nameParts = e.target.name.split('.');
    const propKey = nameParts[0];
    const propValue = nameParts[1];
    console.log(this.state[propKey]);
    this.setState({
      [propKey]: Object.assign({}, this.state[propKey], { [propValue]: e.target.value })
    });
  }

  render() {
    return(
      <Box>
      { this.state.serviceModalVisible ?
        <ServiceModal closeBtn={true} toggleModal={this.toggleServiceModal}>
          <Form pad='medium' onSubmit={this.toggleServiceModal.bind(this, true)}>
            <FormFields>
              <FormField label='Service Name' className="borderless">
                <TextInput name='service.name' className="borderless" placeHolder="service_mail" onChange={this.valueChange}/>
              </FormField>
              <FormField label='Image' className="borderless">
                <TextInput name='service.image' className="borderless" placeHolder="organization/imageName:imageTag" value={this.state.service.image} suggestions={this.state.imageLookup} onSelect={this.suggestionSelected} onChange={this.lookupImage}/>
              </FormField>
              <FormField label='Command' className="borderless">
                <textarea name='service.command' placeholder='-cookie-secure=false' className="borderless" onChange={this.valueChange}/>
              </FormField>
              <FormField label='Environment' className="borderless">
                <textarea name='service.environment' placeholder='HOST_HOSTNAME=/etc/host_hostname' className="borderless" onChange={this.valueChange}/>
              </FormField>
              <FormField label='Ports' className="borderless">
                <textarea name='service.ports' placeholder='15672:15672' className="borderless" onChange={this.valueChange}/>
              </FormField>
              <FormField label='Volumes' className="borderless">
                <textarea name='service.volumes' placeholder='/var/run:/var/run' className="borderless" onChange={this.valueChange}/>
              </FormField>
              <FormField label='Depends on' className="borderless">
                <Select placeHolder='mongo'                  
                  options={['item1', 'item2', 'item3', 'item4']}
                  value={this.state.networks}
                  multiple={true}
                  onChange={this.networksChange.bind(this)} />
              </FormField>
              <FormField label='Networks' className="borderless">
                <Select placeHolder='global'                  
                  options={['network1', 'network2', 'network3', 'network4']}
                  value={this.state.networks}
                  multiple={true}
                  onChange={this.networksChange.bind(this)} />
              </FormField>
              <FormField label='Deploy' className="borderless">
                <Select placeHolder='global'                  
                  options={['global', 'replicated']}
                  value={this.state.deployMode}
                  onChange={this.deployModeChanged.bind(this)} />
                {
                  this.state.deployMode === 'replicated' ?
                  <NumberInput defaultValue={1} min={1} onChange={this.replicasChange.bind(this)} />
                  : ''
                }
              </FormField>
            </FormFields>
            <Footer pad={{"vertical": "medium"}} justify="center">
              <Button
                a11yTitle='Add'
                label='Add'
                type="submit"
                className='btn-small'
              />
            </Footer>
          </Form>
        </ServiceModal>
        : ''
      }

      { this.state.networkModalVisible ?
        <NetworkModal closeBtn={true} toggleModal={this.toggleNetworkModal}>
          <Form pad='medium' onSubmit={this.toggleNetworkModal.bind(this, true)}>
            <FormFields>
              <FormField label='Network Name' className="borderless">
                <TextInput name='network.name' className="borderless" placeHolder="proxy" onChange={this.valueChange}/>
              </FormField>
              <FormField label='Alias' className="borderless">
                <TextInput name='network.alias' className="borderless" placeHolder="logspout" onChange={this.valueChange}/>
              </FormField>
              <CheckBox name='network.external' label='External' />
            </FormFields>
            <Footer pad={{"vertical": "medium"}} justify="center">
              <Button
                a11yTitle='Add'
                label='Add'
                type="submit"
                className='btn-small'
              />
            </Footer>
          </Form>
        </NetworkModal>
        : ''
      }

      { this.state.volumeModalVisible ?
        <VolumeModal closeBtn={true} toggleModal={this.toggleVolumeModal}>
          <Form pad='medium' onSubmit={this.toggleVolumeModal.bind(this, true)}>
            <FormFields>
              <FormField label='Volume Name' className="borderless">
                <TextInput name='volume.name' className="borderless" placeHolder="proxy" onChange={this.valueChange}/>
              </FormField>
            </FormFields>
            <Footer pad={{"vertical": "medium"}} justify="center">
              <Button
                a11yTitle='Add'
                label='Add'
                type="submit"
                className='btn-small'
              />
            </Footer>
          </Form>
        </VolumeModal>
        : ''
      }
        <Box direction='row' pad={{ horizontal: 'medium' }} className='left-padded' style={{ marginRight: '220px' }}>
          <Box className='wrapper-borderless' full='horizontal' alignContent="stretch">
            <Box direction='row' justify='start' alignSelf='stretch' align='center' style={{ background: 'white', position: 'fixed', zIndex: 999, width: '100%' }}>
              <Button icon={<Open />}
                box={true}
                label='Destination'
                plain={true}
                onClick={() => this.destinationPicker.click()}
                a11yTitle='Destination'
                className='btn-small'
              />
              <Button icon={<Download />}
                box={true}
                label='Save'
                onClick={this.state.destination ? this.buildComposeFile : null}
                plain={true}
                a11yTitle='Save'
                className='btn-small' />
              <Button icon={<Up />}
                onClick={this.state.filePath ? this.composeUp : null}
                a11yTitle='Up'
                label='Up'
                plain={true}
                className='btn-small'
              />
              <Button icon={<Search />}
                box={true}
                onClick={this.state.fileName ? this.togglePreview : null}
                a11yTitle='Preview'
                label='Preview'
                plain={true}
                className='btn-small'
                />
              <Button icon={<Trash />}
                box={true}
                label='Delete'
                a11yTitle='Delete'
                onClick={this.state.fileName ? this.deleteFile : null}
                plain={true}
                className='btn-small'
                />
              <input ref={ input => this.destinationPicker = input } onChange={this.pickDestination} type='file' style={{ visibility: 'hidden' }} />
            </Box>
            <Heading tag='h4' strong={true} style={{ marginTop: '60px' }} margin='none'>Configuration</Heading>
            <Button style={{ marginTop: '20px' }} icon={<AddIcon />} box={true} label='Service' a11yTitle='Service' plain={true} className='btn-small' onClick={this.toggleServiceModal} />
            <Button style={{ marginTop: '20px' }} icon={<AddIcon />} box={true} label='Network' a11yTitle='Network' plain={true} className='btn-small' onClick={this.toggleNetworkModal} />
            <Button style={{ marginTop: '20px' }} icon={<AddIcon />} box={true} label='Volume' a11yTitle='Volume' plain={true} className='btn-small' onClick={this.toggleVolumeModal} />
          </Box>
        </Box>
      </Box>
    );
  }
}

const mapDispatchToProps = dispatch => ({ dispatch });

const mapStateToProps = state => ({
  destination: state.docker.build.stack.destination,
  fileName: state.docker.build.stack.fileName,
  filePath: state.docker.build.stack.filePath
});

StackBuildPage.contextTypes = {
  store: PropTypes.object
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(StackBuildPage);
