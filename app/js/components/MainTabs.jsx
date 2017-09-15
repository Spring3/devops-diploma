import React from 'react';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Box from 'grommet/components/Box';
import Paragraph from 'grommet/components/Paragraph';
import ImageBuildTab from './ImageBuildTab';

class MainTabs extends React.Component {

  render() {
    return (
      <Tabs justify={'start'}>
        <Tab title={'Image'}>
          <ImageBuildTab/>
        </Tab>
        <Tab title={'Container'}>
          <Paragraph>
            Second contents
          </Paragraph>
          <input type={'text'}
            value={''}/>
        </Tab>
        <Tab title={'CLI'}>
          <Paragraph>
            Second contents
          </Paragraph>
          <input type={'text'}
            value={''}/>
        </Tab>
      </Tabs>
    );
  }
}

module.exports = MainTabs;
