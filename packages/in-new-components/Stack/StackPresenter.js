import React, { useState } from 'react';

import InlineTabNavigation from 'in-new-components/InlineTabNavigation';
import StackPane from 'in-new-components/Stack/components/StackPane';

export default function StackPresenter({ stack }) {
  const [activeTabIndex, setTabIndex] = useState(0);

  const onTabSelect = i => setTabIndex(i);
  const { key } = tabList[activeTabIndex];

  return (
    <>
      <InlineTabNavigation tabList={tabList} activeTabIndex={activeTabIndex} onTabSelect={onTabSelect} />
      <StackPane groups={stack[key].groups} />
    </>
  );
}

const tabList = [
  // {
  //   icon: 'lib_application_invert',
  //   text: 'Applications',
  //   key: 'application'
  // },
  {
    icon: 'lib_infrastructure_inverted',
    text: 'Infrastructure',
    key: 'infrastructure'
  }
  // {
  //   icon: 'lib_kubernetes_inverted',
  //   text: 'Kubernetes',
  //   key: 'kubernetes'
  // }
];
