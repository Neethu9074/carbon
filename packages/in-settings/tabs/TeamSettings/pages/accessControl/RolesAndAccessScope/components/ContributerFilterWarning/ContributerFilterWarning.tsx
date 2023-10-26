/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Message } from '@instana/components';

import { Trans } from 'in-i18n';

import locals from './ContributerFilterWarning.mless';

export const ContributerFilterWarning = () => {
  return (
    <Message className={locals.message} type="warning" small>
      <Trans i18nKey="in-settings:permissionScope.contribution_filter_warning" />
    </Message>
  );
};
