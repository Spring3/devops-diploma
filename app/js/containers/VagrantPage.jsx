import React from 'react';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Heading from 'grommet/components/Heading';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Download from 'grommet/components/icons/base/DocumentDownload';
import Trash from 'grommet/components/icons/base/Trash';
import Slider from 'react-rangeslider'

const os = require('os');

class VagrantPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cpus: 0,
      memory: 0,
      vms: 0
    };

    this.cpuChanged = this.cpuChanged.bind(this);
    this.memoryChanged = this.memoryChanged.bind(this);
    this.vmAmountChange = this.vmAmountChange.bind(this);
  }

  cpuChanged(e) {
    this.setState({
      cpus: e
    });
  }

  memoryChanged(e) {
    this.setState({
      memory: e
    });
  }

  vmAmountChange(e) {
    this.setState({
      vms: e
    });
  }

  render() {
    const totalMemoryMB = os.totalmem() / 1024**2
    return (
      <Box>
        <Box direction='row' pad={{ horizontal: 'medium' }}>
          <Box className='wrapper-borderless' full='horizontal' alignContent="stretch">
            <Box direction='row' justify='start' alignSelf='stretch' align='center' style={{ background: 'white', position: 'fixed', zIndex: 999, width: '100%' }}>
              <Button icon={<Download />}
                box={true}
                label='Save'
                plain={true}
                onClick={() => this.destinationPicker.click()}
                a11yTitle='Save'
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
              <input ref={ input => this.destinationPicker = input } onChange={this.saveToDestination} type='file' style={{ visibility: 'hidden' }} />
            </Box>
            <Heading tag='h4' strong={true} style={{ marginTop: '60px' }} margin='none'>Configuration</Heading>
            <Box>
              <FormField label='Amount of VMs'>
                <Slider
                  value={this.state.vms}
                  max={os.cpus().length}
                  step={1}
                  orientation="horizontal"
                  onChange={this.vmAmountChange}
                />
              </FormField>
              <FormField label='Vagrant Box'>
                <TextInput name='box' className='borderless' onDOMChange={this.valueChanged} placeHolder='ubuntu/trusty64' />
              </FormField>
              <FormField label='Exposed Port'>
                <TextInput name='port' className='borderless' onDOMChange={this.valueChanged} placeHolder='3000:3000' />
              </FormField>
              <FormField label='Project Root Folder'>
                <TextInput name='workdir' className='borderless' onDOMChange={this.valueChanged} placeHolder='/project' />
              </FormField>
              <FormField label='CPUs'>
                <Slider
                  value={this.state.cpus}
                  max={os.cpus().length}
                  step={1}
                  orientation="horizontal"
                  onChange={this.cpuChanged}
                />
              </FormField>
              <FormField label='Memory MB'>
                <Slider
                  value={this.state.memory}
                  max={totalMemoryMB}
                  step={1}
                  orientation="horizontal"
                  onChange={this.memoryChanged}
                />
              </FormField>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

module.exports = VagrantPage;
