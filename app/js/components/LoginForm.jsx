import React from 'react';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Head from 'grommet/components/Header';
import Image from 'grommet/components/Image';
import CheckBox from 'grommet/components/CheckBox';
import Form from 'grommet/components/Form';
import FooterPane from 'grommet/components/Footer';
import Label from 'grommet/components/Label';
import FormField from 'grommet/components/FormField';
import FormFields from 'grommet/components/FormFields';
import TextInput from 'grommet/components/TextInput';
import PasswordInput from 'grommet/components/PasswordInput';

const path = require('path');
const dockerLogoPath = path.posix.resolve('./app/img/docker-logo.jpg');

const actions = require('../actions.js');

class LoginForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      customRegistry: false,
      username: '',
      password: '',
      registry: '',
      remember: false
    };
    this.toggleCustomRegistry = this.toggleCustomRegistry.bind(this);
    this.usernameChanged = this.usernameChanged.bind(this);
    this.passwordChanged = this.passwordChanged.bind(this);
    this.registryChanged = this.registryChanged.bind(this);
    this.rememberChange = this.rememberChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  usernameChanged(e) {
    this.setState({
      username: e.target.value
    });
  }

  rememberChange(e) {
    this.setState({
      remember: !this.state.remember
    });
  }

  passwordChanged(e) {
    this.setState({
      password: e.target.value
    });
  }

  registryChanged(e) {
    this.setState({
      registry: e.target.value
    });
  }

  toggleCustomRegistry() {
    this.setState({
      customRegistry: !this.state.customRegistry
    });
  }

  onSubmit(e) {
    e.preventDefault();
    actions.authenticate(this.state);
    this.props.toggleModal();
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Head justify='center' direction='column' pad='medium'>
          <Image src={dockerLogoPath} size='thumb'/>
          <Label margin='none'>
          Docker Registry Auth
          </Label>
        </Head>
        <hr className='invisible'/>
        <FormFields>
          <fieldset>
            <FormField label='Username' className='borderless'>
              <TextInput name='host' value={this.state.username} onDOMChange={this.usernameChanged} className='borderless'/>
            </FormField>
            <FormField label='Password' className='borderless'>
              <PasswordInput name='host' value={this.state.password} onChange={this.passwordChanged} className='borderless'/>
            </FormField>
            { this.state.customRegistry ? 
              <FormField label='Registry' className='borderless'>
                <TextInput name='registry' value={this.state.registry} placeHolder='https://index.docker.io/v1' onDOMChange={this.registryChanged} className='borderless'/>
              </FormField>
              :
              <FormField label='' className='borderless'>
              </FormField>
            }
            <FormField className='borderless'>
              <CheckBox id='agree'
              name='remember'
              label='Remember'
              onChange={this.rememberChange}/>
            </FormField>
            <FormField className='borderless'>
              <CheckBox label='Custom registry' toggle={true} onChange={this.toggleCustomRegistry} />
            </FormField>
          </fieldset>
        </FormFields>
        
        <Box justify='center' direction='row' align='center'>
          <FooterPane pad={{vertical: 'medium'}} justify='center'>
            <Button label='Submit'
            type='submit'
            fill={false}
            />
          </FooterPane>
        </Box>
      </Form>
    );
  }
}

module.exports = LoginForm;
