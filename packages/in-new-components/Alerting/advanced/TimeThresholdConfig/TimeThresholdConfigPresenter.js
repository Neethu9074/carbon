import PropTypes from 'prop-types';
import { get } from 'lodash';
import React from 'react';

import ConfigureAlertingThreshold from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureAlertingThreshold';
import SelectTimeThreshold from 'in-new-components/Alerting/advanced/TimeThresholdConfig/SelectTimeThreshold';
import { timeThresholdTypes } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/formData';
import TwoColumnContainer from 'in-new-components/Alerting/components/TwoColumnContainer';
import Link from 'in-components/Link';

const titleValues = {
  [timeThresholdTypes.violationsInSequence]: 'Persistence over time',
  [timeThresholdTypes.violationsInPeriod]: 'Number of violations over time',
  [timeThresholdTypes.userImpactOfViolationsInSequence]: 'User impact',
  [timeThresholdTypes.requestImpact]: 'Request impact'
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
            No{' '}
            <Link external href="https://instana.com/docs/website_monitoring/api/#identifying-users">
              users
            </Link>{' '}
            or{' '}
            <Link external href="https://instana.com/docs/website_monitoring/api/#session-tracking">
              sessions
            </Link>{' '}
            detected. <br />
            Please configure website monitoring before using this option.
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
