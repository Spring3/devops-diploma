import React from 'react';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Paragraph from 'grommet/components/Paragraph';
import FormField from 'grommet/components/FormField';
import FormFields from 'grommet/components/FormFields';
import TextInput from 'grommet/components/TextInput';
import Button from 'grommet/components/Button';

class MainTabs extends React.Component {
  render() {
    return (
      <Tabs justify={'start'}>
        <Tab title={'Image'}>
          <FormField label="From Dockerfile" className="borderless">
            <input type={'file'}/>
          </FormField>
          <Button label="Use existing image"/>
          <hr/>
          <FormFields>
            <fieldset>
              <FormField label='ARGS' htmlFor='args'>
                <textarea rows="3" type='text' id='args' name='args'/>
              </FormField>
            </fieldset>
          </FormFields>
          <FormField label='FROM' className="borderless">
            <TextInput className="borderless"/>
          </FormField>
          <FormFields>
            <fieldset>
              <FormField label='LABEL' htmlFor='labels'>
                <textarea rows="2" type='text' id='labels' name='labels'/>
              </FormField>
            </fieldset>
          </FormFields>
          <FormField label='USER' className="borderless">
            <TextInput className="borderless"/>
          </FormField>
          <FormField label='SHELL' className="borderless">
            <TextInput className="borderless"/>
          </FormField>
          <FormField label='WORKDIR' className="borderless">
            <TextInput className="borderless"/>
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
                <textarea rows="2" type='text' id='ports' name='ports'/>
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
          <FormField label='VOLUME' className="borderless">
            <TextInput className="borderless"/>
          </FormField>
          <FormField label='ENTRYPOINT' className="borderless">
            <TextInput className="borderless"/>
          </FormField>
          <FormFields>
            <fieldset>
              <FormField label='ONBUILD' htmlFor='onbuilds'>
                <textarea rows="3" type='text' id='onbuilds' name='onbuilds'/>
              </FormField>
            </fieldset>
          </FormFields>
          <FormField label='STOPSIGNAL' className="borderless">
            <TextInput className="borderless"/>
          </FormField>
          <FormField label='HEALTHCHECK' className="borderless">
            <TextInput className="borderless"/>
          </FormField>
          <FormField label='CMD' className="borderless">
            <TextInput className="borderless"/>
          </FormField>
        </Tab>
        <Tab title={'Container'}>
          <Paragraph>
            Second contents
          </Paragraph>
          <input type={'text'}
            value={''}/>
        </Tab>
        <Tab title={'CLI'}>
          <Paragraph>
            Second contents
          </Paragraph>
          <input type={'text'}
            value={''}/>
        </Tab>
      </Tabs>
    );
  }
}

module.exports = MainTabs;
