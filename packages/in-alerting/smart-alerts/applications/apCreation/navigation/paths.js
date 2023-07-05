/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { alertCreated, alertId, alertsCategory } from 'in-applications/navigation/matrix';
// eslint-disable-next-line
import { getModifiedUrlStream } from 'in-stores/navigation';
import { categoryGlobal } from 'in-alerting/smart-alerts/components/list/constants';
import { alertsList, globalAlertDetails } from 'in-applications/navigation/paths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export function getLinkToAlertDetails({ created, id }) {
  // eslint-disable-next-line
  return getModifiedUrlStream(_location => {
    _location.pathname = globalAlertDetails;
    setOrDeleteMatrixKey(_location, alertsList, alertsCategory, categoryGlobal);
    setOrDeleteMatrixKey(_location, alertsList, alertCreated, created);
    setOrDeleteMatrixKey(_location, alertsList, alertId, id);
    return _location;
  });
}
