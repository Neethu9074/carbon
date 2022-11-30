/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import Input, { InputProps } from 'in-components/form/Input/Input';
import IconButton from 'in-components/IconButton/IconButton';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

import locals from './Password.mless';

export default function Password(inputProps: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={locals.password_wrapper}>
      <Input type={showPassword ? 'text' : 'password'} className={locals.input} {...inputProps} />
      <Tooltip
        content={
          showPassword
            ? t('in-components:password.hidePasswordTooltip')
            : t('in-components:password.showPasswordTooltip')
        }
      >
        <IconButton
          kind="info"
          type={showPassword ? 'lib_views_hide' : 'lib_views_show'}
          onClick={e => {
            e.preventDefault();
            setShowPassword(!showPassword);
          }}
          iconSize="xs"
          alignment="right"
          className={locals.icon_button}
        />
      </Tooltip>
    </div>
  );
}
