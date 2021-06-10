/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ButtonGroup from 'in-components/ButtonGroup';
import { t } from 'in-i18n';

export default function MapListToggle({ setView, view }) {
  return (
    <ButtonGroup
      segmented
      buttonPropsList={[
        {
          text: t('in-kubernetes:dashboards.table'),
          icon: 'lib_views_list',
          key: 'list',
          onClick: () => setView({ view: 'list' })
        },
        {
          text: t('in-kubernetes:dashboards.map'),
          icon: 'lib_views_grid',
          key: 'map',
          onClick: () => setView({ view: 'map' })
        }
      ]}
      activeKey={view}
    />
  );
}
