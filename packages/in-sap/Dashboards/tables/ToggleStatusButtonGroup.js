/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ButtonGroup } from '@instana/components';

import { t } from 'in-i18n';

export default function ToggleStatusButtonGroup({ setSelectedStatus, selectedStatus }) {
  return (
    <ButtonGroup
      buttonPropsList={[
        {
          text: t('in-sap:dashboards.allStatus'),
          key: null,
          onClick: () => setSelectedStatus(null)
        },
        {
          text: t('in-sap:dashboards.1XX'),
          key: '1',
          onClick: () => setSelectedStatus('1')
        },
        {
          text: t('in-sap:dashboards.2XX'),
          key: '2',
          onClick: () => setSelectedStatus('2')
        },
        {
          text: t('in-sap:dashboards.3XX'),
          key: '3',
          onClick: () => setSelectedStatus('3')
        },
        {
          text: t('in-sap:dashboards.4XX'),
          key: '4',
          onClick: () => setSelectedStatus('4')
        },
        {
          text: t('in-sap:dashboards.5XX'),
          key: '5',
          onClick: () => setSelectedStatus('5')
        },
        {
          text: t('in-sap:dashboards.6XX'),
          key: '6',
          onClick: () => setSelectedStatus('6')
        }
      ]}
      activeKey={selectedStatus}
    />
  );
}
