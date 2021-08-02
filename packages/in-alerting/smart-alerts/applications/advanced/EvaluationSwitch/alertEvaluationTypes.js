/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const PER_AP = 'PER_AP';
export const PER_AP_SERVICE = 'PER_AP_SERVICE';
export const PER_AP_ENDPOINT = 'PER_AP_ENDPOINT';

const alertEvaluationTypes = Object.freeze({
  [PER_AP]: {
    selectionText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAP.selectionText'
    ),
    globalSelectionText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAP.globalSelectionText'
    ),
    columnText: t('in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAP.columnText'),
    description: t('in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAP.description'),
    globalDescription: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAP.globalDescription'
    )
  },
  [PER_AP_SERVICE]: {
    selectionText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPSERVICE.selectionText'
    ),
    globalSelectionText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPSERVICE.globalSelectionText'
    ),
    columnText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPSERVICE.columnText'
    ),
    description: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPSERVICE.description'
    ),
    globalDescription: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPSERVICE.globalDescription'
    )
  },
  [PER_AP_ENDPOINT]: {
    selectionText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPENDPOINT.selectionText'
    ),
    globalSelectionText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPENDPOINT.globalSelectionText'
    ),
    columnText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPENDPOINT.columnText'
    ),
    description: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPENDPOINT.description'
    ),
    globalDescription: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPENDPOINT.globalDescription'
    )
  }
});

export default alertEvaluationTypes;
