import React from 'react';
import { connect } from 'react-redux';
import actions from '../actions/actions.js';

class ImageStatusPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: props.selectedImage
    };
    console.log(this.state.selectedImage);
  }

  render() {
    return (
      <div>
        <div>Id: {this.state.selectedImage.Id}</div>
        <div>Architecture: {this.state.selectedImage.Architecture}</div>
        <div>Author: {this.state.selectedImage.Author}</div>
        <div>Commend: {this.state.selectedImage.Commend}</div>
        <div>Command: {this.state.selectedImage.Config.Cmd}</div>
        <div>Environment: {this.state.selectedImage.Config.Env}</div>
        <div>Volumes: {this.state.selectedImage.Config.Volumes}</div>
        <div>WorkingDir: {this.state.selectedImage.WorkingDir}</div>
        <div>OS: {this.state.selectedImage.Os}</div>
        <div>RepoDigests: {this.state.selectedImage.RepoDigests}</div>
        <div>RepoTags: {this.state.selectedImage.RepoTags}</div>
        <div>Size: {this.state.selectedImage.Size}</div>
        <div>Created: {this.state.selectedImage.Created.split(0, 12)}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedImage: state.docker.images.selected
});

module.exports = connect(mapStateToProps)(ImageStatusPage);
