/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useState } from 'react';
import { noop } from 'lodash';
import React from 'react';

import { just } from '@instana/observables';

import ConfigTabBuiltInSmartAlertsSelectionList from 'in-alerting/smart-alerts/applications/apCreation/ConfigTabBuiltInSmartAlertsSelectionList';
import DialogBuiltInSmartAlertsSelectionList from 'in-alerting/smart-alerts/applications/apCreation/DialogBuiltInSmartAlertsSelectionList';
import BuiltInSmartAlertsSelectionBaseList from 'in-alerting/smart-alerts/applications/apCreation/BuiltInSmartAlertsSelectionBaseList';
import { globalBuitInAlerts } from './mockData';

export default {
  title: 'Organisms|smartAlerts/apCreationAddBuiltInAlerts|BuiltInSmartAlertsSelectionBaseList',
  component: BuiltInSmartAlertsSelectionBaseList
};

export function DialogList() {
  return <DialogBuiltInSmartAlertsSelectionList getBuiltInAlerts={() => just(globalBuitInAlerts)} onChange={noop} />;
}

export function ConfigList() {
  const [alertIds, setAlertIds] = useState(() => globalBuitInAlerts.map(({ id }) => id));
  return (
    <ConfigTabBuiltInSmartAlertsSelectionList
      getBuiltInAlerts={() => just(globalBuitInAlerts)}
      alertIds={alertIds}
      onChange={setAlertIds}
    />
  );
}
