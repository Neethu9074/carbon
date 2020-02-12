import React from 'react';

import ScrollStep from 'in-new-components/ScrollStep';

export default {
  title: 'Templates|website/eum-alerting/components/ScrollStep',
  component: ScrollStep
};

export const scrollStep = () => (
  <ScrollStep title="Hello World">
    <div style={{ height: '500px' }}> Lorem ipsum </div>
  </ScrollStep>
);
