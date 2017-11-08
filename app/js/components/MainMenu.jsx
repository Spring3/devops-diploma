import React from 'react';
import Box from 'grommet/components/Box';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
    this.infrastructureRedirect = this.infrastructureRedirect.bind(this);
  }

  redirect(e) {
    const pages = ['image', 'compose', 'stack'];
    console.log(pages[e]);
    this.props.dispatch(push(`/${pages[e]}`));
  }

  infrastructureRedirect(e) {
    const pages = ['vagrant'];
    console.log(pages[e]);
    this.props.dispatch(push(`/${pages[e]}`)); 
  }

  render() {
    return(
    <Box fill='horizontal'>
      <Box flex='grow'>
        <Box pad={{ horizontal: 'medium' }}>
          <Heading tag='h3' strong={true}>
            Create New
          </Heading>
        </Box>
        <Tiles selectable={true}
          fill={false}
          flush={false}
          onSelect={this.redirect}>
          <Tile separator='top'
            align='start'
            basis='small'>
            <Header size='small'
              pad={{"horizontal": "small"}}>
              <Heading tag='h4'
                strong={true}
                margin='none'>
                Dockerfile
              </Heading>
            </Header>
            <Box pad='small'>
              <Paragraph margin='none'>
                Standard docker image
              </Paragraph>
            </Box>
          </Tile>
          <Tile separator='top'
            align='start'
            basis='small'>
            <Header size='small'
              pad={{"horizontal": "small"}}>
              <Heading tag='h4'
                strong={true}
                margin='none'>
                Compose file
              </Heading>
            </Header>
            <Box pad='small'>
              <Paragraph margin='none'>
                Docker compose v3
              </Paragraph>
            </Box>
          </Tile>
          <Tile separator='top'
            align='start'
            basis='small'>
            <Header size='small'
              pad={{"horizontal": "small"}}>
              <Heading tag='h4'
                strong={true}
                margin='none'>
                Stack file
              </Heading>
            </Header>
            <Box pad='small'>
              <Paragraph margin='none'>
                Docker stack file with Consul support
              </Paragraph>
            </Box>
          </Tile>
        </Tiles>
      </Box>
      <Box style={{ marginBottom: '-100px' }}>
        <Box pad={{ horizontal: 'medium' }}>
          <Heading tag='h3' strong={true}>
            Infrastructure
          </Heading>
        </Box>
        <Tiles selectable={true}
          fill={false}
          flush={false}
          onSelect={this.infrastructureRedirect}>
          <Tile separator='top'
            align='start'
            basis='small'>
            <Header size='small'
              pad={{"horizontal": "small"}}>
              <Heading tag='h4'
                strong={true}
                margin='none'>
                Vagrant
              </Heading>
            </Header>
            <Box pad='small'>
              <Paragraph margin='none'>
                Vagrant VM configuration
              </Paragraph>
            </Box>
          </Tile>
        </Tiles>
      </Box>
    </Box>
    );
  }
}

const mapDispatchToProps = dispatch => ({ dispatch });

module.exports = connect(mapDispatchToProps)(MainMenu);
