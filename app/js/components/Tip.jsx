import React from 'react';
import TipPopup from 'grommet/components/Tip';

class Tip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeout: null,
      text: this.props.text || '',
      target: this.props.target || ''
    }
    this.onClose = this.onClose.bind(this);
    this.show = this.show.bind(this);
  }

  componentWillMount() {
    this.show();
  }

  componentWillUnmount() {
    if (this.state.timeout) {
      this.onClose();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.state.text || nextProps.target !== this.state.target) {
      this.onClose();
      this.setState({
        text: nextProps.text,
        target: nextProps.target
      }, () => this.show());
    }
  }

  show() {
    if (this.state.timeout) {
      this.onClose();
    }
    const self = this;
    this.setState({
      timeout: setTimeout(() => {
        self.onClose();
      }, 2000)
    });
  }

  onClose() {
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
      this.setState({
        timeout: null
      });
    }
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    if (this.state.text && this.state.timeout) { 
      return <TipPopup target={this.state.target} onClose={this.onClose} style={{ zIndex: 999999 }} colorIndex='light-2'>{this.state.text}</TipPopup>
    }
    return <div style={{ display: 'none'}}></div>
  }
}

module.exports = Tip;
