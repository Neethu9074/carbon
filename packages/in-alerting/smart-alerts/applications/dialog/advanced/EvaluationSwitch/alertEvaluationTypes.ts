/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { perEndpointAdaptiveBaselineEnabled } from 'in-services/featureFlags';
import { AlertEvaluationType } from 'in-types';
import { t } from 'in-i18n';

export const PER_AP: AlertEvaluationType = 'PER_AP';
export const PER_AP_SERVICE: AlertEvaluationType = 'PER_AP_SERVICE';
export const PER_AP_ENDPOINT: AlertEvaluationType = 'PER_AP_ENDPOINT';

export type Info = {
  selectionText: string;
  globalSelectionText: string;
  tearSheetSelectionText: string;
  tearSheetDescription: (count: number) => string;
  columnText: string;
  shortText: string;
  description: string;
  globalDescription: string;
  enabledForAdaptiveThreshold: boolean;
};

export type AlertEvaluationInfos = Readonly<Record<AlertEvaluationType, Info>>;

const alertEvaluationTypes: AlertEvaluationInfos = Object.freeze({
  [PER_AP]: {
    selectionText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAP.selectionText'
    ),
    globalSelectionText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAP.globalSelectionText'
    ),
    tearSheetSelectionText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAP.tearSheetSelectionText'
    ),
    tearSheetDescription: (count: number) =>
      t('in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAP.tearSheetDescription', {
        count: count
      }),
    enabledForAdaptiveThreshold: true,
    columnText: t('in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAP.columnText'),
    shortText: t('in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAP.shortText'),
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
    tearSheetSelectionText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPSERVICE.tearSheetSelectionText'
    ),
    tearSheetDescription: (count: number) =>
      t(
        'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPSERVICE.tearSheetDescription',
        {
          count: count
        }
      ),
    enabledForAdaptiveThreshold: true,
    columnText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPSERVICE.columnText'
    ),
    shortText: t('in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPSERVICE.shortText'),
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
    tearSheetSelectionText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPENDPOINT.tearSheetSelectionText'
    ),
    tearSheetDescription: (count: number) =>
      t(
        'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPENDPOINT.tearSheetDescription',
        {
          count: count
        }
      ),
    enabledForAdaptiveThreshold: perEndpointAdaptiveBaselineEnabled,
    columnText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPENDPOINT.columnText'
    ),
    shortText: t(
      'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.evaluationTypePERAPENDPOINT.shortText'
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
