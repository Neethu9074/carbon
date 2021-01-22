/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import { Trans, t } from 'in-i18n';
import { get } from 'lodash';
import React from 'react';

import ConfigureAlertingThreshold from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureAlertingThreshold';
import SelectTimeThreshold from 'in-new-components/Alerting/advanced/TimeThresholdConfig/SelectTimeThreshold';
import { timeThresholdTypes } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/formData';
import TwoColumnContainer from 'in-new-components/Alerting/components/TwoColumnContainer';
import Link from 'in-components/Link';

const titleValues = {
  [timeThresholdTypes.violationsInSequence]: t(
    'in-new-components:alerting.advanced.timeThresholdConfigTimeThresholdTitleViolationsInSequence'
  ),
  [timeThresholdTypes.violationsInPeriod]: t(
    'in-new-components:alerting.advanced.timeThresholdConfigTimeThresholdTitleViolationsInPeriod'
  ),
  [timeThresholdTypes.userImpactOfViolationsInSequence]: t(
    'in-new-components:alerting.advanced.timeThresholdConfigTimeThresholdTitleUserImpactOfViolationsInSequence'
  ),
  [timeThresholdTypes.requestImpact]: t(
    'in-new-components:alerting.advanced.timeThresholdConfigTimeThresholdTitleRequestImpact'
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
              i18nKey="in-new-components:alerting.advanced.timeThresholdConfigNoUserSessionDetected"
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
              'in-new-components:alerting.advanced.timeThresholdConfigPleaseConfigureWebsiteMonitoringBeforeUsingThisOption'
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
