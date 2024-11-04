/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Message } from '@instana/components';

import { Trans } from 'in-i18n';

import locals from './ContributorFilterWarning.mless';

export const ContributorFilterWarning = () => {
  return (
    <Message type="warning" className={locals.warningMessage} inline small>
      <p>
        <Trans i18nKey="in-settings:permissionScope.contribution_filter_warning.firstParagraph" />
      </p>
      <Trans i18nKey="in-settings:permissionScope.contribution_filter_warning.secondParagraph" />
    </Message>
  );
};
