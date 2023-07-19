/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, createListForm, Field, Item, ListForm, MapForm, Path } from 'formalistic';
import React, { FormEvent, useEffect, useState } from 'react';

import { Message, SvgIcon, Button, LoadingSkeleton } from '@instana/components';
import { Typography } from '@instana/components';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { getStrippedGroupsAsResultObservable } from 'in-settings/tabs/TeamSettings/api/groups';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import ActionBar from 'in-settings/components/Dialog/ActionBar';
import { defaultRoleId, fallbackRoleId } from 'in-stores/user';
import { submitInviteUserTracker } from 'in-settings/tracker';
import { close } from 'in-components/DialogPresenter/store';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/layout/Grid';
import Dialog from 'in-components/Dialog/Dialog';
import { Error, GroupWithRoles } from 'in-types';
import Select from 'in-components/form/Select';
import { sendInvitations } from 'in-api/users';
import { hasInvitesValidator } from './utils';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { config } from 'in-services/config';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './InviteUserDialog.mless';

export type UserSentState = 'sentSuccess' | 'notSentYet' | 'sentFailureUserExists' | 'sentFailureServerError';

export interface UserInvite {
  groupId: string;
  email: string;
  userSentState: UserSentState;
}

export default function InviteUserDialog() {
  const [errors, setErrors] = useState<Error[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<ListForm<any>>(
    createListForm({
      validator: hasInvitesValidator,
      items: [mapToFormItem({ groupId: defaultRoleId, email: '', userSentState: 'notSentYet' })]
    })
  );

  useEffect(() => {
    getStrippedGroupsAsResultObservable().subscribe(res => {
      if (res.progress?.loading) {
        return;
      }
      if (res.errors?.length !== 0 ?? false) {
        setErrors([
          {
            code: 'SERVER',
            message: 'failed to load'
          }
        ]);
      }
      if (res.data) {
        const found: { id: string; name: string }[] = res.data
          .filter(({ id }: GroupWithRoles) => id !== fallbackRoleId)
          .map(({ id, name }: GroupWithRoles) => ({ id: id!!, name }));
        setGroups(found);
        setIsLoading(false);
      }
    });
  }, []);

  const onChange = (path: Path<any>, value: any) => {
    setForm(form.updateIn(path, field => field.setValue(value).setTouched(true)));
  };

  const onRemove = (index: number) => {
    setForm(form.remove(index).setTouched(true));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.hierarchyValid) {
      return;
    }

    setIsSaving(true);

    // use default role when user is not allowed to choose a role
    let groupId: string;

    (form as ListForm<any>).map((inviteItem: Item) => {
      const invite: MapForm<any> = inviteItem as MapForm<any>;
      if (canSelectGroup) {
        groupId = (invite.get('groupId') as Field<string>).value;
        const group = groups.length ? groups.find(({ id }) => id === groupId) : null;
        const groupName = group && group.name ? group.name : 'default';
        submitInviteUserTracker({ group: groupName });
      } else {
        groupId = defaultRoleId;
        submitInviteUserTracker({ group: 'default' });
      }
    });

    const toBeSaved = form.toJS().map(({ email, groupId }: any) => ({ groupId, email }));
    sendInvitations(toBeSaved).once(
      () => {
        setIsSaving(false);
        close();
      },
      () => {
        setErrors([{ code: 'SERVER', message: 'failed to invite user' }]);
        setIsSaving(false);
      }
    );
  };

  const canSelectGroup = groups !== undefined && groups.length !== 0;

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
                  {groups &&
                    groups.map(group => (
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
        <div className={locals.description}>
          <Typography variant="body-small" component="div">
            {t('in-settings:tabs.inviteDescription', { tenant: config.tenant })}
          </Typography>
          <Typography variant="body-small" component="div">
            {t('in-settings:tabs.inviteGroupDescription')}
          </Typography>
        </div>
        <ErroneousResultPresenter errors={errors} addBottomMargin />
        {isLoading ? (
          <LoadingSkeleton style={{ height: '9.375rem', width: '48.125rem', display: 'block' }} />
        ) : (
          <form onSubmit={onSubmit}>
            {(form as any).map((entry: MapForm<any>, i: number) => renderRow(entry, i))}

            <div className={locals.anotherUserRow}>
              <Button
                kind="action"
                icon="lib_openclose_add_circle_outline"
                className={locals.button}
                onClick={() => setForm(form.push(emptyInvite())?.setTouched(true))}
              >
                {t('in-settings:tabs.anotherUser')}
              </Button>
            </div>
            <ActionBar
              isSaving={isSaving}
              disabled={(!form.hierarchyValid && form.touched) || !anyValidEntry(form)}
              saveLabel={t('in-settings:tabs.sendInvitation')}
            />
          </form>
        )}
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
