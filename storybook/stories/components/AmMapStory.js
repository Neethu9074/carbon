import { storiesOf } from '@storybook/react';
import React from 'react';

import WorldMap from 'in-new-components/WorldMap/WorldMap';
import Root from '../_helpers/Root';

storiesOf('Components/AmMapContainer', module)
  .add('world map', () => <WorldMapStory />)
  .add('world map with drill down', () => <WorldMapWithDrillDownStory />);

function WorldMapStory() {
  return (
    <Root>
      <WorldMap />
    </Root>
  );
}

function WorldMapWithDrillDownStory() {
  return (
    <Root>
      <WorldMap canDrillDown />
    </Root>
  );
}
