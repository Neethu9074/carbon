/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { categoryGlobal } from 'in-alerting/smart-alerts/applications/components/list/constants';
import { alertCreated, alertId, alertsCategory } from 'in-applications/navigation/matrix';
import { alertsList, globalAlertDetails } from 'in-applications/navigation/paths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation';

export function getLinkToAlertDetails({ created, id }) {
  return getModifiedUrlStream(_location => {
    _location.pathname = globalAlertDetails;
    setOrDeleteMatrixKey(_location, alertsList, alertsCategory, categoryGlobal);
    setOrDeleteMatrixKey(_location, alertsList, alertCreated, created);
    setOrDeleteMatrixKey(_location, alertsList, alertId, id);
    return _location;
  });
}
