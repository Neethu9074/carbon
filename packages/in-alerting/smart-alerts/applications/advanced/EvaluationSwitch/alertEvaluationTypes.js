/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

export const PER_AP = 'PER_AP';
export const PER_AP_SERVICE = 'PER_AP_SERVICE';

const alertEvaluationTypes = {
  [PER_AP]: {
    selectionText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAP.selectionText'
    ),
    columnText: t('in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAP.columnText'),
    description: t('in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAP.description')
  },
  [PER_AP_SERVICE]: {
    selectionText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPSERVICE.description'
    ),
    columnText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPSERVICE.columnText'
    ),
    description: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPSERVICE.description'
    )
  }
};

export default alertEvaluationTypes;
