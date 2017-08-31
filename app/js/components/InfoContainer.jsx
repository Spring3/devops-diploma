import React from 'react';
import Header from 'grommet/components/Header';
import Label from 'grommet/components/Label';
import TextInput from 'grommet/components/TextInput';

class InfoContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }

  valueChanged(e) {
    this.props.onChange(e.target.value);
  }

  stub() {}

  prepareComponent () {
    let value = this.state.value;
    if (Array.isArray(value)) {
      if (!this.props.inline) {
        return value.map((v, i) =>
          this.props.editable === true ?
          (<TextInput className="borderless" onChange={this.stub} onDOMChange={this.valueChanged.bind(this)} value={v} key={i}></TextInput>) :
          (<Label margin='none' key={i}>{v}</Label>)
        );
      } else {
        value = this.state.value.join(' ');
      }
    }
    return this.props.editable === true ?
    (<TextInput className="borderless" onChange={this.stub} onDOMChange={this.valueChanged.bind(this)} value={value}></TextInput>) :
    (<Label margin='none'>{value}</Label>);
  }

  render() {
    const keyClass = this.props.inline == true ? 'info-container-key inline-key' : 'info-container-key';
    let valueClass = this.props.inline == true ? 'info-container-value inline-value' : 'info-container-value';
    const valueComponent = this.prepareComponent();
    if (Array.isArray(valueComponent)) {
      valueClass += ' margined-value';
    }

    if (this.props.small == true) {
      valueClass += ' small';
    }
    
    return(
      <div className="info-container">
        <div className={keyClass}>
          <Header size='small'>{this.props.name}</Header>
        </div>
        <div className={valueClass}>
          { valueComponent }
        </div>
      </div>
    );
  }
}

module.exports = InfoContainer;
