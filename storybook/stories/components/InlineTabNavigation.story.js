import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';

import InlineTabNavigation from 'in-new-components/InlineTabNavigation/InlineTabNavigation';
import Root from '../_helpers/Root';

storiesOf('Components/InlineTabNavigation', module).add('default', () => <Default />);

const Default = () => {
  const [activeTabIndex, setTabIndex] = useState(0);

  const onTabSelect = i => setTabIndex(i);

  return (
    <Root>
      <InlineTabNavigation tabList={tabList} activeTabIndex={activeTabIndex} onTabSelect={onTabSelect} />
      <div style={{ padding: '1rem' }}>{tabList[activeTabIndex].text} View</div>
    </Root>
  );
};

const tabList = [
  {
    icon: 'lib_application_invert',
    text: 'Applications'
  },
  {
    icon: 'lib_infrastructure_inverted',
    text: 'Infrastructure'
  },
  {
    icon: 'lib_kubernetes_inverted',
    text: 'Kubernetes'
  }
];
