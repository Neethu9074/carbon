/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TagSet } from '@instana/ibm-products';
import { createLogger } from '@instana/logger';

import { ApiTeamRole as TeamRole } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { defaultRoleId } from 'in-stores/user';
import { t } from 'in-i18n';

interface RoleViewProps {
  roles: Array<TeamRole>;
}

const logger = createLogger('TeamRoleView');

const RoleView = ({ roles }: RoleViewProps) => {
  // Will be removed once backend API also returns role name besides id
  const getRoleName = (role: TeamRole & { roleName?: string }) => {
    logger.warn('Temporary function to be removed when user name and role name are available through team API');
    if (role.roleName) {
      return role.roleName;
    }
    if (role.roleId === defaultRoleId) {
      return 'Default';
    } else {
      return role.roleId;
    }
  };

  return (
    <TagSet
      allTagsModalTitle={t('in-settings:tabs.teams.assignedRoles')}
      overflowType="tag"
      tags={roles.map(role => {
        return { label: getRoleName(role), type: 'high-contrast' };
      })}
    />
  );
};

export default RoleView;
