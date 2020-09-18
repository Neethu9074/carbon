import React from 'react';

import InlineTabNavigation from 'in-new-components/InlineTabNavigation';

export default {
  title: 'Molecules/InlineTabNavigation',
  component: InlineTabNavigation
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
