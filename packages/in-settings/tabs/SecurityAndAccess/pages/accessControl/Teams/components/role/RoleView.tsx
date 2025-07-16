/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TagSet } from '@instana/ibm-products';
import { TeamRole } from '@instana/types';

import { t } from 'in-i18n';

import locals from './RoleView.mless';

interface RoleViewProps {
  roles: Array<TeamRole>;
}

const RoleView = ({ roles }: RoleViewProps) => {
  return (
    <TagSet
      allTagsModalTitle={t('in-settings:tabs.teams.assignedRoles')}
      tags={roles.map(role => {
        return { label: role.roleName, type: 'high-contrast', size: 'sm', className: locals.roleTagSet };
      })}
    />
  );
};

export default RoleView;
