import React from 'react';
import Meter from 'grommet/components/Meter';
import Box from 'grommet/components/Box';
import Label from 'grommet/components/Label';

class Chart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.type === 'circle' ?
        <Meter type='circle'
          label={<Label size='small'>{this.props.label} {this.props.units}</Label>}
          size={this.props.size || 'small'}
          series={this.props.series || null}
          stacked={!!this.props.stacked}
          max={this.props.max}
          value={this.props.value}
        />
      : null
    );
  }
}

module.exports = Chart;
