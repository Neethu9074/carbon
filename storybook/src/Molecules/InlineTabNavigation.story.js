import React from 'react';

import InlineTabNavigation from 'in-new-components/InlineTabNavigation';
import Card from 'in-new-components/Card';

export default {
  title: 'Molecules|InlineTabNavigation',
  component: Card
};

const tabList = [
  {
    icon: 'lib_application_invert',
    text: 'Applications',
    key: 'application'
  },
  {
    icon: 'lib_infrastructure_inverted',
    text: 'Infrastructure',
    key: 'infrastructure'
  },
  {
    icon: 'lib_kubernetes_inverted',
    text: 'Kubernetes',
    key: 'kubernetes'
  }
];

export const standard = () => <InlineTabNavigation tabList={tabList} activeTabIndex={0} />;
