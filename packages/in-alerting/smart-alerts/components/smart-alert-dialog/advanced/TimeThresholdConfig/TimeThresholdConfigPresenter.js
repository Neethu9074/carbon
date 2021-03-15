/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import { get } from 'lodash';
import React from 'react';

import ConfigureAlertingThreshold from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/ConfigureAlertingThreshold';
import SelectTimeThreshold from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/SelectTimeThreshold';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/formData';
import TwoColumnContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/TwoColumnContainer';
import Link from 'in-components/Link';
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
  [timeThresholdTypes.requestImpact]: t(
    'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigTimeThresholdTitleRequestImpact'
  )
};

export default function TimeThresholdConfigPresenter({
  form,
  onChange,
  uniqueUsersOrSessionsResult,
  updateForm,
  hasRequestImpactOption,
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
          hasRequestImpactOption={hasRequestImpactOption}
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
                linkToIdentifyingUsers: (
                  <Link external href="https://instana.com/docs/website_monitoring/api/#identifying-users" />
                ),
                linkToSessionTracking: (
                  <Link external href="https://instana.com/docs/website_monitoring/api/#session-tracking" />
                )
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
  hasRequestImpactOption: PropTypes.bool,
  hasUserImpactOption: PropTypes.bool,
  impactTimeThresholdDisabled: PropTypes.bool
};
