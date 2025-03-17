/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';
import React from 'react';

import {
  CarbonButton,
  CarbonContainedList,
  CarbonContainedListItem,
  CarbonInlineLoading,
  Link,
  Typography
} from '@instana/components';
import { ProductiveCard } from '@instana/ibm-products';
import { UserResult } from '@instana/types';

//@ts-expect-error not a typescript component yet
import { AddUserDialog } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/AddUserButton';
import { AssignRoleDialog } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/AssignRoleDialog';
import RoleView from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/RoleView';
import { getEntityIdView, securityAndAccessAccessControlUsers } from 'in-settings/navigation/paths';
import { ApiTeam, ApiTeamMember } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { Trans, t } from 'in-i18n';

import locals from './TeamMember.mless';

interface TeamMemberProps {
  isLoading: boolean;
  team: ApiTeam;
  setTeamData: (team: Partial<ApiTeam>) => void;
  saveTeam: (data: ApiTeam) => void;
}

const TeamMember = ({ isLoading, team, setTeamData, saveTeam }: TeamMemberProps) => {
  const addMembers = (users: Array<UserResult>) => {
    const userIds = users.map(user => {
      return { fullName: user.fullName, userId: user.id, roleIds: [{ roleId: '-1', viaIdP: false }] };
    });

    if (userIds) {
      const members = [...(team?.members ? team.members : []), ...userIds];
      setTeamData({ members });

      // Remove fullName as not yet supported by API
      const teamData = {
        ...team,
        members: members.map(member => {
          return {
            userId: member.userId,
            roleIds: member?.roleIds ? member?.roleIds : []
          };
        })
      };

      // Save added members
      saveTeam(teamData);
    }

    close();
  };

  const removeMember = (member: ApiTeamMember) => {
    const teamData = {
      ...team,
      members: team.members.filter(m => m.userId !== member.userId)
    };

    setTeamData({ members: teamData.members });

    // Save removed members
    saveTeam(teamData);

    close();
  };

  const assignRoles = (members: Array<ApiTeamMember>) => {
    // Update members with role assignment
    setTeamData({ members });

    const teamData = {
      ...team,
      members: members
    };

    // Save role assignment for members
    saveTeam(teamData);
  };

  return (
    <ProductiveCard
      className={locals.card}
      primaryButtonPlacement="top"
      primaryButtonText={t('in-settings:tabs.teams.addUsers')}
      onPrimaryButtonClick={() => {
        // replace with new pure Carbon AddUserDialog
        addActiveDialog(<AddUserDialog members={team?.members} onSubmit={addMembers} />);
      }}
      {...(team?.members?.length > 0
        ? {
            secondaryButtonPlacement: 'top',
            secondaryButtonText: t('in-settings:tabs.teams.assignRoleForMembers'),
            onSecondaryButtonClick: () => {
              addActiveDialog(<AssignRoleDialog team={team} onSubmit={assignRoles} setMessage={() => ''} />);
            }
          }
        : {})}
      title={t('in-settings:tabs.teams.members', { count: team?.members?.length })}
    >
      {isLoading && <CarbonInlineLoading />}
      {!isLoading && team?.members?.length <= 0 && (
        <>
          <Typography variant="heading-03">{t('in-settings:tabs.teams.noMembersYet')}</Typography>
          <Typography variant="body-01">{t('in-settings:tabs.teams.noMembersDefinedMessage')}</Typography>
        </>
      )}
      {!isLoading && team?.members?.length > 0 && (
        <CarbonContainedList label={''} size="md" className={locals.hideTitle}>
          {team?.members?.map(member => {
            return (
              <CarbonContainedListItem
                key={member?.userId}
                action={
                  <CarbonButton
                    aria-label={t('in-settings:tabs.teams.removeMemberFromTeam')}
                    hasIconOnly
                    iconDescription={t('in-settings:tabs.teams.removeMemberFromTeam')}
                    kind="ghost"
                    onClick={() =>
                      addActiveDialog(
                        <ConfirmationDialog
                          header={t('in-settings:components.confirmRemove')}
                          description={
                            <Trans
                              i18nKey="in-settings:components.confirmRemoveItem"
                              values={{
                                itemName: t('in-settings:tabs.teams.memberWithName', {
                                  name: member?.fullName ? member?.fullName : member?.userId
                                })
                              }}
                            />
                          }
                          onSubmit={() => removeMember(member)}
                          confirmButtonLabel={t('in-settings:tabs.remove')}
                          confirmButtonKind="danger"
                          confirmButtonAutoFocus
                        />
                      )
                    }
                    renderIcon={TrashCan}
                  />
                }
              >
                <div className={locals.memberContent}>
                  <span>
                    <Link href={getEntityIdView(securityAndAccessAccessControlUsers, member.userId)} ellipsis>
                      {member?.fullName ? member.fullName : member?.userId}
                    </Link>
                  </span>
                  <span>{member?.roleIds && <RoleView roles={member.roleIds} />}</span>
                </div>
              </CarbonContainedListItem>
            );
          })}
        </CarbonContainedList>
      )}
    </ProductiveCard>
  );
};

export default TeamMember;
