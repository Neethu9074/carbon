/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';
import { noop } from 'lodash';

import ConfigTabBuiltInSmartAlertsSelectionList from 'in-alerting/smart-alerts/applications/apCreation/ConfigTabBuiltInSmartAlertsSelectionList';
import DialogBuiltInSmartAlertsSelectionList from 'in-alerting/smart-alerts/applications/apCreation/DialogBuiltInSmartAlertsSelectionList';
import BuiltInSmartAlertsSelectionBaseList from 'in-alerting/smart-alerts/applications/apCreation/BuiltInSmartAlertsSelectionBaseList';
import { globalBuitInAlerts } from 'in-alerting/smart-alerts/applications/apCreation/stories/mockData';
import { successObservable } from 'in-services/util/result';

export default {
  component: BuiltInSmartAlertsSelectionBaseList
};

export function DialogList() {
  return (
    <DialogBuiltInSmartAlertsSelectionList
      getBuiltInAlerts={() => successObservable(globalBuitInAlerts)}
      onChange={noop}
    />
  );
}

export function ConfigList() {
  const [alertIds, setAlertIds] = useState(() => globalBuitInAlerts.map(({ id }) => id));

  return (
    <ConfigTabBuiltInSmartAlertsSelectionList
      getBuiltInAlerts={() => successObservable(globalBuitInAlerts)}
      alertIds={alertIds}
      onChange={setAlertIds}
    />
  );
}
