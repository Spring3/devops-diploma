import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
    console.log(e);
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
        {
          this.state.selected.includes('USER') ?
          <FormField label='USER'>
            <TextInput/>
          </FormField> : ''
        }
        {
          this.state.selected.includes('SHELL') ?
          <FormField label='SHELL'>
            <TextInput/>
          </FormField> : ''
        }
        {
          this.state.selected.includes('WORKDIR') ?
          <FormField label='WORKDIR'>
            <TextInput/>
          </FormField> : ''
        }
        {
          this.state.selected.includes('ADD') ?
          <FormFields>
            <fieldset>
              <FormField label='ADD' htmlFor='adds'>
                <textarea rows="3" type='text' id='adds' name='adds'/>
              </FormField>
            </fieldset>
          </FormFields> : ''
        }
        {
          this.state.selected.includes('COPY') ?
          <FormFields>
            <fieldset>
              <FormField label='COPY' htmlFor='copies'>
                <textarea rows="3" type='text' id='copies' name='copies'/>
              </FormField>
            </fieldset>
          </FormFields> : ''
        }
        {
          this.state.selected.includes('RUN') ?
          <FormFields>
            <fieldset>
              <FormField label='RUN' htmlFor='runs'>
                <textarea rows="3" type='text' id='runs' name='runs'/>
              </FormField>
            </fieldset>
          </FormFields> : ''
        }
        {
          this.state.selected.includes('EXPOSE') ?
          <FormFields>
            <fieldset>
              <FormField label='EXPOSE' htmlFor='ports'>
                <textarea rows="3" type='text' id='ports' name='ports'/>
              </FormField>
            </fieldset>
          </FormFields> : ''
        }
        {
          this.state.selected.includes('ENV') ?
          <FormFields>
            <fieldset>
              <FormField label='ENV' htmlFor='envs'>
                <textarea rows="3" type='text' id='envs' name='envs'/>
              </FormField>
            </fieldset>
          </FormFields> : ''
        }
        {
          this.state.selected.includes('VOLUME') ?
          <FormField label='VOLUME'>
            <TextInput/>
          </FormField> : ''
        }
        {
          this.state.selected.includes('ENTRY POINT') ?
          <FormField label='ENTRY POINT'>
            <TextInput/>
          </FormField> : ''
        }
        {
          this.state.selected.includes('ONBUILD') ?
          <FormFields>
            <fieldset>
              <FormField label='ONBUILD' htmlFor='onbuilds'>
                <textarea rows="3" type='text' id='onbuilds' name='onbuilds'/>
              </FormField>
            </fieldset>
          </FormFields> : ''
        }
        {
          this.state.selected.includes('STOP SIGNAL') ?
          <FormField label='STOP SIGNAL'>
            <TextInput/>
          </FormField> : ''
        }
        {
          this.state.selected.includes('HEALTHCHECK') ?
          <FormField label='HEALTHCHECK'>
            <TextInput/>
          </FormField> : ''
        }
        {
          this.state.selected.includes('CMD') ?
          <FormField label='CMD'>
            <TextInput/>
          </FormField> : ''
        }
      </Box>
    )
  }
}

const mapStateToProps = state => ({
  selected: state.docker.build.images.fields
});

const mapDispatchToProps = dispatch => ({
  dispatch
});

ImageBuildTab.contextTypes = {
  store: PropTypes.object
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ImageBuildTab);
