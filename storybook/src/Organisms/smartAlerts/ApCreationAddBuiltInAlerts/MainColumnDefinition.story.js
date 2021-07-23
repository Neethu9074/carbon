/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MainColumn from 'in-alerting/smart-alerts/applications/apCreation/MainColumn';
import LabelText from 'in-alerting/smart-alerts/applications/apCreation/LabelText';
import { globalBuitInAlerts } from './mockData';

export default {
  title: 'Organisms|smartAlerts/apCreationAddBuiltInAlerts|MainColumn',
  component: MainColumn
};

export function mainColumnDefinition() {
  return <MainColumn name="Erroneous call rate for XYZ too high" {...globalBuitInAlerts[0]} />;
}

export function mainColumnDefinitionWithPartiallyApSelection() {
  return <MainColumn name="Erroneous call rate for ABC too high 2" {...globalBuitInAlerts[2]} />;
}

export function mainColumnDefinitionWithCustomLabel() {
  return (
    <MainColumn
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
