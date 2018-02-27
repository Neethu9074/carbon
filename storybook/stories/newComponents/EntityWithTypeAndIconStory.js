import { storiesOf } from '@storybook/react';
import React from 'react';

import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import Root from '../_helpers/Root';

storiesOf('newComponents/EntityWithTypeAndIcon', module)
  .add('default', () => <Default />)
  .add('link', () => <Link />);

function Default() {
  return (
    <Root>
      <EntityWithTypeAndIcon label="My Service" type="Service" iconType="app_service" />
    </Root>
  );
}

function Link() {
  return (
    <Root>
      <EntityWithTypeAndIcon href="/" label="My Service" type="Service" iconType="app_service" />
    </Root>
  );
}
