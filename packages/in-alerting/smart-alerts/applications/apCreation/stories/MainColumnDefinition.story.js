/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { globalBuitInAlerts } from 'in-alerting/smart-alerts/applications/apCreation/stories/mockData';
import MainColumn from 'in-alerting/smart-alerts/applications/apCreation/MainColumn';
import LabelText from 'in-alerting/smart-alerts/applications/apCreation/LabelText';

export default {
  component: MainColumn,
  argTypes: {
    onItemSelect: { action: 'onItemSelect' }
  }
};

export const MainColumnDefinition = (...args) => {
  return <MainColumn {...args} name="Erroneous call rate for XYZ too high" {...globalBuitInAlerts[0]} />;
};

export function MainColumnDefinitionWithPartiallyApSelection(...args) {
  return <MainColumn {...args} name="Erroneous call rate for ABC too high 2" {...globalBuitInAlerts[2]} />;
}

export function MainColumnDefinitionWithCustomLabel(...args) {
  return (
    <MainColumn
      {...args}
      name="Erroneous call rate for XYZ too high"
      customLabel={() => (
        <div>
          <LabelText>Label</LabelText>
          <LabelText asSubText>Sub Label</LabelText>
        </div>
      )}
      {...globalBuitInAlerts[0]}
    />
  );
}
