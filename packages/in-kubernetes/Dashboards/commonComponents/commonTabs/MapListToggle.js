import React from 'react';

import Button from 'in-new-components/Button';

export default function MapListToggle({ setView, view }) {
  return (
    <div>
      <Button
        icon="lib_views_grid"
        kind={view === 'map' ? 'primaryv2' : 'secondary'}
        onClick={() => setView({ view: 'map' })}
      >
        Treemap
      </Button>
      <Button
        icon="lib_views_list"
        kind={view === 'list' ? 'primaryv2' : 'secondary'}
        onClick={() => setView({ view: 'list' })}
      >
        Table
      </Button>
    </div>
  );
}
