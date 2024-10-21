/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  teamSettingsAccessControlApiTokenDuplicate,
  teamSettingsAccessControlApiTokenEdit,
  teamSettingsAccessControlApiTokenNew,
  teamSettingsAccessControlApiTokens,
  teamSettingsAccessControlGroupEdit,
  teamSettingsAccessControlGroupNew,
  teamSettingsAccessControlGroups,
  teamSettingsAccessControlInvites,
  teamSettingsAccessControlUserEdit,
  teamSettingsAccessControlUsers,
  teamSettingsAudit,
  teamSettingsActionLog,
  teamSettingsAccessLog,
  teamSettingsActionLogRetention
} from 'in-settings/navigation/paths';
//@ts-expect-error not migrated to typescript yet
import GroupPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/Group';
//@ts-expect-error not migrated to typescript yet
import UserPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/User';
import ApiTokenFormDialog from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiTokenFormDialog';
import ApiTokensPage from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiTokens';
import InvitesPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/Invites';
import GroupsPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/Groups';
import UsersPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Users';
import AuditTrailPage from 'in-settings/tabs/TeamSettings/pages/audit/AuditTrail';
import { Role } from 'in-types';
import { t } from 'in-i18n';

export function getNavigationTreeForRole(role: Role, isAnyIDPActive: boolean) {
  const navigationTree = [];

  if (role.canConfigureUsers || role.canConfigureTeams || role.canConfigureApiTokens) {
    const accessControlPages = [];

    if (role.canConfigureUsers) {
      accessControlPages.push({
        path: teamSettingsAccessControlUsers,
        label: t('in-settings:tabs.users'),
        component: UsersPage,
        subPages: [
          {
            path: teamSettingsAccessControlUserEdit,
            component: UserPage
          }
        ]
      });
      if (!isAnyIDPActive) {
        accessControlPages.push({
          path: teamSettingsAccessControlInvites,
          label: t('in-settings:tabs.pendingInvitations'),
          component: InvitesPage
        });
      }
    }

    if (role.canConfigureTeams) {
      accessControlPages.push({
        path: teamSettingsAccessControlGroups,
        label: t('in-settings:tabs.groups'),
        component: GroupsPage,
        subPages: [
          {
            path: teamSettingsAccessControlGroupNew,
            component: GroupPage
          },
          {
            path: teamSettingsAccessControlGroupEdit,
            component: GroupPage
          }
        ]
      });
    }

    if (role.canConfigureApiTokens) {
      accessControlPages.push({
        path: teamSettingsAccessControlApiTokens,
        label: t('in-settings:tabs.apiTokens'),
        component: ApiTokensPage,
        subPages: [
          {
            path: teamSettingsAccessControlApiTokenEdit,
            component: ApiTokenFormDialog
          },
          {
            path: teamSettingsAccessControlApiTokenNew,
            component: ApiTokenFormDialog
          },
          {
            path: teamSettingsAccessControlApiTokenDuplicate,
            component: ApiTokenFormDialog
          }
        ]
      });
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
          path: teamSettingsAudit,
          label: t('in-settings:tabs.auditTrail'),
          component: AuditTrailPage,
          subPages: [
            {
              path: teamSettingsActionLog,
              component: AuditTrailPage
            },
            {
              path: teamSettingsActionLogRetention,
              component: AuditTrailPage
            },
            {
              path: teamSettingsAccessLog,
              component: AuditTrailPage
            }
          ]
        }
      ]
    });
  }

  return navigationTree;
}
