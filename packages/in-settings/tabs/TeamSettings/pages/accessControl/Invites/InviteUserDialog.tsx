/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, createListForm, Field, Item, ListForm, MapForm, Path } from 'formalistic';
import React, { useState } from 'react';

import { Message, SvgIcon, Button } from '@instana/components';
import { useObservable } from '@instana/hooks';

// @ts-expect-error this is not yet typescript
import { getStrippedGroupsAsResultObservable } from 'in-settings/tabs/TeamSettings/api/groups';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { defaultRoleId, fallbackRoleId } from 'in-stores/user';
import { submitInviteUserTracker } from 'in-settings/tracker';
import { close } from 'in-components/DialogPresenter/store';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/layout/Grid';
import Dialog from 'in-components/Dialog/Dialog';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { config } from 'in-services/config';
import Tooltip from 'in-components/Tooltip';
import { GroupWithRoles } from 'in-types';
import { t } from 'in-i18n';

import locals from './InviteUserDialog.mless';

export type UserSentState = 'sentSuccess' | 'notSentYet' | 'sentFailureUserExists' | 'sentFailureServerError';

export interface UserInvite {
  groupId: string;
  email: string;
  userSentState: UserSentState;
}

export default function InviteUserDialog({
  onSubmit,
  previousResult
}: {
  onSubmit: (toSend: UserInvite[]) => void;
  previousResult?: UserInvite[];
}) {
  const initialState = createListForm({
    validator: invites => {
      const invitesMapForms: MapForm<any>[] = invites as MapForm<any>[];
      const rows: Field<UserSentState>[] = invitesMapForms.map(mF => mF.get('userSentState') as Field<UserSentState>);
      const someNotSent = rows.some(r => r.value === 'notSentYet' || r.value === 'sentFailureServerError');
      if (!someNotSent) {
        return [
          {
            severity: 'error',
            message: t('in-settings:tabs.pleaseInviteAtLeastOneUser')
          }
        ];
      }

      if (invites.length === 0) {
        return [
          {
            severity: 'error',
            message: t('in-settings:tabs.pleaseInviteAtLeastOneUser')
          }
        ];
      }

      return null;
    },

    items: previousResult ? previousResult.map(mapToFormItem) : [emptyInvite()]
  });

  const [form, setForm]: [ListForm<any>, any] = useState(initialState);
  const groups: any = useObservable(getStrippedGroupsAsResultObservable(), []);

  const onChange = (path: Path<any>, value: any) => {
    setForm(form.updateIn(path, field => field.setValue(value).setTouched(true)));
  };

  const onRemove = (index: number) => {
    setForm(form.remove(index).setTouched(true));
  };

  const internalOnSubmit = (canSelectGroup: boolean) => {
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
          const group: GroupWithRoles = groups.length
            ? groups.find((group: GroupWithRoles) => group.id === groupId)
            : null;
          const groupName = group && group.name ? group.name : 'default';
          submitInviteUserTracker({ group: groupName });
        } else {
          groupId = defaultRoleId;
          submitInviteUserTracker({ group: 'default' });
        }
      });

      onSubmit(
        form.toJS().map((e: any) => ({
          groupId: e.groupId,
          email: e.email,
          userSentState: e.userSentState === 'sentFailureServerError' ? 'notSentYet' : e.userSentState
        }))
      );
    };
  };

  if (!groups || groups.progress?.loading) {
    // skip inital rendering, but render when the data has been loaded
    return null;
  }

  let sortedGroups: GroupWithRoles[] | undefined;

  if (groups.data) {
    sortedGroups = groups.data
      .filter((group: GroupWithRoles) => group.id !== fallbackRoleId)
      .map((group: GroupWithRoles) => {
        return { id: group.id, name: group.name };
      });
  }

  const canSelectGroup = sortedGroups !== undefined && sortedGroups.length !== 0;

  const renderRow = (invite: MapForm<any>, index: number) => {
    const i: string = `${index}`;
    let iconOrButton = (
      <SvgIcon
        className={locals.removeButton}
        data-testid={`delete_invite_${i}`}
        type={'lib_actions_delete'}
        onClick={() => onRemove(index)}
      />
    );

    const isSuccessInvite: boolean =
      (invite.get('userSentState') as Field<UserSentState>).value === ('sentSuccess' as UserSentState);
    if (isSuccessInvite) {
      iconOrButton = <SvgIcon className={locals.sentIcon} data-testid={`already_sent_${i}`} type={'lib_check'} />;
    }

    const isUserAlreadyExists: boolean =
      (invite.get('userSentState') as Field<UserSentState>).value === ('sentFailureUserExists' as UserSentState);
    if (isUserAlreadyExists) {
      iconOrButton = (
        <Tooltip content={t('in-settings:tabs.thisUserAlreadyExists')}>
          <SvgIcon
            className={locals.alreadyExistsIcon}
            data-testid={`already_exists_${i}`}
            type={'lib_help_error_warning'}
          />
        </Tooltip>
      );
    }

    return (
      <Row className={locals.row} key={i}>
        <Col xs={7}>
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
                  onChange={e => onChange([i, 'email'], e.target.value)}
                  hasError={!field.valid && field.touched}
                  autoFocus
                  disabled={isSuccessInvite || isUserAlreadyExists}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            );
          })}
        </Col>
        <Col xs={4}>
          {canSelectGroup &&
            (invite.get('groupId') as Field<string>).map((field: Field<string>) => (
              <FormGroup>
                <Label htmlFor={`invitation-role_${i}`} hasError={!field.valid && field.touched}>
                  {t('in-settings:tabs.group')}
                </Label>
                <Select
                  id={`invitation-group_${i}`}
                  data-testid={`invitation-group_${i}`}
                  value={field.value}
                  onChange={e => onChange([i, 'groupId'], e.target.value)}
                  hasError={!field.valid && field.touched}
                  disabled={isSuccessInvite || isUserAlreadyExists}
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
        <Col xs={1}>{iconOrButton}</Col>
      </Row>
    );
  };

  const invitesMapForms: MapForm<any>[] = form.map(i => i) as MapForm<any>[];
  const rows: Field<UserSentState>[] = invitesMapForms.map(mF => mF.get('userSentState') as Field<UserSentState>);
  const hasSentFailures = rows.some(r => r.value === 'sentFailureServerError');

  return (
    <Dialog
      className={locals.dialog}
      title={t('in-settings:tabs.inviteUserToTenant', { tenant: config.tenant })}
      onClose={close}
    >
      <>
        <form onSubmit={internalOnSubmit(canSelectGroup)}>
          {(form as any).map((entry: MapForm<any>, i: number) => renderRow(entry, i))}

          <div className={locals.anotherUserRow}>
            <Button
              kind="action"
              icon="lib_openclose_add_circle_outline"
              className={locals.button}
              onClick={() => setForm(form.push(emptyInvite()).setTouched(true))}
            >
              {t('in-settings:tabs.anotherUser')}
            </Button>
          </div>
          <Button
            className={locals.button}
            kind="primary"
            type="submit"
            disabled={(!form.hierarchyValid && form.touched) || !anyValidEntry(form)}
          >
            {t('in-settings:tabs.inviteUser')}
          </Button>
        </form>

        {hasSentFailures ? (
          <Message className={locals.message} type="error" withIcon>
            {t('in-settings:tabs.someEmailsHaveFailedToSend')}
          </Message>
        ) : (
          <></>
        )}
      </>
    </Dialog>
  );
}

function anyValidEntry(form: ListForm<any>) {
  const asJsObject = form.toJS();
  return asJsObject.some(
    (e: any) =>
      (e.userSentState === 'notSentYet' || e.userSentState === 'sentFailureServerError') && e.email.trim() !== ''
  );
}

function emptyInvite() {
  return mapToFormItem({ groupId: defaultRoleId, email: '', userSentState: 'notSentYet' });
}

function mapToFormItem(previousResult: UserInvite) {
  return createMapForm()
    .put(
      'groupId',
      createField({
        value: previousResult.groupId,
        validator: notBlankValidator
      })
    )
    .put(
      'email',
      createField({
        value: previousResult.email,
        validator: notBlankValidator
      })
    )
    .put(
      'userSentState',
      createField({
        value: previousResult.userSentState
      })
    );
}
