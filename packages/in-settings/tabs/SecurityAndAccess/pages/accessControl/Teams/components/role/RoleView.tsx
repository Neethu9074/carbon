/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import {
  CarbonContainedList,
  CarbonContainedListItem,
  CarbonPopover,
  CarbonPopoverContent,
  CarbonTag
} from '@instana/components';
import { createLogger } from '@instana/logger';

import { ApiTeamRole as TeamRole } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { t } from 'in-i18n';

import locals from './RoleView.mless';

interface RoleViewProps {
  roles: Array<TeamRole>;
}

const logger = createLogger('TeamRoleView');

const RoleView = ({ roles }: RoleViewProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Will be removed once backend API also returns role name besides id
  const getRoleName = (role: TeamRole & { roleName?: string }) => {
    logger.warn('Temporary function to be removed when user name and role name are available through team API');
    if (role.roleName) {
      return role.roleName;
    }
    if (role.roleId === '-1') {
      return 'Default';
    } else {
      return role.roleId;
    }
  };

  return (
    <CarbonPopover open={isOpen} caret={false}>
      <CarbonTag type="high-contrast" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        {roles?.length === 1 ? getRoleName(roles[0]) : t('in-settings:tabs.teams.rolesTag', { count: roles?.length })}
      </CarbonTag>
      <CarbonPopoverContent>
        <div>
          <CarbonContainedList label={t('in-settings:tabs.teams.assignedRoles')} size="md" isInset>
            {roles?.map(role => (
              <CarbonContainedListItem key={role.roleId} className={locals.listItem}>
                <span>{getRoleName(role)}</span>
              </CarbonContainedListItem>
            ))}
          </CarbonContainedList>
        </div>
      </CarbonPopoverContent>
    </CarbonPopover>
  );
};

export default RoleView;
