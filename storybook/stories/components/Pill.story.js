import { storiesOf } from '@storybook/react';
import React from 'react';

import Pill from 'in-new-components/Pill';

storiesOf('Components/Pill', module)
  .addParameters({ component: Pill })
  .add('default', () => <Pill>bold</Pill>)
  .add('light', () => <Pill kind="light">light</Pill>)
  .add('lighter', () => <Pill kind="lighter">lighter</Pill>)
  .add('inverted', () => <Pill kind="inverted">inverted</Pill>);
