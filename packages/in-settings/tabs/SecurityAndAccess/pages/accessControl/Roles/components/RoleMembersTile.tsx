/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Member, RoleDetails, RoleDetailsRoleTeamDetails } from '@instana/types';
import { Spacer, Typography } from '@instana/components';
import { Layer, Search, Tile } from '@instana/carbon';

import TeamsAndMembersList from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/TeamsAndMembersList';
import SpaceBetweenStack from 'in-settings/components/SpaceBetweenStack';
import { FetchStatus } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

function filterMembersByNameAndEmail(members: Member[], query: string): Member[] {
  return members.filter(({ email, name }) => email?.match(query) || name?.match(query));
}

interface FilteredTeam extends RoleDetailsRoleTeamDetails {
  filteredMembers: Member[];
}

interface RoleMembersTileProps {
  role?: RoleDetails;
  status: FetchStatus;
}

export default function RoleMembersTile({ role, status }: RoleMembersTileProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { id: roleId, name, members, teams } = role ?? {};
  const filteredMembers = filterMembersByNameAndEmail(members ?? [], searchQuery);
  const filteredMembersInTeams = (teams ?? []).map<FilteredTeam>(team => {
    const filteredMembers = filterMembersByNameAndEmail(team.members ?? [], searchQuery);
    return { ...team, filteredMembers };
  });
  const filteredNonEmptyTeams = filteredMembersInTeams.filter(team => !!team.filteredMembers.length);
  const membersCount = (members ?? []).length;
  const teamMembersCount = (teams ?? []).reduce((prev, { members }) => prev + (members ?? []).length, 0);
  const membersTotal = membersCount + teamMembersCount;

  return (
    <Tile>
      <Layer level={0}>
        <SpaceBetweenStack>
          <Typography variant="heading-200" component="h4">
            {t('in-settings:details.role.usersTitle', { count: membersTotal })}
          </Typography>
          <Search
            closeButtonLabelText={t('in-settings:details.role.clearSearchButton')}
            id="role-member-search"
            labelText={t('in-settings:details.role.userSearchLabel')}
            placeholder={t('in-settings:details.role.userSearchPlaceholder')}
            role="searchbox"
            size="md"
            type="text"
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
          />
        </SpaceBetweenStack>
        <Spacer vertical="normal" />
        {/* Render members list for entire TU */}
        <TeamsAndMembersList listedMembers={filteredMembers} members={members ?? []} roleId={roleId} status={status} />
        {/* Render members list for every team */}
        {filteredNonEmptyTeams?.map(
          ({ id, tag, members, filteredMembers }) =>
            members?.length && (
              <TeamsAndMembersList
                key={`team-members-${id}`}
                listedMembers={filteredMembers}
                members={members ?? []}
                roleId={roleId}
                teamId={id}
                teamTag={tag}
                status={status}
                roleName={name}
              />
            )
        )}
      </Layer>
    </Tile>
  );
}
