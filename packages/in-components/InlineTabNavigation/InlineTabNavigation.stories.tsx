/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import InlineTabNavigation from 'in-components/InlineTabNavigation';

export default {
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
