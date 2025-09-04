/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { ButtonGroup } from '@instana/components';

import { useKubernetesTracker } from 'in-kubernetes/tracker';
import { t } from 'in-i18n';

export default function ControlPlaneTabs({ setView, view }: any) {
  const { k8sControlPlaneViewChange } = useKubernetesTracker();
  const handleOnClick = (tab: string) => {
    setView({ view: tab });
    k8sControlPlaneViewChange({
      tab,
      path: location.pathname
    });
  };

  const tabs = [
    {
      text: t('in-kubernetes:controlPlane.apiServer'),
      key: 'apiServer',
      onClick: () => handleOnClick('apiServer')
    },
    {
      text: t('in-kubernetes:controlPlane.scheduler'),
      key: 'scheduler',
      onClick: () => handleOnClick('scheduler')
    },
    {
      text: t('in-kubernetes:controlPlane.etcd'),
      key: 'etcd',
      onClick: () => handleOnClick('etcd')
    },
    {
      text: t('in-kubernetes:controlPlane.controllerManager'),
      key: 'controllerManager',
      onClick: () => handleOnClick('controllerManager')
    },
    {
      text: t('in-kubernetes:controlPlane.details'),
      key: 'details',
      onClick: () => handleOnClick('details')
    }
  ];

  return <ButtonGroup segmented buttonPropsList={tabs} activeKey={view} />;
}
