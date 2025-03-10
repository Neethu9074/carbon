/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Message, IconButton, Spacer } from '@instana/components';

import TagFilterValidation from 'in-alerting/smart-alerts/applications/tearSheet/components/TagFilterValidation/TagFilterValidation';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/eum/components/TearSheet/InvalidFilterMessage.mless';

export default function InvalidFilterMessage({
  isTagFilterFormModelValid,
  tagFilterExpression,
  thresholdType,
  form,
  updateForm,
  setStep,
  QueryBuilder
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
          onClick={() =>
            addActiveDialog(
              <TagFilterValidation
                form={form}
                close={close}
                QueryBuilder={QueryBuilder}
                updateForm={updateForm}
                setStep={setStep}
              />
            )
          }
        />
        <Spacer size="medium" />
      </div>
    )
  );
}
