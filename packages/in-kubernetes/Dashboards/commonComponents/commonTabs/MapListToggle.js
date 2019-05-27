import React from 'react';

import ButtonSegmentedControl from 'in-new-components/ButtonSegmentedControl';

export default function MapListToggle({ setView, view }) {
  return (
    <ButtonSegmentedControl
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
