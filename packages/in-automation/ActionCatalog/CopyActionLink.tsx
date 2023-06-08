/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Action } from '@instana/types';
import { Link } from '@instana/legacy';

import { actionDetailsCopyPath } from 'in-automation/navigation/paths';
import { getEntityIdView } from 'in-settings/navigation/paths';
import IconButton from 'in-components/IconButton/IconButton';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

interface CopyActionLinkProps {
  action: Action;
}

export default function CopyActionLink({ action }: CopyActionLinkProps) {
  return (
    <Tooltip content={t('in-automation:ActionCatalog.duplicate')} delay={500}>
      <Link ellipsis href$={getEntityIdView(actionDetailsCopyPath, action.id)}>
        <IconButton buttonType="button" kind="primaryv2" type={'lib_actions_copy'} />
      </Link>
    </Tooltip>
  );
}
