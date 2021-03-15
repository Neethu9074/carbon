/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './TwoFactorMarker.mless';

export default function TwoFactorMarker() {
  return (
    <Tooltip themeStyle="light" content={t('in-settings:tabs.2FaIsEnabledForThisUser')}>
      <div className={locals.wrapper}>
        {t('in-settings:tabs.2FA')}
        <SvgIcon className={locals.icon} type="lib_check" size="s" />
      </div>
    </Tooltip>
  );
}
