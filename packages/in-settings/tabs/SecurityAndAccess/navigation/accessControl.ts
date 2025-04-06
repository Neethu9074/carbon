/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  securityAndAccessAccessControlApiTokenDuplicate,
  securityAndAccessAccessControlApiTokenEdit,
  securityAndAccessAccessControlApiTokenNew,
  securityAndAccessAccessControlApiTokens,
  securityAndAccessAccessControlGroupEdit,
  securityAndAccessAccessControlGroupNew,
  securityAndAccessAccessControlGroups,
  securityAndAccessAccessControlInvites,
  securityAndAccessAccessControlTeamEdit,
  securityAndAccessAccessControlTeamNew,
  securityAndAccessAccessControlTeams,
  securityAndAccessAccessControlRoles,
  securityAndAccessAccessControlUserEdit,
  securityAndAccessAccessControlUsers,
  securityAndAccessAccessLog,
  securityAndAccessActionLog,
  securityAndAccessActionLogRetention,
  securityAndAccessAudit
} from 'in-settings/navigation/paths';
//@ts-expect-error not migrated to typescript yet
import GroupPage from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/Group';
//@ts-expect-error not migrated to typescript yet
import UserPage from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Users/User';
import ApiTokenFormDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiTokenFormDialog';
import ApiTokensPage from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiTokens';
import TeamDetailsPage from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/TeamDetails';
import InvitesPage from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/Invites';
import InvitesV2 from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InvitesV2';
import UsersV2 from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Users/Users/UsersV2';
import GroupsPage from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/Groups';
import GroupsV2 from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/GroupsV2';
import TeamsPage from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/Teams';
import UsersPage from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Users/Users';
import AuditTrailPage from 'in-settings/tabs/SecurityAndAccess/pages/audit/AuditTrail';
import Roles from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles';
import { accessControlCarbonTable, rbacTeamsEnabled } from 'in-services/featureFlags';
import { ViewProps } from 'in-settings/tabs/SecurityAndAccess/View';
import { Role } from 'in-types';
import { t } from 'in-i18n';

interface NavigationTreePage {
  idx: string;
  path?: string;
  label?: string;
  component: React.ReactNode;
  subPages?: Array<NavigationTreePage>;
}

interface NavigationTreeItem {
  title: string;
  pages: Array<NavigationTreePage>;
}

interface GetNavigationTreeForRoleProps extends ViewProps {
  role?: Role;
}

export function getNavigationTreeForRole({ role, defaultLogin }: GetNavigationTreeForRoleProps) {
  const navigationTree: NavigationTreeItem[] = [];

  if (role?.canConfigureUsers || role?.canConfigureTeams || role?.canConfigureApiTokens) {
    const accessControlPages: NavigationTreePage[] = [];

    if (role.canConfigureUsers) {
      accessControlPages.push({
        idx: 'users-page',
        path: securityAndAccessAccessControlUsers,
        label: t('in-settings:tabs.users'),
        component: accessControlCarbonTable ? UsersV2 : UsersPage,
        subPages: [
          {
            idx: 'edit-user-page',
            path: securityAndAccessAccessControlUserEdit,
            component: UserPage
          }
        ]
      });
      if (defaultLogin) {
        accessControlPages.push({
          idx: 'invites-page',
          path: securityAndAccessAccessControlInvites,
          label: t('in-settings:tabs.pendingInvitations'),
          component: accessControlCarbonTable ? InvitesV2 : InvitesPage
        });
      }
    }

    if (rbacTeamsEnabled) {
      if (role.canConfigureTeams) {
        accessControlPages.push({
          idx: 'roles-page',
          path: securityAndAccessAccessControlRoles,
          label: t('in-settings:tabs.roles'),
          component: Roles,
          subPages: []
        });
      }
    }

    if (role.canConfigureTeams) {
      accessControlPages.push({
        idx: 'groups-page',
        path: securityAndAccessAccessControlGroups,
        label: t('in-settings:tabs.groups'),
        component: accessControlCarbonTable ? GroupsV2 : GroupsPage,
        subPages: [
          {
            idx: 'new-group-page',
            path: securityAndAccessAccessControlGroupNew,
            component: GroupPage
          },
          {
            idx: 'edit-group-page',
            path: securityAndAccessAccessControlGroupEdit,
            component: GroupPage
          }
        ]
      });
    }

    if (role.canConfigureApiTokens) {
      accessControlPages.push({
        idx: 'api-token-page',
        path: securityAndAccessAccessControlApiTokens,
        label: t('in-settings:tabs.apiTokens'),
        component: ApiTokensPage,
        subPages: [
          {
            idx: 'edit-api-token-page',
            path: securityAndAccessAccessControlApiTokenEdit,
            component: ApiTokenFormDialog
          },
          {
            idx: 'new-api-token-page',
            path: securityAndAccessAccessControlApiTokenNew,
            component: ApiTokenFormDialog
          },
          {
            idx: 'clone-api-token-page',
            path: securityAndAccessAccessControlApiTokenDuplicate,
            component: ApiTokenFormDialog
          }
        ]
      });
    }

    if (rbacTeamsEnabled) {
      if (role.canConfigureTeams) {
        accessControlPages.push({
          idx: 'teams-page',
          path: securityAndAccessAccessControlTeams,
          label: t('in-settings:tabs.teams.teamsTitle'),
          component: TeamsPage,
          subPages: [
            {
              idx: 'new-team-page',
              path: securityAndAccessAccessControlTeamNew,
              component: TeamsPage
            },
            {
              idx: 'edit-team-page',
              path: securityAndAccessAccessControlTeamEdit,
              component: TeamDetailsPage
            }
          ]
        });
      }
    }

    navigationTree.push({
      title: t('in-settings:tabs.accessControl'),
      pages: accessControlPages
    });
  }

  if (role?.canViewAuditLog) {
    navigationTree.push({
      title: t('in-settings:tabs.audit'),
      pages: [
        {
          idx: 'audit-page',
          path: securityAndAccessAudit,
          label: t('in-settings:tabs.auditTrail'),
          component: AuditTrailPage,
          subPages: [
            {
              idx: 'audit-action-log-page',
              path: securityAndAccessActionLog,
              component: AuditTrailPage
            },
            {
              idx: 'audit-action-log-retention-page',
              path: securityAndAccessActionLogRetention,
              component: AuditTrailPage
            },
            {
              idx: 'audit-access-log-page',
              path: securityAndAccessAccessLog,
              component: AuditTrailPage
            }
          ]
        }
      ]
    });
  }

  return navigationTree;
}
