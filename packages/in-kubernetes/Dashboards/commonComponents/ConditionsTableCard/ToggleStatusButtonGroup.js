/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ButtonGroup from 'in-new-components/ButtonGroup';

export default function ToggleStatusButtonGroup({ setSelectedStatus, selectedStatus }) {
  return (
    <ButtonGroup
      buttonPropsList={[
        {
          text: 'All Status',
          key: null,
          onClick: () => setSelectedStatus(null)
        },
        {
          text: 'True',
          key: 'true',
          onClick: () => setSelectedStatus('true')
        },
        {
          text: 'False',
          key: 'false',
          onClick: () => setSelectedStatus('false')
        },
        {
          text: 'Unknown',
          key: 'unknown',
          onClick: () => setSelectedStatus('unknown')
        }
      ]}
      activeKey={selectedStatus}
    />
  );
}
