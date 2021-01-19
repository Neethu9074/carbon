/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TwoFactorMarker.mless';

export default function TwoFactorMarker() {
  return (
    <Tooltip themeStyle="light" content="2FA is enabled for this user">
      <div className={locals.wrapper}>
        2FA
        <SvgIcon className={locals.icon} type="lib_check" size="s" />
      </div>
    </Tooltip>
  );
}
