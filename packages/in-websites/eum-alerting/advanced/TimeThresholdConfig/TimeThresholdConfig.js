import PropTypes from 'prop-types';
import React from 'react';

import ConfigureAlertingThreshold from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/ConfigureAlertingThreshold';
import SelectThreshold from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/SelectThreshold';
import { fieldNames, radioOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import TwoColumnContainer from 'in-websites/eum-alerting/advanced/components/TwoColumnContainer';

export default function TimeThresholdConfig({ form, onChange }) {
  return (
    <TwoColumnContainer
      moveMainAreaRight
      mainContentHeadline={getTitle(form)}
      mainContent={<ConfigureAlertingThreshold form={form} onChange={onChange} />}
      secondaryContent={<SelectThreshold form={form} onChange={onChange} />}
      removePaddingSecondaryArea
    />
  );
}

function getTitle(form) {
  const { violationsInSequence, violationsInPeriod, userImpactOfViolationsInSequence } = radioOptions.timeThresholdType;
  const timeThresholdType = form.get(fieldNames.timeThresholdType).value;
  switch (timeThresholdType) {
    case violationsInSequence:
      return 'Persistence over time';
    case violationsInPeriod:
      return 'Number of violations over time';
    case userImpactOfViolationsInSequence:
      return 'User impact';
  }
}

TimeThresholdConfig.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
