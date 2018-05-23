import { storiesOf } from '@storybook/react';
import { just } from 'reactive-observables';
import React from 'react';

import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import Root from '../../_helpers/Root';

storiesOf('designLibrary/Components/EntityWithTypeAndIcon', module)
  .add('default', () => <Default />)
  .add('link', () => <Link />);

function Default() {
  return (
    <Root>
      <EntityWithTypeAndIcon label="My Service" type="Service" iconType="lib_application_service" />
    </Root>
  );
}

function Link() {
  return (
    <Root>
      <EntityWithTypeAndIcon href$={just('/')} label="My Service" type="Service" iconType="lib_application_service" />
    </Root>
  );
}
