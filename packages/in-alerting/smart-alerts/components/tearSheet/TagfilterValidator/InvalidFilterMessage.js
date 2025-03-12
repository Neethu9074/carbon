/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Message, IconButton, Spacer } from '@instana/components';

import { triggerScrollToInvalidItem$ } from 'in-alerting/smart-alerts/components/tearSheet/hooks/useScrollToFirstInvalidItem';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/tearSheet/TagfilterValidator/InvalidFilterMessage.mless';

export default function InvalidFilterMessage({
  isTagFilterFormModelValid,
  tagFilterExpression,
  thresholdType,
  setStep
}) {
  return (
    isTagFilterFormModelValid === false &&
    tagFilterExpression &&
    thresholdType === ADAPTIVE_BASELINE && (
      <div className={locals.filterSection}>
        <Message
          type="warning"
          inline
          fullInlineWidth
          title={t('in-alerting:smartAlerts.applications.tearSheet.invalidFilters')}
          description={t('in-alerting:smartAlerts.applications.tearSheet.invalidFilterWarning')}
        />
        <IconButton
          alignment="right"
          kind="tertiary"
          type="lib_actions_edit"
          onClick={() => goToStep(setStep, 1, close)}
        />
        <Spacer size="medium" />
      </div>
    )
  );
}

function goToStep(setStep, step, close) {
  triggerScrollToInvalidItem$.emit(true);
  setStep(step);
  close();
}
