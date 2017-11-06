import React from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import FormFields from 'grommet/components/FormFields';
import TextInput from 'grommet/components/TextInput';
import Button from 'grommet/components/Button';
import Select from 'grommet/components/Select';
import Toast from 'grommet/components/Toast';
import Section from 'grommet/components/Section';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import Preview from '../components/Modal.jsx';
import BuildModal from '../components/Modal.jsx';
import Footer from 'grommet/components/Footer';

import Download from 'grommet/components/icons/base/DocumentDownload';
import Search from 'grommet/components/icons/base/Search';
import Trash from 'grommet/components/icons/base/Trash';
import Play from 'grommet/components/icons/base/Play';
import Open from 'grommet/components/icons/base/FolderOpen';
import Push from 'grommet/components/icons/base/CloudUpload';

import actions from '../actions/actions.js';

const fs = require('fs');
const path = require('path');

const supportedSettings = ['RUN', 'LABEL', 'ADD', 'COPY', 'ENTRY POINT', 'VOLUME', 'USER', 'WORKDIR', 'ARG', 'ONBUILD', 'STOP SIGNAL', 'HEALTHCHECK', 'SHELL'];
const defaultSettings = ['FROM', 'CMD', 'EXPOSE', 'ENV', 'COPY', 'WORKDIR'];

class ImageBuildPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      built: false,
      lastBuiltImage: undefined,
      imageName: undefined,
      buildModalVisible: false, 
      selected: this.props.selected || defaultSettings,
      imageLookup: [],
      lookupTimeout: undefined,
      data: this.props.data || {},
      toast: false,
      toastMessage: '',
      destination: this.props.destination || this.props.filePath,
      fileName: this.props.fileName,
      filePath: this.props.filePath
    };
    this.selectionChanged = this.selectionChanged.bind(this);
    this.imageNameChange = this.imageNameChange.bind(this);
    this.valueChanged = this.valueChanged.bind(this);
    this.buildDockerFile = this.buildDockerFile.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    this.toggleBuildPreview = this.toggleBuildPreview.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.buildImage = this.buildImage.bind(this);
    this.pickDestination = this.pickDestination.bind(this);
    this.pushImage = this.pushImage.bind(this);
    this.processChunk = this.processChunk.bind(this);
  }

  componentWillMount() {
    const { store } = this.context;
    const self = this;
    this.listener = (e, data) => {
      store.dispatch({
        type: 'SET_DESTINATION',
        fileName: data.fileName,
        filePath: data.filePath
      });
      this.setState({
        toast: true,
        toastMessage: `${data.fileName} was created in ${data.filePath}`,
      }, () => {
        setTimeout(() => {
          self.setState({
            toast: false,
            toastMessage: ''
          });
        }, 5000);
      });
    };
    ipcRenderer.on('build:rs', this.listener);
  }

  componentDidMount() {
    this.destinationPicker.directory = true;
    this.destinationPicker.webkitdirectory = true;
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('build:rs', this.listener);
  }

  selectionChanged(e) {
    const { store } = this.context;
    const action = {
      type: 'PICK_IMAGE_FIELD',
      used: e.value.includes(e.option),
      field: e.option
    };
    store.dispatch(action);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected.length !== this.state.selected.length) {
      this.setState({
        selected: nextProps.selected
      });
    }
    if (JSON.stringify(this.state.data) !== JSON.stringify(nextProps.data)) {
      this.setState({
        data: nextProps.data
      });
    }
    if (this.state.fileName !== nextProps.fileName || this.state.filePath !== nextProps.filePath) {
      this.setState({
        filePath: nextProps.filePath,
        fileName: nextProps.fileName,
        destination: nextProps.filePath || this.state.filePath
      });
    }
  }

  suggestionSelected(suggestion) {
    const { store } = this.context;
    store.dispatch({
      type: 'IMAGE_VALUE_CHANGE',
      field: suggestion.target.name.toUpperCase(), // ENV
      value: suggestion.suggestion // NODE_ENV=production
    });
  }

  valueChanged(e) {
    const { store } = this.context;
    if (e.target.name.toUpperCase() === 'FROM') {
      if (this.state.lookupTimeout) {
        clearTimeout(this.state.lookupTimeout);
        this.setState({ lookupTimeout: undefined });
      }
      const self = this;
      var value = e.target.value;
      const timeout = setTimeout(() => {
        console.log('In timeout');
        actions.docker.image.search(value).then((data) => {
          console.log(data);
          self.setState({
            imageLookup: data
          });
          console.log(self.state.imageLookup);
        });
      }, 300);
      this.setState({ lookupTimeout: timeout });
    }
    store.dispatch({
      type: 'IMAGE_VALUE_CHANGE',
      field: e.target.name.toUpperCase(), // ENV
      value: e.target.value // NODE_ENV=production
    });
  }

  buildDockerFile() {
    if (Object.keys(this.state.data).length > 0) {
      const payload = this.state.selected
        // ENV: 'NODE_ENV=production'
        .map(item => ({ [item]: this.state.data[item]}))
        // compress to object
        .reduce((sum, next) => Object.assign(sum, next));
      const data = {
        type: 'DOCKERFILE',
        payload,
        destination: this.state.destination
      };
      ipcRenderer.send('build', data);
    }
  }

  togglePreview() {
    const { store } = this.context;
    if (!this.state.preview) {
      actions.readFile(`${this.state.filePath}${path.sep}${this.state.fileName}`)
      .then((content) => {
        this.setState({
          preview: !this.state.preview,
          content
        });
      })
      .catch(() => {
        store.dispatch({
          type: 'DELETE_DOCKERFILE'
        });
        this.setState({
          content: null
        });
      });
    } else {
      this.setState({
        preview: !this.state.preview
      });
    }
  }

  toggleBuildPreview(doBuild, e, test) {
    this.setState({
      buildModalVisible: !this.state.buildModalVisible
    });
    if (doBuild === true) {
      this.buildImage();
    }
  }

  buildImage() {
    const { store } = this.context;
    const projectName = this.state.filePath.split(path.sep).pop().toLowerCase();
    const dockerImageName = this.state.imageName || projectName;
    const self = this;
    store.dispatch({
      type: 'SHOW_NOTIFICATION',
      notificationMessage: `Building ${dockerImageName} image...`,
      notificationType: 'unknown',
      notificationProgress: 0
    });
    actions.docker.image.build(this.state.filePath, { t: dockerImageName })
    .then(() => {
      this.setState({
        imageName: undefined,
        lastBuiltImage: this.state.imageName,
        built: true
      });
      store.dispatch({
        type: 'SHOW_NOTIFICATION',
        notificationMessage: `Image ${dockerImageName} has been built`,
        notificationType: 'ok',
        notificationProgress: 100
      });

      setTimeout(() => {
        store.dispatch({ type: 'HIDE_NOTIFICATION'});
      }, 2000);
    })
    .catch(() => {
      this.setState({ imageName: undefined });
      store.dispatch({
        type: 'SHOW_NOTIFICATION',
        notificationMessage: `Failed to build image. ${e.message}`,
        notificationType: 'critical',
        notificationProgress: 100
      });
      setTimeout(() => {
        store.dispatch({ type: 'HIDE_NOTIFICATION'});
      }, 2000);
    });
  }

  pickDestination(e) {
    const { store } = this.context;
    const file = e.target.files[0];
    const allKeys = supportedSettings.concat(defaultSettings);
    actions.lookupDockerfile(file, allKeys)
    .then((filePath) => {
      this.setState({ destination: file.path });
      store.dispatch({
        type: 'SET_DESTINATION',
        filePath: file.path,
        fileName: 'Dockerfile'
      });
    })
    .catch(() => {
      this.setState({ destination: file.path });
      store.dispatch({
        type: 'SET_DESTINATION',
        filePath: undefined,
        fileName: undefined
      });
    });
  }

  deleteFile() {
    const { store } = this.context;
    const file = `${this.state.filePath}${path.sep}${this.state.fileName}`;
    actions.deleteFile(file)
    .then(() => {
      store.dispatch({ type: 'DELETE_DOCKERFILE' });
    });
  }

  processChunk(chunk) {
    const { store } = this.context;
    try {
      if (chunk) {
        const validChunk = JSON.parse(Buffer.from(chunk).toString('utf8'));
        let text = '';
        if (validChunk.error) {
          text = validChunk.error;
        } else {
          text = validChunk.id ? `${validChunk.status} ${validChunk.id}` : validChunk.status;
        }
        store.dispatch({
          type: 'SHOW_NOTIFICATION',
          notificationMessage: text,
          notificationType: validChunk.error ? 'critical' : 'unknown'
        });
      }
    } catch (e) {}
  }

  pushImage() {
    const { store } = this.context;
    const projectName = this.state.filePath.split(path.sep).pop().toLowerCase();
    const imageName = this.state.lastBuiltImage || projectName;
    actions.docker.image.push(imageName).then((stream) => {
      stream
      .on('data', this.processChunk)
      .on('end', (chunk) => {
        if (chunk) {
          this.processChunk(chunk);
        }
        setTimeout(() => {
          store.dispatch({ type: 'HIDE_NOTIFICATION'});
        }, 2000);
      });
    }).catch((e) => {
      store.dispatch({
        type: 'SHOW_NOTIFICATION',
        notificationMessage: `Failed to push ${imageName}. ${e.message}`,
        notificationType: 'critical'
      });
      setTimeout(() => {
        store.dispatch({ type: 'HIDE_NOTIFICATION'});
      }, 2000);
    });
  }

  imageNameChange(e) {
    this.setState({ imageName: e.target.value });
  }

  render() {
    return (
      <Box>
        {
          this.state.preview ?
          <Preview closeBtn={true} toggleModal={this.togglePreview}>
            <Section style={{ whiteSpace: 'pre' }}>
              <Heading tag='h3' strong={true} margin='none'>{this.state.fileName}</Heading>
              <hr className='invisible'/>
              <Paragraph>
                {this.state.content}
              </Paragraph>
            </Section>
          </Preview>
          : ''
        }
        {
          this.state.buildModalVisible ?
            <BuildModal closeBtn={true} toggleModal={this.toggleBuildPreview}>
              <Form pad='medium' onSubmit={this.toggleBuildPreview.bind(this, true)}>
                <FormFields>
                  <FormField label='Image Name' className="borderless">
                    <TextInput name='name' className="borderless" placeHolder="organization/imageName:imageTag" onChange={this.imageNameChange}/>
                  </FormField>
                </FormFields>
                <Footer pad={{"vertical": "medium"}} justify="center">
                  <Button icon={<Play />}
                    a11yTitle='Build'
                    label='Build'
                    type="submit"
                    style={{ padding: "0px" }}
                    className='btn-small'
                  />
                </Footer>
              </Form>
            </BuildModal>
          : ''
        }
        {
          this.state.toast ? 
          <Toast status='ok'>{this.state.toastMessage}</Toast> : ''
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
                onClick={this.state.destination ? this.buildDockerFile : null}
                plain={true}
                a11yTitle='Save'
                className='btn-small' />
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
              <Button icon={<Play />}
                onClick={this.state.filePath ? this.toggleBuildPreview : null}
                a11yTitle='Build'
                label='Build'
                plain={true}
                className='btn-small'
              />
              <Button icon={<Push />}
                box={true}
                label='Push'
                a11yTitle='Push'
                onClick={this.state.built ? this.pushImage : null}
                plain={true}
                className='btn-small'
                />
              <input ref={ input => this.destinationPicker = input } onChange={this.pickDestination} type='file' style={{ visibility: 'hidden' }} />
            </Box>
            <Heading tag='h4' strong={true} style={{ marginTop: '60px' }} margin='none'>Contents</Heading>
            <hr className='invisible' />
            {
              this.state.selected.includes('ARG') ? 
              <FormFields>
                <fieldset>
                  <FormField label='ARGS' htmlFor='arg'>
                    <textarea rows="3" type='text' id='arg' name='arg' onChange={this.valueChanged} value={this.state.data['ARG']}/>
                  </FormField>
                </fieldset>
              </FormFields> : ''
            }
            {
              this.state.selected.includes('FROM') ?
              <FormField label='FROM'>
                <TextInput name='from' onDOMChange={this.valueChanged} value={this.state.data['FROM']} suggestions={this.state.imageLookup} onSelect={this.suggestionSelected.bind(this)}/>
              </FormField> : ''
            }
            {
              this.state.selected.includes('LABEL') ?
              <FormFields>
                <fieldset>
                  <FormField label='LABEL' htmlFor='label'>
                    <textarea rows="3" type='text' id='label' name='label' onChange={this.valueChanged} value={this.state.data['LABEL'] || ''}/>
                  </FormField>
                </fieldset>
              </FormFields> : ''
            }
            {
              this.state.selected.includes('USER') ?
              <FormField label='USER'>
                <TextInput name='user' onDOMChange={this.valueChanged} value={this.state.data['USER'] || ''}/>
              </FormField> : ''
            }
            {
              this.state.selected.includes('SHELL') ?
              <FormField label='SHELL'>
                <TextInput name='shell' onDOMChange={this.valueChanged} value={this.state.data['SHELL'] || ''}/>
              </FormField> : ''
            }
            {
              this.state.selected.includes('WORKDIR') ?
              <FormField label='WORKDIR'>
                <TextInput name='workdir' onDOMChange={this.valueChanged} value={this.state.data['WORKDIR'] || ''}/>
              </FormField> : ''
            }
            {
              this.state.selected.includes('ADD') ?
              <FormFields>
                <fieldset>
                  <FormField label='ADD' htmlFor='add'>
                    <textarea rows="3" type='text' id='add' name='add' onChange={this.valueChanged} value={this.state.data['ADD'] || ''}/>
                  </FormField>
                </fieldset>
              </FormFields> : ''
            }
            {
              this.state.selected.includes('COPY') ?
              <FormFields>
                <fieldset>
                  <FormField label='COPY' htmlFor='copy'>
                    <textarea rows="3" type='text' id='copy' name='copy' onChange={this.valueChanged} value={this.state.data['COPY'] || ''}/>
                  </FormField>
                </fieldset>
              </FormFields> : ''
            }
            {
              this.state.selected.includes('RUN') ?
              <FormFields>
                <fieldset>
                  <FormField label='RUN' htmlFor='run'>
                    <textarea rows="3" type='text' id='run' name='run' onChange={this.valueChanged} value={this.state.data['RUN'] || ''}/>
                  </FormField>
                </fieldset>
              </FormFields> : ''
            }
            {
              this.state.selected.includes('EXPOSE') ?
              <FormFields>
                <fieldset>
                  <FormField label='EXPOSE' htmlFor='expose'>
                    <textarea rows="3" type='text' id='expose' name='expose' onChange={this.valueChanged} value={this.state.data['EXPOSE'] || ''}/>
                  </FormField>
                </fieldset>
              </FormFields> : ''
            }
            {
              this.state.selected.includes('ENV') ?
              <FormFields>
                <fieldset>
                  <FormField label='ENV' htmlFor='env'>
                    <textarea rows="3" type='text' id='env' name='env' onChange={this.valueChanged} value={this.state.data['ENV'] || ''}/>
                  </FormField>
                </fieldset>
              </FormFields> : ''
            }
            {
              this.state.selected.includes('VOLUME') ?
              <FormField label='VOLUME'>
                <TextInput name='volume' onDOMChange={this.valueChanged} value={this.state.data['VOLUME'] || ''}/>
              </FormField> : ''
            }
            {
              this.state.selected.includes('ENTRY POINT') ?
              <FormField label='ENTRY POINT'>
                <TextInput name='entry point' onDOMChange={this.valueChanged} value={this.state.data['ENTRY POINT'] || ''}/>
              </FormField> : ''
            }
            {
              this.state.selected.includes('ONBUILD') ?
              <FormFields>
                <fieldset>
                  <FormField label='ONBUILD' htmlFor='onbuild'>
                    <textarea rows="3" type='text' id='onbuild' name='onbuild' onChange={this.valueChanged} value={this.state.data['ONBUILD'] || ''}/>
                  </FormField>
                </fieldset>
              </FormFields> : ''
            }
            {
              this.state.selected.includes('STOP SIGNAL') ?
              <FormField label='STOP SIGNAL'>
                <TextInput name='stop signal' onDOMChange={this.valueChanged} value={this.state.data['STOP SIGNAL'] || ''}/>
              </FormField> : ''
            }
            {
              this.state.selected.includes('HEALTHCHECK') ?
              <FormField label='HEALTHCHECK'>
                <TextInput name='healthcheck' onDOMChange={this.valueChanged} value={this.state.data['HEALTHCHECK'] || ''}/>
              </FormField> : ''
            }
            {
              this.state.selected.includes('CMD') ?
              <FormField label='CMD'>
                <TextInput name='cmd' onDOMChange={this.valueChanged} value={this.state.data['CMD'] || ''}/>
              </FormField> : ''
            }
          </Box>
          <Box justify='start' align='center' full='vertical' basis='medium' pad={{ horizontal: 'medium' }} style={{ position: 'fixed', right: '20px', zIndex: 1000 }}>
            <Select inline={true}
              multiple={true}
              options={supportedSettings}
              value={this.state.selected}
              onChange={this.selectionChanged}
              className="inline-select" />
          </Box>
        </Box>
      </Box>
    )
  }
}

const mapStateToProps = state => ({
  selected: state.docker.build.images.fields,
  data: state.docker.build.images.data,
  fileName: state.docker.build.images.fileName,
  filePath: state.docker.build.images.filePath
});

const mapDispatchToProps = dispatch => ({ dispatch });

ImageBuildPage.contextTypes = {
  store: PropTypes.object
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ImageBuildPage);
