/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import { get } from 'lodash';
import React from 'react';

import { Link } from '@instana/components';

import ConfigureAlertingThreshold from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/ConfigureAlertingThreshold';
import SelectTimeThreshold from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/SelectTimeThreshold';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import TwoColumnContainer from 'in-alerting/smart-alerts/components/dialog/TwoColumnContainer';
import { Trans, t } from 'in-i18n';

const titleValues = {
  [timeThresholdTypes.violationsInSequence]: t(
    'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigTimeThresholdTitleViolationsInSequence'
  ),
  [timeThresholdTypes.violationsInPeriod]: t(
    'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigTimeThresholdTitleViolationsInPeriod'
  ),
  [timeThresholdTypes.userImpactOfViolationsInSequence]: t(
    'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigTimeThresholdTitleUserImpactOfViolationsInSequence'
  ),
  [timeThresholdTypes.traceImpact]: t(
    'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigTimeThresholdTitleTraceImpact'
  )
};

export default function TimeThresholdConfigPresenter({
  form,
  onChange,
  uniqueUsersOrSessionsResult,
  updateForm,
  hasTraceImpactOption,
  hasUserImpactOption,
  impactTimeThresholdDisabled
}) {
  return (
    <TwoColumnContainer
      moveMainAreaRight
      mainContentHeadline={getTitle(form.get('timeThreshold'))}
      mainContent={<ConfigureAlertingThreshold form={form} onChange={onChange} updateForm={updateForm} />}
      secondaryContent={
        <SelectTimeThreshold
          form={form}
          updateForm={updateForm}
          hasUserImpactOption={hasUserImpactOption}
          hasTraceImpactOption={hasTraceImpactOption}
          impactTimeThresholdDisabled={impactTimeThresholdDisabled}
        />
      }
      warnMessage={
        uniqueUsersOrSessionsResult &&
        get(uniqueUsersOrSessionsResult, ['data', 'count', 0, 1]) === 0 && (
          <>
            <Trans
              i18nKey="in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigNoUserSessionDetected"
              components={{
                linkToIdentifyingUsers: <Link external href="https://ibm.biz/api-identify-users" />,
                linkToSessionTracking: <Link external href="https://ibm.biz/session-tracking" />
              }}
            />
            <br />
            {t(
              'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigPleaseConfigureWebsiteMonitoringBeforeUsingThisOption'
            )}
          </>
        )
      }
      removePaddingSecondaryArea
    />
  );
}

function getTitle(form) {
  const timeThresholdType = form.get('type').value;
  return titleValues[timeThresholdType];
}

TimeThresholdConfigPresenter.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  uniqueUsersOrSessionsResult: PropTypes.object,
  updateForm: PropTypes.func.isRequired,
  hasTraceImpactOption: PropTypes.bool,
  hasUserImpactOption: PropTypes.bool,
  impactTimeThresholdDisabled: PropTypes.bool
};
