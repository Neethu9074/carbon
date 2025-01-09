/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, CarbonPasswordInput as PasswordInput } from '@instana/components';

import { t } from 'in-i18n';

// Carbon does not export PasswordInput props
//@ts-expect-error
function ShowHideInputField(props) {
  const {
    tooltipHideLabel = t('in-settings:tabs.hidePasswordTooltip'),
    tooltipShowLabel = t('in-settings:tabs.showPasswordTooltip'),
    labelText,
    ...inputProps
  } = props;

  return (
    <Stack direction="horizontal" gap="small" align="center">
      <PasswordInput
        {...inputProps}
        hidePasswordLabel={tooltipHideLabel}
        showPasswordLabel={tooltipShowLabel}
        tooltipAlignment="end"
        tooltipPosition="right"
        labelText={labelText}
      />
    </Stack>
  );
}

export default ShowHideInputField;
