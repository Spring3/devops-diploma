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
      selected: this.props.selected || ['FROM', 'CMD', 'EXPOSE', 'ENV', 'COPY', 'WORKDIR'],
      data: this.props.data || {}
    };
    this.selectionChanged = this.selectionChanged.bind(this);
    this.valueChanged = this.valueChanged.bind(this);
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
    console.log(nextProps);
    if (nextProps.selected.length !== this.state.selected.length) {
      this.setState({
        selected: nextProps.selected
      });
    }
    if (JSON.stringify(this.state.data) !== JSON.stringify(nextProps.data)) {
      console.log('here');
      this.setState({
        data: nextProps.data
      });
    }
  }

  valueChanged(e) {
    const { store } = this.context;
    store.dispatch({
      type: 'IMAGE_VALUE_CHANGE',
      field: e.target.name.toUpperCase(),
      value: e.target.value
    });
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
              <FormField label='ARGS' htmlFor='arg'>
                <textarea rows="3" type='text' id='arg' name='arg' onChange={this.valueChanged} value={this.state.data['ARG']}/>
              </FormField>
            </fieldset>
          </FormFields> : ''
        }
        {
          this.state.selected.includes('FROM') ?
          <FormField label='FROM'>
            <TextInput name='from' onDOMChange={this.valueChanged} value={this.state.data['FROM']}/>
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
    )
  }
}

const mapStateToProps = state => ({
  selected: state.docker.build.images.fields,
  data: state.docker.build.images.data
});

const mapDispatchToProps = dispatch => ({ dispatch });

ImageBuildTab.contextTypes = {
  store: PropTypes.object
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ImageBuildTab);
