import React from 'react';
import Box from 'grommet/components/Box';
import Label from 'grommet/components/Label';
import Checkbox from 'grommet/components/CheckBox';
import Button from 'grommet/components/Button';
import CloseIcon from 'grommet/components/icons/base/Close';

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      checked: !!this.props.checked
    };
  }

  check(e) {
    if (this.props.onCheck) {
      this.props.onCheck(e);
    }
    this.setState({
      checked: !this.state.checked
    });
  }

  onClose(e) {
    if (this.props.onClose) {
      this.props.onClose(e, this.props.index);
    }
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    return (
      <Box className={this.props.className} style={{ position: 'relative' }} pad='small'>
        <Button
          className='iconBtn'
          style={{
            position: 'absolute',
            right: '5px',
            top: '0px'
          }}
          icon={<CloseIcon style={{ width: '15px', padding: '0px' }} />}
          onClick={this.onClose.bind(this)}
          plain={true}
        />
        <Label style={{ marginTop: '12px', marginBottom: '12px', padding: '5px' }}>{this.props.label}</Label>
        <Box direction='row' pad='none'>
        { this.props.checkbox ?
          <Checkbox disabled={true} checked={this.state.checked} onChange={this.check.bind(this)} label={this.props.checkboxLabel}/>
          : ''
        }
        </Box>
      </Box>
    );
  }
}

module.exports = Card;
