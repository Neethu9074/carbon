/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Li, Message } from '@instana/components';
import { t } from '@instana/i18n-react';
import { Error } from '@instana/types';

import { isTechnicalError } from 'in-services/util/error';

interface Props {
  errors: Error[];
}

export default function LiErrorList({ errors }: Props) {
  return errors.map((error, i) => (
    <Li key={i}>
      <Message type="error" small fullInlineWidth>
        {getErrorMessage(error)}
      </Message>
    </Li>
  ));
}

export function getErrorMessage(err: Error): string {
  if (err.message?.includes('more than the maximum number of groups')) {
    return t('in-infrastructure:explore.errors.maximumNumberOfGroups');
  }

  if (err.message?.includes('more than the maximum number of members')) {
    return t('in-infrastructure:explore.errors.maximumNumberOfMembers');
  }

  if (isTechnicalError(err.code) && !__DEV__) {
    return t('in-components:error.erroneousResultPresenterMessage');
  }

  return t('in-infrastructure:explore.errors.generalError');
}
