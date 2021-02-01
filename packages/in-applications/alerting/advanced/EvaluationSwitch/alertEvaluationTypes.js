/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

export const PER_AP = 'PER_AP';
export const PER_AP_SERVICE = 'PER_AP_SERVICE';

const alertEvaluationTypes = {
  [PER_AP]: {
    selectionText: t('in-applications:alert.evaluationTypePERAP.selectionText'),
    columnText: t('in-applications:alert.evaluationTypePERAP.columnText'),
    description: t('in-applications:alert.evaluationTypePERAP.description')
  },
  [PER_AP_SERVICE]: {
    selectionText: t('in-applications:alert.evaluationTypePERAPSERVICE.description'),
    columnText: t('in-applications:alert.evaluationTypePERAPSERVICE.columnText'),
    description: t('in-applications:alert.evaluationTypePERAPSERVICE.description')
  }
};

export default alertEvaluationTypes;
