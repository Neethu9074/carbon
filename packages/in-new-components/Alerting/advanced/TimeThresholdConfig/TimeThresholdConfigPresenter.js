import PropTypes from 'prop-types';
import { get } from 'lodash';
import React from 'react';

import ConfigureAlertingThreshold from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureAlertingThreshold';
import { timeThresholdTypes } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/formData';
import SelectThreshold from 'in-new-components/Alerting/advanced/TimeThresholdConfig/SelectThreshold';
import TwoColumnContainer from 'in-new-components/Alerting/components/TwoColumnContainer';
import Link from 'in-components/Link';

export default function TimeThresholdConfigPresenter({
  form,
  onChange,
  uniqueUsersOrSessionsResult,
  updateForm,
  hasUserImpactOption
}) {
  return (
    <TwoColumnContainer
      moveMainAreaRight
      mainContentHeadline={getTitle(form.get('timeThreshold'))}
      mainContent={<ConfigureAlertingThreshold form={form} onChange={onChange} updateForm={updateForm} />}
      secondaryContent={
        <SelectThreshold form={form} updateForm={updateForm} hasUserImpactOption={hasUserImpactOption} />
      }
      warnMessage={
        uniqueUsersOrSessionsResult &&
        get(uniqueUsersOrSessionsResult, ['data', 'count', 0, 1]) === 0 && (
          <>
            No{' '}
            <Link external href="https://docs.instana.io/products/website_monitoring/api/#identifying-users">
              users
            </Link>{' '}
            or{' '}
            <Link external href="https://docs.instana.io/products/website_monitoring/api/#session-tracking">
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
  const { violationsInSequence, violationsInPeriod, userImpactOfViolationsInSequence } = timeThresholdTypes;
  const timeThresholdType = form.get('type').value;
  switch (timeThresholdType) {
    case violationsInSequence:
      return 'Persistence over time';
    case violationsInPeriod:
      return 'Number of violations over time';
    case userImpactOfViolationsInSequence:
      return 'User impact';
  }
}

TimeThresholdConfigPresenter.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  uniqueUsersOrSessionsResult: PropTypes.object,
  updateForm: PropTypes.func.isRequired,
  hasUserImpactOption: PropTypes.bool
};
