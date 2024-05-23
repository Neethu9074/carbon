/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Stack, IconButton } from '@instana/components';

import Input, { InputProps } from 'in-components/form/Input/Input';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

import locals from './ShowHideInputField.mless';

export interface ShowHideInputFieldProps extends InputProps {
  tooltipShowLabel?: string;
  tooltipHideLabel?: string;
}

function ShowHideInputField(props: ShowHideInputFieldProps) {
  const [showInput, setShowInput] = useState(false);

  const {
    tooltipHideLabel = t('in-settings:tabs.hidePasswordTooltip'),
    tooltipShowLabel = t('in-settings:tabs.showPasswordTooltip'),
    ...inputProps
  } = props;

  return (
    <Stack direction="horizontal" gap="small" align="center">
      <Input type={showInput ? 'text' : 'password'} className={locals.input} {...inputProps} />
      <Tooltip content={showInput ? tooltipHideLabel : tooltipShowLabel}>
        <IconButton
          kind="info"
          type={showInput ? 'lib_views_hide' : 'lib_views_show'}
          onClick={e => {
            e.preventDefault();
            setShowInput(!showInput);
          }}
          iconSize="xs"
          alignment="right"
        />
      </Tooltip>
    </Stack>
  );
}

export default ShowHideInputField;
