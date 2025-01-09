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
  securityAndAccessAccessControlUserEdit,
  securityAndAccessAccessControlUsers,
  securityAndAccessAudit,
  securityAndAccessActionLog,
  securityAndAccessAccessLog,
  securityAndAccessActionLogRetention
} from 'in-settings/navigation/paths';
//@ts-expect-error not migrated to typescript yet
import GroupPage from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/Group';
//@ts-expect-error not migrated to typescript yet
import UserPage from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Users/User';
import ApiTokenFormDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiTokenFormDialog';
import ApiTokensPage from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiTokens';
import InvitesPage from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/Invites';
import UsersV2 from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Users/Users/UsersV2';
import GroupsPage from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/Groups';
import UsersPage from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Users/Users';
import AuditTrailPage from 'in-settings/tabs/SecurityAndAccess/pages/audit/AuditTrail';
import { accessControlCarbonTable, rbacTeamsEnabled } from 'in-services/featureFlags';
import { Role } from 'in-types';
import { t } from 'in-i18n';

export function getNavigationTreeForRole(role: Role, isAnyIDPActive: boolean) {
  const navigationTree = [];

  if (role.canConfigureUsers || role.canConfigureTeams || role.canConfigureApiTokens) {
    const accessControlPages = [];

    if (role.canConfigureUsers) {
      accessControlPages.push({
        path: securityAndAccessAccessControlUsers,
        label: t('in-settings:tabs.users'),
        component: accessControlCarbonTable ? UsersV2 : UsersPage,
        subPages: [
          {
            path: securityAndAccessAccessControlUserEdit,
            component: UserPage
          }
        ]
      });
      if (!isAnyIDPActive) {
        accessControlPages.push({
          path: securityAndAccessAccessControlInvites,
          label: t('in-settings:tabs.pendingInvitations'),
          component: InvitesPage
        });
      }
    }

    if (rbacTeamsEnabled) {
      if (role.canConfigureTeams) {
        accessControlPages.push({
          path: securityAndAccessAccessControlGroups,
          label: t('in-settings:tabs.roles'),
          component: GroupsPage,
          subPages: [
            {
              path: securityAndAccessAccessControlGroupNew,
              component: GroupPage
            },
            {
              path: securityAndAccessAccessControlGroupEdit,
              component: GroupPage
            }
          ]
        });
      }
    } else {
      if (role.canConfigureTeams) {
        accessControlPages.push({
          path: securityAndAccessAccessControlGroups,
          label: t('in-settings:tabs.groups'),
          component: GroupsPage,
          subPages: [
            {
              path: securityAndAccessAccessControlGroupNew,
              component: GroupPage
            },
            {
              path: securityAndAccessAccessControlGroupEdit,
              component: GroupPage
            }
          ]
        });
      }
    }

    if (role.canConfigureApiTokens) {
      accessControlPages.push({
        path: securityAndAccessAccessControlApiTokens,
        label: t('in-settings:tabs.apiTokens'),
        component: ApiTokensPage,
        subPages: [
          {
            path: securityAndAccessAccessControlApiTokenEdit,
            component: ApiTokenFormDialog
          },
          {
            path: securityAndAccessAccessControlApiTokenNew,
            component: ApiTokenFormDialog
          },
          {
            path: securityAndAccessAccessControlApiTokenDuplicate,
            component: ApiTokenFormDialog
          }
        ]
      });
    }

    if (rbacTeamsEnabled) {
      if (role.canConfigureTeams) {
        accessControlPages.push({
          path: securityAndAccessAccessControlGroups,
          label: t('in-settings:tabs.teams'),
          component: GroupsPage,
          subPages: [
            {
              path: securityAndAccessAccessControlGroupNew,
              component: GroupPage
            },
            {
              path: securityAndAccessAccessControlGroupEdit,
              component: GroupPage
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

  if (role.canViewAuditLog) {
    navigationTree.push({
      title: t('in-settings:tabs.audit'),
      pages: [
        {
          path: securityAndAccessAudit,
          label: t('in-settings:tabs.auditTrail'),
          component: AuditTrailPage,
          subPages: [
            {
              path: securityAndAccessActionLog,
              component: AuditTrailPage
            },
            {
              path: securityAndAccessActionLogRetention,
              component: AuditTrailPage
            },
            {
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
