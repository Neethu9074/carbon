import { storiesOf } from '@storybook/react';
import React from 'react';

import HelpText from 'in-components/form/HelpText/HelpText';

import Root from '../../_helpers/Root';

storiesOf('Components/Product Notifications', module).add('Help Text', () => <Content />);

function Content() {
  return (
    <Root>
      <HelpText>This is an awesome help test component</HelpText>
    </Root>
  );
}
