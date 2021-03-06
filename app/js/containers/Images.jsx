import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';

import actions from '../actions/actions';

const DAYS = 1000 * 3600 * 24;

class ImagesPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      images: [],
      tableItems: [],
      searchResult: [],
      selected: null
    };
    this.renderImages = this.renderImages.bind(this);
    this.imageSelected = this.imageSelected.bind(this);
  }

  componentWillMount() {
    const { store } = this.context;
    const images = store.getState().docker.images.items;
    this.setState({ images });
    this.renderImages(images);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchResult && nextProps.searchResult.length !== this.state.searchResult.length) {
      if (nextProps.searchResult.length > 0) {
        this.renderImages(nextProps.searchResult, true);
      } else {
        this.renderImages(nextProps.images);
      }
    } else {
      this.renderImages(nextProps.images);
    }
  }

  imageSelected(item) {
    const tableRow = this.state.tableItems[item];
    const id = tableRow.props.children[2].props.children;
    const fullId = this.state.images.filter(image => image.id.indexOf(id) >= 0)[0].id;
    actions.docker.image.select(fullId);
  }

  renderImages(images, search = false) {
    const tableItems = images.map((image, i) =>
        (<TableRow key={i} className={'row row-image'}>
          <td>{image.repo}</td>
          <td>{image.tag}</td>
          <td>{image.id.substring(0, 12)}</td>
          <td>{new Date(image.created).toISOString().slice(0, 10)}</td>
          <td>{Math.ceil(image.size / 1000000) + ' MB'}</td>
        </TableRow>));
    if (search) {
      this.setState({ tableItems, searchResult: images })
    } else {
      this.setState({ tableItems, images });
    }
  }

  render() {
    return (
      <Box>
        <Box full='horizontal' pad='none' margin={{vertical: 'small', horizontal: 'none'}}>
          <Table responsive={true}
            selectable={true}
            scrollable={true}
            onSelect={this.imageSelected}>
            <thead>
              <tr>
                <th>Repository</th>
                <th>Tag</th>
                <th>Id</th>
                <th>Created</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {this.state.tableItems}
            </tbody>
          </Table>
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  images: state.docker.images.items,
  searchResult: state.docker.images.searchResult
});

const mapDispatchToProps = dispatch => ({
  dispatch
});

ImagesPage.contextTypes = {
  store: PropTypes.object
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(ImagesPage);
