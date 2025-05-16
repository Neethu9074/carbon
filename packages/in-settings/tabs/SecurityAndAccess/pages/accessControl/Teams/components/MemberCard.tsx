/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';
import React from 'react';

import { Button, ContainedList, ContainedListItem, InlineLoading } from '@instana/carbon';
import { TeamMember, UserResult } from '@instana/types';
import { Link, Typography } from '@instana/components';
import { ProductiveCard } from '@instana/ibm-products';

//@ts-expect-error not a typescript component yet
import { AddUserDialog } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/AddUserButton';
import { AssignRoleDialog } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/role/AssignRoleDialog';
import RoleView from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/role/RoleView';
import { getEntityIdView, securityAndAccessAccessControlUsers } from 'in-settings/navigation/paths';
import { ApiTeam as Team } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { defaultRoleId } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

import locals from './MemberCard.mless';

interface MemberCardProps {
  isLoading: boolean;
  team: Team;
  setTeamData: (team: Partial<Team>) => void;
  saveTeam: (data: Team) => void;
}

const MemberCard = ({ isLoading, team, setTeamData, saveTeam }: MemberCardProps) => {
  const addMembers = (users: Array<UserResult>) => {
    const userIds = users.map(user => {
      return { name: user.fullName, userId: user.id, roles: [{ roleId: defaultRoleId, viaIdP: false }] };
    });

    if (userIds) {
      const members = [...(team?.members ? team.members : []), ...userIds];
      setTeamData({ members });

      // Remove fullName as not yet supported by API
      const teamData = {
        ...team,
        members: members
      };

      // Save added members
      saveTeam(teamData);
    }

    close();
  };

  const removeMember = (member: TeamMember) => {
    const teamData = {
      ...team,
      members: team.members?.filter(m => m.userId !== member.userId)
    };

    setTeamData({ members: teamData.members });

    // Save removed members
    saveTeam(teamData);

    close();
  };

  const assignRoles = (members: Array<TeamMember>) => {
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
      {...(team?.members && team?.members.length > 0
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
      {isLoading && <InlineLoading />}
      {!isLoading && team?.members && team?.members.length <= 0 && (
        <>
          <Typography variant="heading-03">{t('in-settings:tabs.teams.noMembersYet')}</Typography>
          <Typography variant="body-01">{t('in-settings:tabs.teams.noMembersDefinedMessage')}</Typography>
        </>
      )}
      {!isLoading && team?.members && team?.members.length > 0 && (
        <ContainedList label={''} size="md" className={locals.hideTitle}>
          {team?.members?.map(member => {
            return (
              <ContainedListItem
                key={member?.userId}
                action={
                  <Button
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
                                  name: member?.name ? member?.name : member?.userId
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
                      {member?.name ? member.name : member?.userId}
                    </Link>
                    <Typography variant="body-small" noMargin component="div">
                      {member.email}
                    </Typography>
                  </span>
                  <span>{member?.roles && <RoleView roles={member.roles} />}</span>
                </div>
              </ContainedListItem>
            );
          })}
        </ContainedList>
      )}
    </ProductiveCard>
  );
};

export default MemberCard;
