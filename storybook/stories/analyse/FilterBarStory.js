import { withKnobs, text, boolean } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import SelectBarOverlay from 'in-analyze/components/filterBar/SelectBarOverlay/SelectBarOverlay';
import BarOverlay from 'in-analyze/components/filterBar/BarOverlay/BarOverlay';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';

storiesOf('Analyse/FilterBar', module)
  .addDecorator(withKnobs)
  .add('Default', () => <Default />)
  .add('Overlay', () => <Overlay />)
  .add('SelectOverlay', () => <SelectBarOverlayStory />);


function Default() {
  return (
    <Bar onClearFilters={action('onClearFilters')}>
      <BarItem showArrow onClick={action('onBarItemClick')}>
        By Duration
      </BarItem>
      <BarItem showArrow active isOpen onClick={action('onBarItemClick')}>
        By Meta
      </BarItem>
      <BarItem onClick={action('onBarItemClick')}>
        Erroneous
      </BarItem>
      <BarItem active onClick={action('onBarItemClick')}>
        Synthetic
      </BarItem>
    </Bar>
  );
}

function Overlay() {
  return (
    <OverlayWrapper>
      <BarOverlay>
        {new Array(20).fill('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, enim, pariatur nihil delectus animi architecto modi harum eligendi nam neque. Commodi, velit, sed. Nulla vel, culpa quisquam vitae dolorem rerum.').map(v => <p>{v}</p>)}
      </BarOverlay>
    </OverlayWrapper>
  );
}

function OverlayWrapper({children}) {
  return (
    <div style={{
      background: '#eee',
      padding: '1rem'
    }}>
      {children}
    </div>
  );
}

function SelectBarOverlayStory() {
  return (
    <OverlayWrapper>
      <SelectBarOverlay query={text('Query', '')}
        loading={boolean('Loading?', false)}
        onQueryChange={action('onQueryChange')}
        selectedItem={boolean('With selected item?', true) && {key: 'b', label: 'England'}}
        items={boolean('With query matches?', true) ? [
          {key: 'a', label: 'Germany'},
          {key: 'b', label: 'England'},
          {key: 'c', label: 'United States'},
          {key: 'd', label: 'A super long label that cannot reasonably fit into the line without breaking the design'}
        ] : []}
        onSelectItem={action('onSelectItem')} />
    </OverlayWrapper>
  );
}
