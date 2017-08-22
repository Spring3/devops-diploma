import React from 'react';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';

import CaretLeft from 'grommet/components/icons/base/CaretBack';

class ImagesPage extends React.Component {

  constructor(props) {
    super(props);
    this.imageSelected = this.imageSelected.bind(this);
  }

  imageSelected(item) {
    console.log(item);
  }

  render() {
    return (
      <Box direction='row'>
        <Box justify='start' align='end' alignContent='end' flex={false} full={false}>
          <Button
            icon={<CaretLeft/>}
            onClick={this.props.history.goBack}
            className='notPadded'
          />
        </Box>
        <Box justify='center' full='horizontal' align='center' pad='none' margin={{vertical: 'small', horizontal: 'none'}} direction='row'>
          <Table responsive={false}
            selectable={true}
            scrollable={true}
            onSelect={this.imageSelected}>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <TableRow>
                <td>1</td>
                <td>Alan</td>
                <td className='secondary'>plays accordion</td>
              </TableRow>
              <TableRow>
                <td>2</td>
                <td>Chris</td>
                <td className='secondary'>drops the mic</td>
              </TableRow>
              <TableRow>
                <td>3</td>
                <td>Eric</td>
                <td className='secondary'>rides a bike</td>
              </TableRow>
              <TableRow>
                <td>4</td>
                <td>Tracy</td>
                <td className='secondary'>travels the world</td>
              </TableRow>
            </tbody>
          </Table>
        </Box>
      </Box>
    );
  }
}

module.exports = ImagesPage;
