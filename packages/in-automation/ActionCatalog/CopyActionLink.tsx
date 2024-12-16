/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link, IconButton } from '@instana/components';
import { Action } from '@instana/types';

import useHrefToActionDetails from 'in-automation/navigation/hooks/useHrefToActionDetails';
import { ACTION_TYPE } from 'in-automation/constants';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

interface CopyActionLinkProps {
  action: Action;
}

export default function CopyActionLink({ action }: CopyActionLinkProps) {
  const hrefToActionDetails = useHrefToActionDetails();
  return (
    <Tooltip content={t('in-automation:duplicate')} delay={500}>
      <Link ellipsis href={action.type === ACTION_TYPE.ANSIBLE ? undefined : hrefToActionDetails(action.id, true)}>
        <IconButton
          id={`copy_${action.id}`}
          disabled={action.type === ACTION_TYPE.ANSIBLE}
          buttonType="button"
          kind="primaryv2"
          type={'lib_actions_copy'}
        />
      </Link>
    </Tooltip>
  );
}
