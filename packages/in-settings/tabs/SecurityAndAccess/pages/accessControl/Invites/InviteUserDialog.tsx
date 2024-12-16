/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, Item, ListForm, MapForm, Path } from 'formalistic';
import React, { useState } from 'react';

import { Message, Stack, StackItem, Button, Select, IconButton, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  anyValidEntry,
  checkInviteAlreadyExists,
  checkUserAlreadyExists,
  createInviteForm,
  emptyInvite
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InviteForm';
import { onDoInviteUser } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InviteUserButton';
import { getStrippedGroupsAsResultObservable } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { SETTINGS_USER_INVITE_SUBMIT } from 'in-services/tracking/tracking';
import { getInvitations$, getUsersAsResultObservable } from 'in-api/users';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { defaultRoleId, fallbackRoleId, role } from 'in-stores/user';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { close } from 'in-components/DialogPresenter/store';
import { successObservable } from 'in-services/util/result';
import FormGroup from 'in-settings/components/FormGroup';
import { pendingResult } from 'in-services/fixedObjects';
import { Row, Col } from 'in-components/layout/Grid';
import Dialog from 'in-components/Dialog/Dialog';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { config } from 'in-services/config';
import { ApiGroup } from 'in-types';
import { t } from 'in-i18n';

import locals from './InviteUserDialog.mless';

export const InviteSentState = Object.freeze({
  SUCCESS: 'sentSuccess',
  notSentYet: 'notSentYet',
  FAILURE_USER_ALREADY_EXISTS: 'sentFailureUserExists',
  INTERNAL_ERROR: 'sentFailureServerError',
  FAILURE_USER_ALREADY_INVITED: 'sentFailureInviteExists'
} as const);

export type UserSentStateStatus = keyof typeof InviteSentState;

export type UserSentState = (typeof InviteSentState)[UserSentStateStatus];
export interface UserInvite {
  groupId: string;
  email: string;
  userSentState: UserSentState;
}
export interface PendingInvite {
  id: string;
  email: string;
  groupId: string;
}
export default function InviteUserDialog() {
  const { goToPath } = useNavigation();
  const { trackCta } = useSegmentTracking();
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string }>();
  const groups: any =
    useObservable(role?.canConfigureTeams ? getStrippedGroupsAsResultObservable : successObservable, []) ??
    pendingResult;

  const usersResult = useObservable(getUsersAsResultObservable, []) ?? pendingResult;
  const users = usersResult?.data;
  const pendingInvitationResult = useObservable(getInvitations$, []) ?? pendingResult;
  const pendingInvitations = pendingInvitationResult?.data;
  const [invitationResult, setInvitationResult] = useState<UserInvite[]>([]);

  const initialState = createInviteForm(invitationResult);
  const [form, setForm]: [ListForm<any>, any] = useState(initialState);

  const onChange = (index: number | string, path: Path<any>, value: any, invite: MapForm<any>) => {
    let updatedForm;
    const emailValue = path[1] === 'email' ? value : invite.get('email').value;
    const userInvite = {
      groupId: path[1] === 'groupId' ? value : invite.get('groupId').value,
      email: emailValue,
      userSentState: invite.get('userSentState').value
    };
    if (checkInviteAlreadyExists(userInvite, pendingInvitations)) {
      updatedForm = form.updateIn([index, 'userSentState'] as Path<any>, field =>
        field.setValue(InviteSentState.FAILURE_USER_ALREADY_INVITED).setTouched(true)
      );
    } else if (
      checkUserAlreadyExists(emailValue, users) ||
      invitationResult.find(
        i => i.email === emailValue && i.userSentState === InviteSentState.FAILURE_USER_ALREADY_EXISTS
      )
    ) {
      updatedForm = form.updateIn([index, 'userSentState'] as Path<any>, field =>
        field.setValue('sentFailureUserExists').setTouched(true)
      );
    } else {
      updatedForm = form.updateIn([index, 'userSentState'] as Path<any>, field =>
        field.setValue(InviteSentState.notSentYet)
      );
    }
    setForm(updatedForm.updateIn(path, field => field.setValue(value).setTouched(true)));
  };

  const onRemove = (index: number) => {
    setForm(form.remove(index).setTouched(true));
  };

  const onSubmitInvitation = (canSelectGroup: boolean) => {
    return (event: any) => {
      event.preventDefault();

      if (!form.hierarchyValid) {
        setForm(form.setTouched(true, { recurse: true }));
        return;
      }

      // use default role when user is not allowed to choose a role
      let groupId: string;

      (form as ListForm<any>).map((inviteItem: Item) => {
        const invite: MapForm<any> = inviteItem as MapForm<any>;
        if (canSelectGroup) {
          groupId = (invite.get('groupId') as Field<string>).value;
          const group: ApiGroup = groups.length ? groups.find((group: ApiGroup) => group.id === groupId) : null;
          const groupName = group && group.name ? group.name : 'default';

          trackCta(SETTINGS_USER_INVITE_SUBMIT, { group: groupName });
        } else {
          groupId = defaultRoleId;
          trackCta(SETTINGS_USER_INVITE_SUBMIT, { group: 'default' });
        }
      });
      const invitations = form.toJS().map((e: any) => ({
        groupId: e.groupId,
        email: e.email,
        userSentState: e.userSentState === InviteSentState.INTERNAL_ERROR ? InviteSentState.notSentYet : e.userSentState
      }));
      onDoInviteUser(setMessage, invitations, setForm, setInvitationResult, goToPath);
    };
  };
  if (!groups || groups.progress?.loading) {
    // skip inital rendering, but render when the data has been loaded
    return null;
  }

  let sortedGroups: ApiGroup[] | undefined;

  if (groups?.data) {
    sortedGroups = groups.data
      .filter((group: ApiGroup) => group.id !== fallbackRoleId)
      .map((group: ApiGroup) => {
        return { id: group.id, name: group.name };
      });
  }

  const canSelectGroup = sortedGroups !== undefined && sortedGroups.length !== 0;

  const renderRow = (invite: MapForm<any>, index: number) => {
    const i: string = `${index}`;

    return (
      <Row className={locals.row} key={i}>
        <Col xs={canSelectGroup ? 7 : 11}>
          {(invite.get('email') as Field<string>).map((field: Field<string>) => {
            return (
              <FormGroup>
                <Label htmlFor={`invitation-email_${i}`} hasError={!field.valid && field.touched}>
                  {t('in-settings:tabs.emailAddress')}
                </Label>
                <Input
                  id={`invitation-email_${i}`}
                  data-testid={`invitation-email_${i}`}
                  type="email"
                  value={field.value}
                  onChange={e => onChange(i, [i, 'email'], e.target.value, invite)}
                  hasError={!field.valid && field.touched}
                  autoFocus
                />
                <TouchedMessages field={field} />
                {(invite.get('userSentState') as Field<string>).map((field: Field<string>) => {
                  return <TouchedMessages field={field} />;
                })}
              </FormGroup>
            );
          })}
        </Col>
        {canSelectGroup && (
          <Col xs={4}>
            {(invite.get('groupId') as Field<string>).map((field: Field<string>) => (
              <FormGroup>
                <Label htmlFor={`invitation-role_${i}`} hasError={!field.valid && field.touched}>
                  {t('in-settings:tabs.group')}
                </Label>
                <Select
                  id={`invitation-group_${i}`}
                  data-testid={`invitation-group_${i}`}
                  value={field.value}
                  onChange={e => onChange(i, [i, 'groupId'], e.target.value, invite)}
                  hasError={!field.valid && field.touched}
                >
                  {sortedGroups &&
                    sortedGroups.map(group => (
                      <option value={group.id} key={`invitation-group_${group.id}`}>
                        {group.name}
                      </option>
                    ))}
                </Select>
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
        )}
        <Col xs={1}>
          <IconButton
            buttonType="button"
            className={locals.removeButton}
            kind="primaryv2"
            type="lib_openclose_remove_circle_outline"
            id={`delete_invite_${i}`}
            onClick={() => onRemove(index)}
          />
        </Col>
      </Row>
    );
  };
  const invitesMapForms: MapForm<any>[] = form.map(i => i) as MapForm<any>[];
  const rows: Field<UserSentState>[] = invitesMapForms.map(mF => mF.get('userSentState') as Field<UserSentState>);
  const hasSentFailures = rows.some(r => r.value === InviteSentState.INTERNAL_ERROR);
  return (
    <Dialog
      title={t('in-settings:tabs.inviteUserToTenant', { tenant: config.tenant })}
      onClose={close}
      withoutBodyPadding
      showOverflow
    >
      <form onSubmit={onSubmitInvitation(canSelectGroup)}>
        <div role="form" className={locals.dialogBody}>
          <Stack direction="vertical" gap="xxsmall">
            <StackItem>{message && <Message type={message?.type} title={message?.text} small withIcon />}</StackItem>
            <div className={locals.description}>
              <Typography variant="body-regular" component="div">
                {t('in-settings:tabs.inviteDescription', { tenant: config.tenant })}
              </Typography>
              <Typography variant="body-regular" component="div">
                {t('in-settings:tabs.inviteGroupDescription')}
              </Typography>
            </div>
            <div className={locals.description}>
              <Typography variant="body-regular" component="div">
                {t('in-settings:tabs.inviteUsertoDefaultGroup')}
              </Typography>
            </div>
            <StackItem>
              {(form as any).map((entry: MapForm<any>, i: number) => renderRow(entry, i))}
              <div className={locals.anotherUserRow}>
                <Button
                  kind="action"
                  type="button"
                  icon="lib_openclose_add_circle_outline"
                  className={locals.button}
                  onClick={() => setForm(form.push(emptyInvite()).setTouched(true))}
                >
                  {t('in-settings:tabs.anotherUser')}
                </Button>
              </div>
            </StackItem>

            {hasSentFailures ? (
              <Message className={locals.message} type="error" withIcon>
                {t('in-settings:tabs.someEmailsHaveFailedToSend')}
              </Message>
            ) : (
              <></>
            )}
          </Stack>
        </div>
        <FormFooter className={locals.formFooter}>
          <CancelButton onClick={close}>{t('in-service-levels:general.cancelButtonLabel')}</CancelButton>
          <SaveButton type="submit" disabled={(!form.hierarchyValid && form.touched) || !anyValidEntry(form)}>
            {t('in-settings:tabs.sendInvitation')}
          </SaveButton>
        </FormFooter>
      </form>
    </Dialog>
  );
}
