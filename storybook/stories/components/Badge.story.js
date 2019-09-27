import { storiesOf } from '@storybook/react';
import React from 'react';

import Badge from 'in-new-components/Badge/Badge';

export default {
  title: 'Components/Badge',
  component: Badge
};

storiesOf('Components/Badge', module)
  .addParameters({ component: Badge })
  .add('default', () => <Badge>bold</Badge>)
  .add('light', () => <Badge kind="light">light</Badge>)
  .add('inverted', () => <Badge kind="inverted">inverted</Badge>);
