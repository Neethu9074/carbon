/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link } from '@instana/components';
import { Action } from '@instana/types';

import { actionDetailsCopyPath } from 'in-automation/navigation/paths';
import { getEntityIdView } from 'in-settings/navigation/paths';
import { isAnsible } from 'in-automation/ActionCatalog/shared';
import IconButton from 'in-components/IconButton/IconButton';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

interface CopyActionLinkProps {
  action: Action;
}

export default function CopyActionLink({ action }: CopyActionLinkProps) {
  return (
    <Tooltip content={t('in-automation:ActionCatalog.duplicate')} delay={500}>
      <Link ellipsis href={isAnsible(action.type) ? undefined : getEntityIdView(actionDetailsCopyPath, action.id)}>
        <IconButton
          id={`copy_${action.id}`}
          disabled={isAnsible(action.type)}
          buttonType="button"
          kind="primaryv2"
          type={'lib_actions_copy'}
        />
      </Link>
    </Tooltip>
  );
}
