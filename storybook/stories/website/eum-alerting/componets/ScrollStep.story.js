import { storiesOf } from '@storybook/react';
import React from 'react';

import ScrollStep from 'in-websites/eum-alerting/advanced/ScrollStep';

storiesOf('websites/eum-alerting/components/scrollStep', module)
  .addParameters({ component: ScrollStep })
  .add('Scroll step', () => (
    <ScrollStep title="Hello World">
      <div style={{ height: '500px' }}> Lorem ipsum </div>
    </ScrollStep>
  ));
