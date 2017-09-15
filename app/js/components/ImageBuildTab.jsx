import React from 'react';
import Box from 'grommet/components/Box';
import FormField from 'grommet/components/FormField';
import FormFields from 'grommet/components/FormFields';
import TextInput from 'grommet/components/TextInput';
import Button from 'grommet/components/Button';
import Select from 'grommet/components/Select';

import actions from '../actions/actions.js';

class ImageBuildTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected || ['FROM', 'CMD', 'EXPOSE', 'ENV', 'COPY', 'WORKDIR']
    }
    this.selectionChanged = this.selectionChanged.bind(this);
  }


  selectionChanged(e) {
    this.setState({ selected: e.value });
  }

  render() {
    return (
      <Box className='padded-xl wrapper-borderless'>
        <Box direction='row'>
          <Select inline={true}
            multiple={true}
            options={['FROM', 'RUN', 'CMD', 'LABEL', 'EXPOSE', 'ENV', 'ADD', 'COPY', 'ENTRY POINT', 'VOLUME', 'USER', 'WORKDIR', 'ARG', 'ONBUILD', 'STOP SIGNAL', 'HEALTHCHECK', 'SHELL']}
            value={this.state.selected}
            onChange={this.selectionChanged}
            className="inline-select" />
        </Box>
        <hr/>
        <FormField label="Import From Dockerfile" className="borderless">
          <input type={'file'}/>
        </FormField>
        <hr/>
        {
          this.state.selected.includes('ARG') ? 
          <FormFields>
            <fieldset>
              <FormField label='ARGS' htmlFor='args'>
                <textarea rows="3" type='text' id='args' name='args'/>
              </FormField>
            </fieldset>
          </FormFields> : ''
        }
        {
          this.state.selected.includes('FROM') ?
          <FormField label='FROM'>
            <TextInput/>
          </FormField> : ''
        }
        {
          this.state.selected.includes('LABEL') ?
          <FormFields>
            <fieldset>
              <FormField label='LABEL' htmlFor='labels'>
                <textarea rows="3" type='text' id='labels' name='labels'/>
              </FormField>
            </fieldset>
          </FormFields> : ''
        }
        <FormField label='USER'>
          <TextInput/>
        </FormField>
        <FormField label='SHELL'>
          <TextInput/>
        </FormField>
        <FormField label='WORKDIR'>
          <TextInput/>
        </FormField>
        <FormFields>
          <fieldset>
            <FormField label='ADD' htmlFor='adds'>
              <textarea rows="3" type='text' id='adds' name='adds'/>
            </FormField>
          </fieldset>
        </FormFields>
        <FormFields>
          <fieldset>
            <FormField label='COPY' htmlFor='copies'>
              <textarea rows="3" type='text' id='copies' name='copies'/>
            </FormField>
          </fieldset>
        </FormFields>
        <FormFields>
          <fieldset>
            <FormField label='RUN' htmlFor='runs'>
              <textarea rows="3" type='text' id='runs' name='runs'/>
            </FormField>
          </fieldset>
        </FormFields>
        <FormFields>
          <fieldset>
            <FormField label='EXPOSE' htmlFor='ports'>
              <textarea rows="3" type='text' id='ports' name='ports'/>
            </FormField>
          </fieldset>
        </FormFields>
        <FormFields>
          <fieldset>
            <FormField label='ENV' htmlFor='envs'>
              <textarea rows="3" type='text' id='envs' name='envs'/>
            </FormField>
          </fieldset>
        </FormFields>
        <FormField label='VOLUME'>
          <TextInput/>
        </FormField>
        <FormField label='ENTRYPOINT'>
          <TextInput/>
        </FormField>
        <FormFields>
          <fieldset>
            <FormField label='ONBUILD' htmlFor='onbuilds'>
              <textarea rows="3" type='text' id='onbuilds' name='onbuilds'/>
            </FormField>
          </fieldset>
        </FormFields>
        <FormField label='STOPSIGNAL'>
          <TextInput/>
        </FormField>
        <FormField label='HEALTHCHECK'>
          <TextInput/>
        </FormField>
        <FormField label='CMD'>
          <TextInput/>
        </FormField>
      </Box>
    )
  }
}

module.exports = ImageBuildTab;
