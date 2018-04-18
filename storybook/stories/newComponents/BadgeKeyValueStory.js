import { storiesOf } from '@storybook/react';
import React from 'react';

import BadgeKeyValue from 'in-new-components/BadgeKeyValue';
import Root from '../_helpers/Root';

const marginStyle = { marginRight: '2px' };

storiesOf('newComponents/BadgeKeyValue', module)
  .add('sizes', () => <Sizes />)
  .add('colors', () => <Colors />);

function Sizes() {
  return (
    <Root>

      <h2>Size <code>mid</code></h2>
      <p>
      <BadgeKeyValue label="key label" value="value" style={ marginStyle } />
      <BadgeKeyValue labelBackground="#FF6B4A" label="key label" value="red" style={ marginStyle } />
      <BadgeKeyValue labelBackground="#3FB39A" label="key label" value="green" style={ marginStyle } />
      <BadgeKeyValue
        labelBackground="#1664D6"
        label="key label"
        value="blue"
        labelColor="white"
        style={ marginStyle }
      />
      </p>

      <h2>Size <code>small</code></h2>
      <p>
      <BadgeKeyValue size="sm" label="key label" value="value" style={ marginStyle } />
      <BadgeKeyValue labelBackground="#FF6B4A" size="sm" label="key label" value="red" style={ marginStyle } />
      <BadgeKeyValue labelBackground="#3FB39A" size="sm" label="key label" value="green" style={ marginStyle } />
      <BadgeKeyValue
        labelBackground="#1664D6"
        size="sm"
        label="key label"
        value="blue"
        labelColor="white"
        style={ marginStyle }
      />
      </p>

    </Root>
  );
}

function Colors() {

  return (
    <Root>

      <h2>Colors</h2>
      <p>
        <BadgeKeyValue
          label="much wow"
          value="green"
          labelBackground="#555"
          labelColor="white"
          valueBackground="#0d0"
          valueColor="#eee"
        />
      </p>
      <p>
        <BadgeKeyValue
          label="so color"
          value="amazing"
          labelBackground="green"
          labelColor="#eee"
          labelBorderColor="pink"
          valueBackground="orange"
          valueColor="black"
          valueBorderColor="turquoise"
        />
      </p>

      <h3>Configurable</h3>
      <ul>
        <li>labelBackground</li>
        <li>labelColor</li>
        <li>labelBorderColor</li>
        <li>valueBackground</li>
        <li>valueColor</li>
        <li>valueBorderColor</li>
      </ul>

    </Root>
  );
}
