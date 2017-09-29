import React from 'react';
import Notification from 'grommet/components/Notification';
import Animate from 'grommet/components/Animate';

class NotificationComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Animate  
        enter={{ animation: 'slide-up', duration: 450, delay: 0 }}
        leave={{ animation: 'slide-down', duration: 450, delay: 0 }}
        keep={false}>
        {
          (typeof this.props.progress === 'number') ?
          <Notification className='notification' status={this.props.type} message={this.props.message} percentComplete={this.props.progress} size='small'/>
          :
          <Notification className='notification' status={this.props.type} message={this.props.message} size='small'/>
        }
      </Animate>
    );
  }
}

module.exports = NotificationComponent;
