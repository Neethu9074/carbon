import { withKnobs, number } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import Pagination from 'in-new-components/Pagination';
import Root from '../_helpers/Root';

storiesOf('newComponents/Pagination', module)
.addDecorator(withKnobs)
.add('default', () => <Default />);

function Default() {
  const page = number(
    'Page', 3, {
       range: true,
       min: 1,
       max: 7,
       step: 1
    }
  );
  return (
    <Root>
      <Pagination current={page} last={7} onChange={action('onChange')} />
    </Root>
  );
}
