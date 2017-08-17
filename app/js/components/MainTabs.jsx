import React from 'react';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Paragraph from 'grommet/components/Paragraph';

class MainTabs extends React.Component {
  render() {
    return (
      <Tabs justify={'start'}>
        <Tab title={'Config'}>
          <Paragraph>
            First contents
          </Paragraph>
          <input type={'text'}
            value={''}/>
        </Tab>
        <Tab title={'JSON'}>
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
