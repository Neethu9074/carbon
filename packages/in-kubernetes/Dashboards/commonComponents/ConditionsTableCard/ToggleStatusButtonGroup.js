/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ButtonGroup from 'in-components/ButtonGroup';
import { t } from 'in-i18n';

export default function ToggleStatusButtonGroup({ setSelectedStatus, selectedStatus }) {
  return (
    <ButtonGroup
      buttonPropsList={[
        {
          text: t('in-kubernetes:dashboards.allStatus'),
          key: null,
          onClick: () => setSelectedStatus(null)
        },
        {
          text: t('in-kubernetes:dashboards.true'),
          key: 'true',
          onClick: () => setSelectedStatus('true')
        },
        {
          text: t('in-kubernetes:dashboards.false'),
          key: 'false',
          onClick: () => setSelectedStatus('false')
        },
        {
          text: t('in-kubernetes:dashboards.unknown'),
          key: 'unknown',
          onClick: () => setSelectedStatus('unknown')
        }
      ]}
      activeKey={selectedStatus}
    />
  );
}
