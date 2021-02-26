/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import InlineTabNavigation from 'in-new-components/InlineTabNavigation';

const tabList = [
  {
    icon: 'lib_website',
    text: t('in-settings:tabs.websites'),
    key: 'websites'
  },
  {
    icon: 'lib_website_mobile_app',
    text: t('in-settings:tabs.mobileApps'),
    key: 'mobileApps'
  },
  {
    icon: 'lib_application_invert',
    text: t('in-settings:tabs.applications'),
    key: 'application'
  },
  {
    icon: 'lib_kubernetes_inverted',
    text: t('in-settings:tabs.kubernetesCluster'),
    key: 'kubernetesClusters'
  },
  {
    icon: 'lib_kubernetes_inverted',
    text: t('in-settings:tabs.kubernetesNamespaces'),
    key: 'kubernetesNamespaces'
  },
  {
    icon: 'lib_infrastructure_inverted',
    text: t('in-settings:tabs.infrastructure'),
    key: 'infra'
  }
];

export default function Selectable({ activeTabIndex, onTabSelect }) {
  return <InlineTabNavigation tabList={tabList} activeTabIndex={activeTabIndex} onTabSelect={onTabSelect} />;
}
