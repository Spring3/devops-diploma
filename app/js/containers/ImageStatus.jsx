import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../actions/actions.js';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import InfoContainer from '../components/InfoContainer';

const MB = 1000000;

class ImageStatusPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: props.selectedImage
    };
    console.log(this.state.selectedImage);
    this.deleteImage = this.deleteImage.bind(this);
  }

  deleteImage() {
    const { store } = this.context;
    actions.docker.image.get(this.state.selectedImage.Id).remove({ force: true });
    store.dispatch({ type: 'REMOVE_SELECTED_IMAGE' });
    this.props.history.goBack();
  }

  runImage() {

  }

  render() {
    const id = this.state.selectedImage.Id.split(':')[1];
    const exposedPorts = this.state.selectedImage.Config.ExposedPorts ? Object.keys(this.state.selectedImage.Config.ExposedPorts) : [];
    const volumes = this.state.selectedImage.Config.Volumes ? Object.keys(this.state.selectedImage.Config.Volumes) : [];
    const repoDigest = this.state.selectedImage.RepoDigests.map(digest => digest.split('@')[0]);
    const repoTags = this.state.selectedImage.RepoTags.map(tag => tag.split(':')[1]);
    const sizeMb = Math.ceil(this.state.selectedImage.Size / MB) + ' MB';

    return (
      <div className='info-container-wrapper'>
        <InfoContainer name="Id" value={id} inline={true} small={true}/>
        <InfoContainer name="Architecture" value={this.state.selectedImage.Architecture} inline={true}/>
        <InfoContainer name="Author" value={this.state.selectedImage.Author} inline={true}/>
        <InfoContainer name="Comment" value={this.state.selectedImage.Comment} inline={true}/>
        <InfoContainer name="Command" value={this.state.selectedImage.Config.Cmd} inline={true}/>
        <InfoContainer name="Exposed Ports" value={exposedPorts}/>
        <InfoContainer name="Environment" value={this.state.selectedImage.Config.Env}/>
        <InfoContainer name="Volumes" value={volumes}/>
        <InfoContainer name="Working Directory" value={this.state.selectedImage.WorkingDir} inline={true}/>
        <InfoContainer name="OS" value={this.state.selectedImage.Os} inline={true}/>
        <InfoContainer name="Repo Digests" value={repoDigest} inline={true}/>
        <InfoContainer name="Repo Tags" value={repoTags} />
        <InfoContainer name="Size" value={sizeMb} inline={true}/>
        <InfoContainer name="Created" value={this.state.selectedImage.Created.slice(0, 10)} inline={true}/>
        <hr className='invisible'/>
        <Box direction='row' full='horizontal' justify='center'>
          <Button label='Run'
            onClick={this.runImage}
            accent={true}
            className='margin-right' />
          <Button label='Remove'
            onClick={this.deleteImage}
            critical={true}
            className='margin-right' />
        </Box>
        <hr className='invisible'/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedImage: state.docker.images.selected
});

ImageStatusPage.contextTypes = {
  store: PropTypes.object
};

module.exports = connect(mapStateToProps)(ImageStatusPage);
