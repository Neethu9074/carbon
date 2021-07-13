/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import alertEvaluationTypes, {
  PER_AP
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { t } from 'in-i18n';

import locals from './ListColumns.mless';

export default function EvaluationTypeColumn({ config, isGlobalSmartAlertConfig }) {
  const { evaluationType = PER_AP } = config;
  const evaluationInfo = alertEvaluationTypes[evaluationType];
  return (
    <div className={locals.column}>
      <div className={locals.name}>
        {isGlobalSmartAlertConfig
          ? t('in-alerting:smartAlerts.globalApplicationSmartAlert')
          : t('in-alerting:smartAlerts.applicationSmartAlert')}
      </div>
      {evaluationInfo && <div className={locals.nameSubtext}>{evaluationInfo.columnText}</div>}
    </div>
  );
}

EvaluationTypeColumn.propTypes = {
  config: PropTypes.shape({
    evaluationType: PropTypes.string.isRequired
  }).isRequired,
  isGlobalSmartAlertConfig: PropTypes.bool
};
