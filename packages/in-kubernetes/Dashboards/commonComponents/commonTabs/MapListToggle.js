/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ButtonGroup } from '@instana/components';

import { useKubernetesTracker } from 'in-kubernetes/tracker';
import { t } from 'in-i18n';

export default function MapListToggle({ setView, view }) {
  const { k8sPodViewChange } = useKubernetesTracker();

  return (
    <ButtonGroup
      segmented
      buttonPropsList={[
        {
          text: t('in-kubernetes:dashboards.table'),
          icon: 'lib_views_list',
          key: 'list',
          onClick: () => {
            setView({ view: 'list' });
            k8sPodViewChange({
              view: 'list',
              path: location.pathname
            });
          }
        },
        {
          text: t('in-kubernetes:dashboards.map'),
          icon: 'lib_views_grid',
          key: 'map',
          onClick: () => {
            setView({ view: 'map' });
            k8sPodViewChange({
              view: 'map',
              path: location.pathname
            });
          }
        }
      ]}
      activeKey={view}
    />
  );
}
