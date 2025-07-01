/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, Item, ListForm, MapForm, Path } from 'formalistic';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { noop } from 'lodash';

import { Stack, SvgIcon, Typography, Checkbox, Button, IconButton } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { ApiGroup } from '@instana/types';

import {
  FieldsProps,
  OnChangeProps,
  OnRemoveProps,
  OnSubmitProps,
  ShareAndInviteDialogBoxProps,
  ShortUrlProps,
  UnitKeysProps,
  UserInvite
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox_interfaces';
import {
  SHARE_AND_INVITE_ADD_USER,
  SHARE_AND_INVITE_CLOSED,
  SHARE_AND_INVITE_COPY_LINK,
  SHARE_AND_INVITE_NEW_GROUP,
  SHARE_AND_INVITE_SUBMIT,
  SHARE_AND_INVITE_TRIGGERED
} from 'in-services/tracking/eventNames';
import {
  anyValidEntry,
  checkInviteAlreadyExists,
  checkUserAlreadyExists,
  createInviteForm,
  emptyInvite
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InviteForm';
// @ts-expect-error File needs to be migrated to typescipt
import { timeDisplayTopFormat, timeDisplayBottomFormat } from 'in-components/time/timeframeFormatter';
// @ts-expect-error File needs to be migrated to typescipt
import { useShortUrl } from 'in-components/DashboardHeader/UrlShortener/shortener';
// eslint-disable-next-line no-restricted-imports
import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import { onDoInviteUser } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InviteUserButton';
import { getStrippedGroupsAsResultObservable } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
// @ts-expect-error file needs TS migration
import { getUnitKeys } from 'in-api/unitKeys';
import { fixateTimeConfig, getTimeConfig, setTimeConfig } from 'in-stores/time/config';
import { securityAndAccessAccessControlGroupNew } from 'in-settings/navigation/paths';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import ComboBox, { Option, Options } from 'in-components/ComboBox/ComboBox';
import { getInvitations$, getUsersAsResultObservable } from 'in-api/users';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { defaultRoleId, fallbackRoleId, role } from 'in-stores/user';
import { datasourceInstanaAgentPath } from 'in-plg/navigation/paths';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { newOTelPageEnabled } from 'in-services/featureFlags';
import HelpText from 'in-components/form/HelpText/HelpText';
import TextArea from 'in-components/form/TextArea/TextArea';
import { close } from 'in-components/DialogPresenter/store';
import { successObservable } from 'in-services/util/result';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { pendingResult } from 'in-services/fixedObjects';
import Input from 'in-components/form/Input/Input';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Dialog from 'in-components/Dialog/Dialog';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox.mless';

const USER_LIMIT = 5;
const agentDetailsPagePath = newOTelPageEnabled ? datasourceInstanaAgentPath : '/agents/installation';

const closeModal = (callback?: () => void) => {
  if (typeof callback === 'function') callback();
  close();
};

const Fields = ({ children, helpText, helpTextIcon, className }: FieldsProps) => {
  return (
    <FormGroup
      className={classNames({
        [locals.formGroup]: true,
        // @ts-expect-error custom class will be applied on if it present.
        [className]: className
      })}
    >
      {helpTextIcon ? (
        <Stack direction="horizontal" gap="xxsmall" align="end">
          <Stack>
            <HelpText>{helpText}</HelpText>
          </Stack>
          <div>{helpTextIcon}</div>
        </Stack>
      ) : (
        <HelpText>{helpText}</HelpText>
      )}
      {children}
    </FormGroup>
  );
};

export const InviteSentState = Object.freeze({
  SUCCESS: 'sentSuccess',
  notSentYet: 'notSentYet',
  FAILURE_USER_ALREADY_EXISTS: 'sentFailureUserExists',
  INTERNAL_ERROR: 'sentFailureServerError',
  FAILURE_USER_ALREADY_INVITED: 'sentFailureInviteExists'
} as const);

export type UserSentStateStatus = keyof typeof InviteSentState;

export type UserSentState = (typeof InviteSentState)[UserSentStateStatus];

const onChange = ({
  index,
  path,
  value,
  invite,
  form,
  setForm,
  pendingInvitations,
  users,
  invitationResult
}: OnChangeProps) => {
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

const onRemove = ({ index, form, setForm }: OnRemoveProps) => {
  setForm(form.remove(index).setTouched(true));
};

const onSubmitInvitation = (props: OnSubmitProps) => {
  const {
    canSelectGroup,
    form,
    setForm,
    groups,
    emailMessage,
    inviteOnly,
    createHref,
    clonedLocation,
    productArea,
    setMessage,
    setInvitationResult,
    trackCta
  } = props;
  return (event: any) => {
    event.preventDefault();

    if (!form.hierarchyValid) {
      setForm(form.setTouched(true, { recurse: true }));
      return;
    }

    // use default role when user is not allowed to choose a role
    let groupId: string;

    form.map((inviteItem: Item) => {
      const invite: MapForm<any> = inviteItem as MapForm<any>;
      if (canSelectGroup) {
        groupId = (invite.get('groupId') as Field<string>).value;
        const group: ApiGroup = groups.length ? groups.find((group: ApiGroup) => group.id === groupId) : null;
        const groupName = group?.name ? group.name : 'default';
        trackCta(SHARE_AND_INVITE_SUBMIT, { group: groupName });
      } else {
        groupId = defaultRoleId;
        trackCta(SHARE_AND_INVITE_SUBMIT, { group: 'default' });
      }
    });
    const invitations = form.toJS().map((e: any) => ({
      groupId: e.groupId,
      email: e.email,
      message: emailMessage,
      path: inviteOnly ? '/#/home' : createHref(clonedLocation), // if invited from user section or pending invite section, the return URL should be to /home
      pageName: productArea,
      userSentState: e.userSentState === InviteSentState.INTERNAL_ERROR ? InviteSentState.notSentYet : e.userSentState
    }));
    onDoInviteUser(setMessage, invitations, setForm, setInvitationResult, noop); // noop instead of goToPath since we are not redirecting anymore
  };
};

const ShareAndInviteDialogBox = ({ inviteOnly, permissionToShowInvite }: ShareAndInviteDialogBoxProps) => {
  const { location, createHref, createHrefToPath } = useNavigation();
  const clonedLocation = cloneLocation(location);

  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string }>();
  const [fixateTime, setFixateTime] = useState(!clonedLocation?.pathname.includes(agentDetailsPagePath));

  const getShortUrl = useShortUrl();
  const timeZone = new Date().toLocaleDateString('default', { day: '2-digit', timeZoneName: 'short' }).slice(4);

  const urlResult: ShortUrlProps | undefined | null = useObservable(getShortUrl({ fixateTime }), [fixateTime]);
  const shortUrl = urlResult?.data?.shortUrl;
  const groups: any =
    useObservable(role?.canConfigureTeams ? getStrippedGroupsAsResultObservable : successObservable, []) ??
    pendingResult;
  let timeConfig = useTimeConfig();
  const unitKeys: UnitKeysProps | undefined | null = useObservable(getUnitKeys(), []);
  const pendingInvitationResult = useObservable(getInvitations$, []) ?? pendingResult;
  const pendingInvitations = pendingInvitationResult?.data;
  const usersResult = useObservable(getUsersAsResultObservable, []) ?? pendingResult;
  const users = usersResult?.data;

  const [invitationResult, setInvitationResult] = useState<UserInvite[]>([]);
  const initialState = createInviteForm(invitationResult);
  const [form, setForm]: [ListForm<any>, any] = useState(initialState);

  const { pageRootName, productArea } = getViewTrackingMetaData();
  const [emailMessage, setEmailMessage] = useState('');

  const { trackCta } = useSegmentTracking();

  if (fixateTime) {
    setTimeConfig(clonedLocation, fixateTimeConfig(getTimeConfig(clonedLocation)));
  }

  if (fixateTime && timeConfig) {
    timeConfig = fixateTimeConfig(timeConfig);
  }

  let sortedGroups: Options = [];

  useEffect(() => {
    trackCta(SHARE_AND_INVITE_TRIGGERED, { pageRootName, productArea });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (message?.type === 'success') {
      if (message?.text === t('in-settings:tabs.sendingInvitation')) {
        addMessage({
          type: 'info',
          title: t('in-settings:ShareAndInviteDialogBox.invitationSend'),
          content: message.text,
          timeout: 3000
        });
      }
    } else if (message?.type === 'error') {
      addMessage({
        type: 'warning',
        title: t('in-settings:ShareAndInviteDialogBox.somethingWentWrong'),
        content: t('in-settings:ShareAndInviteDialogBox.failedToSendInvitation'),
        timeout: 3000
      });
    }
  }, [message]);

  if (groups?.data) {
    sortedGroups = groups.data
      .filter((group: ApiGroup) => group.id !== fallbackRoleId)
      .map((group: ApiGroup) => {
        return { value: group.id, label: group.name };
      });
  }

  const canSelectGroup = sortedGroups !== undefined && sortedGroups.length !== 0;

  const disableSendButton = (!form.hierarchyValid && form.touched) || !anyValidEntry(form);

  return (
    <Dialog
      data-testid="share-and-invite-dialog-box"
      title={
        <div className={locals.title}>
          <Stack gap="disabled">
            {inviteOnly ? (
              <Typography variant="heading-400">{t('in-settings:ShareAndInviteDialogBox.inviteUsers')}</Typography>
            ) : (
              <Typography variant="heading-400">
                {`${t('in-settings:ShareAndInviteDialogBox.share')} ${productArea?.toLowerCase() ?? ''}`}
              </Typography>
            )}
            {permissionToShowInvite ? (
              inviteOnly ? (
                <Typography variant="body-regular">
                  {t('in-settings:ShareAndInviteDialogBox.inviteToInstana')}
                </Typography>
              ) : (
                <Typography variant="body-regular">
                  {t('in-settings:ShareAndInviteDialogBox.inviteYourTeamMates')}
                </Typography>
              )
            ) : (
              <Typography variant="body-regular">{t('in-settings:ShareAndInviteDialogBox.shareALink')}</Typography>
            )}
          </Stack>
        </div>
      }
      className={locals.shareAndInviteDialogBox}
      onClose={() => {
        closeModal(() => {
          trackCta(SHARE_AND_INVITE_CLOSED);
        });
      }}
      withoutBodyPadding
    >
      <form
        onSubmit={onSubmitInvitation({
          canSelectGroup,
          form,
          setForm,
          groups,
          emailMessage,
          inviteOnly,
          createHref,
          clonedLocation,
          productArea,
          setMessage,
          setInvitationResult,
          trackCta
        })}
      >
        <div
          className={classNames({
            [locals.modalBody]: true,
            [locals.hideInvite]: !permissionToShowInvite
          })}
        >
          {permissionToShowInvite && (
            <>
              <div data-testid="user-list">
                {(form as any).map((invite: MapForm<any>, index: number) => (
                  <Row key={index} className={locals.emailAndGroupRow}>
                    {(invite.get('email') as Field<string>).map((field: Field<string>) => (
                      <Col xs={8}>
                        <Fields helpText={index === 0 ? t('in-settings:ShareAndInviteDialogBox.emailAddress') : null}>
                          <Input
                            value={field.value}
                            onChange={(e: any) =>
                              onChange({
                                index,
                                path: [index, 'email'],
                                value: e.target.value,
                                invite,
                                form,
                                setForm,
                                pendingInvitations,
                                users,
                                invitationResult
                              })
                            }
                            placeholder={t('in-settings:ShareAndInviteDialogBox.emailAddress')}
                          />
                          <TouchedMessages field={field} />
                          {(invite.get('userSentState') as Field<string>).map((field: Field<string>) => {
                            return <TouchedMessages field={field} />;
                          })}
                        </Fields>
                      </Col>
                    ))}
                    {(invite.get('groupId') as Field<string>).map((field: Field<string>) => (
                      <Col xs={4}>
                        <Fields
                          helpText={index === 0 ? t('in-settings:ShareAndInviteDialogBox.group') : null}
                          helpTextIcon={
                            index === 0 ? (
                              <Tooltip content={t('in-settings:ShareAndInviteDialogBox.groupToolTip')} align="auto">
                                <SvgIcon size="xxs" type="lib_help_error_info_outline" />
                              </Tooltip>
                            ) : null
                          }
                        >
                          <Stack direction="horizontal" gap="disabled">
                            <ComboBox
                              value={field.value}
                              options={
                                sortedGroups.length ? sortedGroups : [{ label: 'Default', value: defaultRoleId }]
                              }
                              onChange={e =>
                                onChange({
                                  index,
                                  path: [index, 'groupId'],
                                  value: (e as Option).value,
                                  invite,
                                  form,
                                  setForm,
                                  pendingInvitations,
                                  users,
                                  invitationResult
                                })
                              }
                              className={locals.groupComboBox}
                              isClearable={false}
                            />
                            <IconButton
                              type="lib_actions_delete"
                              kind="primaryv2"
                              size="compact"
                              onClick={() =>
                                onRemove({
                                  index,
                                  form,
                                  setForm
                                })
                              }
                              disabled={form.size <= 1}
                            />
                          </Stack>
                        </Fields>
                      </Col>
                    ))}
                  </Row>
                ))}
              </div>

              <Row className={locals.addUserAddGroup}>
                <Col xs={9}>
                  <Button
                    icon="lib_openclose_add_circle_outline"
                    iconSize="s"
                    kind="action"
                    onClick={() => {
                      trackCta(SHARE_AND_INVITE_ADD_USER);
                      setForm(form.push(emptyInvite()).setTouched(true));
                    }}
                    disabled={form.size >= USER_LIMIT}
                  >
                    {t('in-settings:ShareAndInviteDialogBox.addUser')}
                  </Button>
                </Col>
                {role?.canConfigureTeams && (
                  <Col xs={3}>
                    <Button
                      icon="lib_openclose_add_circle_outline"
                      iconSize="s"
                      kind="action"
                      href={createHrefToPath(securityAndAccessAccessControlGroupNew)}
                      onClick={() => {
                        trackCta(SHARE_AND_INVITE_NEW_GROUP);
                      }}
                    >
                      {t('in-settings:ShareAndInviteDialogBox.newGroup')}
                    </Button>
                  </Col>
                )}
              </Row>

              <Row>
                <Col xs={12}>
                  <Fields helpText={t('in-settings:ShareAndInviteDialogBox.emailMessage')}>
                    <TextArea
                      className={locals.emailMessageTextArea}
                      value={emailMessage}
                      /* @ts-ignore (value does exist inside e.target) */
                      onChange={e => setEmailMessage(e.target.value)}
                      placeholder={
                        inviteOnly
                          ? t('in-settings:ShareAndInviteDialogBox.emailMessageForInviteOnly')
                          : t('in-settings:ShareAndInviteDialogBox.defaultEmailMessage')
                      }
                    />
                  </Fields>
                  <HelpText>{t('in-settings:ShareAndInviteDialogBox.youCanEditThisMessage')}</HelpText>
                </Col>
              </Row>
            </>
          )}
          {!inviteOnly && (
            <>
              <Row>
                <Col xs={12}>
                  <Fields helpText={t('in-settings:ShareAndInviteDialogBox.pageLink')} className={locals.greyedOutText}>
                    <div data-testid="short-url-component">
                      <InputWithButton
                        type="copy"
                        displayContent={shortUrl}
                        inputValue={shortUrl}
                        size="fullWidth"
                        callBack={() => {
                          trackCta(SHARE_AND_INVITE_COPY_LINK);
                        }}
                      />
                    </div>
                  </Fields>
                </Col>
              </Row>
              {clonedLocation?.pathname.includes(agentDetailsPagePath) ? (
                <Row>
                  <Col xs={12}>
                    <Fields
                      helpText={t('in-settings:ShareAndInviteDialogBox.agentKey')}
                      className={locals.greyedOutText}
                    >
                      <InputWithButton
                        type="copy"
                        displayContent={unitKeys?.agentKey}
                        inputValue={unitKeys?.agentKey}
                        size="fullWidth"
                      />
                    </Fields>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col xs={12}>
                    <Fields
                      helpText={t('in-settings:ShareAndInviteDialogBox.currentTimeRange')}
                      className={locals.greyedOutText}
                    >
                      <Input
                        value={
                          timeConfig
                            ? `${timeDisplayTopFormat(timeConfig)}; ${timeDisplayBottomFormat(timeConfig)} ${timeZone}`
                            : ''
                        }
                        readOnly
                      />
                    </Fields>
                    <Checkbox
                      checked={fixateTime}
                      label={t('in-settings:ShareAndInviteDialogBox.fixateTime')}
                      size="default"
                      onChange={e => setFixateTime(e?.target?.checked)}
                    />
                  </Col>
                </Row>
              )}
            </>
          )}
        </div>

        {permissionToShowInvite && (
          <FormFooter>
            <CancelButton
              data-testid="cancel-button"
              onClick={() =>
                closeModal(() => {
                  trackCta(SHARE_AND_INVITE_CLOSED);
                })
              }
            >
              {t('in-settings:ShareAndInviteDialogBox.cancel')}
            </CancelButton>
            <SaveButton type="submit" disabled={disableSendButton}>
              {t('in-settings:ShareAndInviteDialogBox.send')}
            </SaveButton>
          </FormFooter>
        )}
      </form>
    </Dialog>
  );
};

export default ShareAndInviteDialogBox;
