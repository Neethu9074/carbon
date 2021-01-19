/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import InlineTabNavigation from 'in-new-components/InlineTabNavigation';

const tabList = [
  {
    icon: 'lib_website',
    text: 'Websites',
    key: 'websites'
  },
  {
    icon: 'lib_website_mobile_app',
    text: 'Mobile Apps',
    key: 'mobileApps'
  },
  {
    icon: 'lib_application_invert',
    text: 'Applications',
    key: 'application'
  },
  {
    icon: 'lib_kubernetes_inverted',
    text: 'Kubernetes Cluster',
    key: 'kubernetesClusters'
  },
  {
    icon: 'lib_kubernetes_inverted',
    text: 'Kubernetes Namespaces',
    key: 'kubernetesNamespaces'
  },
  {
    icon: 'lib_infrastructure_inverted',
    text: 'Infrastructure',
    key: 'infra'
  }
];

export default function Selectable({ activeTabIndex, onTabSelect }) {
  return <InlineTabNavigation tabList={tabList} activeTabIndex={activeTabIndex} onTabSelect={onTabSelect} />;
}
