/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ButtonGroup from 'in-new-components/ButtonGroup';

export default function MapListToggle({ setView, view }) {
  return (
    <ButtonGroup
      segmented
      buttonPropsList={[
        {
          text: 'Table',
          icon: 'lib_views_list',
          key: 'list',
          onClick: () => setView({ view: 'list' })
        },
        {
          text: 'Map',
          icon: 'lib_views_grid',
          key: 'map',
          onClick: () => setView({ view: 'map' })
        }
      ]}
      activeKey={view}
    />
  );
}
