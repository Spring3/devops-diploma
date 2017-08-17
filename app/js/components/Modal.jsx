import React from 'react';
import Layer from 'grommet/components/Layer';

class Modal extends React.Component {
  render() {
    return (
      <Layer closer={this.props.closeBtn} onClose={this.props.toggleModal}>
        {this.props.children}
      </Layer>
    );
  }
}

module.exports = Modal;
