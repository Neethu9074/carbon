/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Stack, Button, ContainedList, ContainedListItem, InlineLoading, Layer } from '@instana/carbon';
import { IconButton, Link, LoadingSkeleton, Typography } from '@instana/components';
import { Member } from '@instana/types';

import SelectUserDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/components/SelectUserDialog';
import { addRoleMembers, removeMemberFromRole } from 'in-settings/tabs/SecurityAndAccess/api/roles';
import { securityAndAccessAccessControlUserEdit } from 'in-settings/navigation/paths';
import useUserList from 'in-settings/tabs/SecurityAndAccess/hooks/useUserList';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import SpaceBetweenStack from 'in-settings/components/SpaceBetweenStack';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import useFormSubmission from 'in-hooks/useFormSubmission';
import { FetchStatus } from 'in-hooks/utils/types';
import { seconds } from 'in-services/time/time';
import { config } from 'in-services/config';
import { t, Trans } from 'in-i18n';

import locals from './TeamsAndMembersList.mless';

function showDeleteConfirmationDialog(onConfirm: VoidFunction, itemName: string, isSaving?: boolean): void {
  addActiveDialog(
    <ConfirmationDialog
      isSaving={isSaving}
      header={t('in-settings:components.confirmRemove')}
      description={<Trans i18nKey="in-settings:components.confirmRemoveItem" values={{ itemName }} />}
      confirmButtonLabel={t('in-settings:components.removeBtn')}
      onSubmit={onConfirm}
      confirmButtonAutoFocus
    />
  );
}

interface TeamsAndMembersListProps {
  /**
   * This property is used to specify exactly which members are to be
   * displayed. It is used to hide specific members that do not correspond to
   * a specific query parameter, for example.
   **/
  listedMembers: Array<Member>;
  /**
   * This should contain all members of a team and is be used to pre-select
   * users in the "add-user"-dialog.
   **/
  members: Array<Member>;
  roleId?: string;
  status: FetchStatus;
  teamId?: string;
  teamTag?: string;
}

export default function TeamsAndMembersList({
  listedMembers,
  members,
  roleId,
  status,
  teamId,
  teamTag
}: TeamsAndMembersListProps) {
  const { createHrefToPath } = useNavigation();
  const [, doAddMember] = useFormSubmission(addRoleMembers);
  const [deleteStatus, doRemoveMember] = useFormSubmission(removeMemberFromRole);
  const [lastInteractedUserId, setLastInteractedUserId] = useState<string>();

  const scopeTitle = t('in-settings:details.role.scopeTitle', {
    context: teamId ? 'teamScope' : 'entireTu',
    teamTag: teamTag ?? `${config.tenantUnit}-${config.tenant}`
  });

  return (
    <Layer level={2}>
      <ContainedList
        label={
          <TeamScopeLabel
            scopeTitle={scopeTitle}
            selectedMembers={members}
            status={status}
            onUpdateTeamMembers={userIds => {
              if (!roleId) return;

              doAddMember({
                payload: { roleId, userIds },
                onSuccess: () => {
                  addMessage({
                    content: t('in-settings:details.role.successfullyAddedMemberToRole', { count: userIds.length }),
                    type: 'success',
                    timeout: seconds.toMillis(4)
                  });
                  close();
                },
                onError: () => {
                  addMessage({
                    content: t('in-components:error.serverErrorInfo'),
                    timeout: seconds.toMillis(6),
                    type: 'danger'
                  });
                }
              });
            }}
          />
        }
        kind="on-page"
      >
        {listedMembers.map(({ userId, email, name }) => (
          <ContainedListItem key={`team-${teamId}-member-${userId}`}>
            <SpaceBetweenStack>
              <Stack orientation="vertical">
                <Typography variant="body-bold" noWrap>
                  <Link href={createHrefToPath(securityAndAccessAccessControlUserEdit, { id: userId })}>{name}</Link>
                </Typography>
                <Typography variant="body-small" noWrap>
                  {email}
                </Typography>
              </Stack>
              <div className={locals.alignRight}>
                {deleteStatus === 'pending' && lastInteractedUserId === userId ? (
                  <InlineLoading />
                ) : (
                  <IconButton
                    aria-label={t('in-settings:components.removeMemberFromRoleButton')}
                    iconSize="xs"
                    kind="secondary"
                    onClick={() => {
                      const userName = listedMembers?.findLast(({ userId: uId }) => userId === uId)?.name ?? '';

                      showDeleteConfirmationDialog(
                        function onConfirm() {
                          if (!roleId) return;

                          setLastInteractedUserId(userId);

                          doRemoveMember({
                            payload: { roleId, userId },
                            onSuccess: () => {
                              addMessage({
                                content: t('in-settings:details.role.successfullyRemovedMemberFromRole'),
                                timeout: seconds.toMillis(4),
                                type: 'success'
                              });
                              close();
                            },
                            onError: () => {
                              addMessage({
                                content: t('in-components:error.serverErrorInfo'),
                                timeout: seconds.toMillis(6),
                                type: 'danger'
                              });
                              close();
                            }
                          });
                        },
                        userName,
                        deleteStatus === 'pending'
                      );
                    }}
                    type="lib_actions_delete"
                  />
                )}
              </div>
            </SpaceBetweenStack>
          </ContainedListItem>
        ))}
      </ContainedList>
    </Layer>
  );
}

interface TeamScopeLabelProps extends SelectMembersDialogProps {
  scopeTitle: string;
  status: FetchStatus;
}

function TeamScopeLabel({ onUpdateTeamMembers, scopeTitle, selectedMembers, status }: TeamScopeLabelProps) {
  if (status === 'pending') return <LoadingSkeleton />;

  return (
    <SpaceBetweenStack>
      <Stack orientation="vertical" className={locals.paddingTop}>
        <Typography variant="label-01" noWrap>
          {t('in-settings:components.teamScopeTitle')}
        </Typography>
        <Typography variant="body-large" noWrap>
          {scopeTitle}
        </Typography>
      </Stack>

      <div className={locals.alignRight}>
        <Button
          kind="ghost"
          onClick={() =>
            addActiveDialog(
              <SelectMembersDialog selectedMembers={selectedMembers} onUpdateTeamMembers={onUpdateTeamMembers} />
            )
          }
        >
          {t('in-settings:components.addMemberToRoleButton')}
        </Button>
      </div>
    </SpaceBetweenStack>
  );
}

interface SelectMembersDialogProps {
  selectedMembers: Member[];
  onUpdateTeamMembers: (userIds: string[]) => void;
}

function SelectMembersDialog({ selectedMembers, onUpdateTeamMembers }: SelectMembersDialogProps) {
  const [users] = useUserList();

  return (
    <SelectUserDialog
      modalHeading={t('in-settings:components.selectMembersDialogTitle')}
      onCancel={close}
      onConfirm={onUpdateTeamMembers}
      preselectedIds={selectedMembers?.map(({ userId }) => userId) ?? []}
      users={users ?? []}
    />
  );
}
