/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, Item, ListForm, MapForm, Path } from 'formalistic';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { noop } from 'lodash';

import { Stack, SvgIcon, Typography, Checkbox } from '@instana/components';
import { ApiGroup, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Button } from '@instana/legacy';

import {
  anyValidEntry,
  checkInviteAlreadyExists,
  createInviteForm,
  emptyInvite
} from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteForm';
// @ts-expect-error File needs to be migrated to typescipt
import { timeDisplayTopFormat, timeDisplayBottomFormat } from 'in-components/time/timeframeFormatter';
// @ts-expect-error File needs to be migrated to typescipt
import { useShortUrl } from 'in-components/DashboardHeader/UrlShortener/shortener';
//@ts-expect-error TS migration
import { getConfigAsResultObservable as getLdapConfig } from 'in-settings/tabs/AuthSettings/api/ldap';
//@ts-expect-error TS migration
import { getConfigAsResultObservable as getOidcConfig } from 'in-settings/tabs/AuthSettings/api/oidc';
//@ts-expect-error TS migration
import { getConfigAsResultObservable as getSamlConfig } from 'in-settings/tabs/AuthSettings/api/saml';
// eslint-disable-next-line no-restricted-imports
import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import {
  closedInviteAndShareModal,
  inviteAndShareButtonClicked,
  shareAndInviteSubmitTracker
} from 'in-settings/tracker';
import { disableInvitesWithIdpEnabled, playWithReleaseEnabled, playwithEnabled } from 'in-services/featureFlags';
import { onDoInviteUser } from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserButton';
import { fixateTimeConfig, getTimeConfig, setTimeConfig, timeConfig$ } from 'in-stores/time/config';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { getStrippedGroupsAsResultObservable } from 'in-settings/tabs/TeamSettings/api/groups';
// @ts-expect-error file needs TS migration
import { getUnitKeys } from 'in-api/unitKeys';
import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { teamSettingsAccessControlGroupNew } from 'in-settings/navigation/paths';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import ComboBox, { Option, Options } from 'in-components/ComboBox/ComboBox';
import { getInvitations$, getUsersAsResultObservable } from 'in-api/users';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import CreatableComboBox from 'in-components/ComboBox/CreatableComboBox';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { defaultRoleId, fallbackRoleId, role } from 'in-stores/user';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import HelpText from 'in-components/form/HelpText/HelpText';
import TextArea from 'in-components/form/TextArea/TextArea';
import { close } from 'in-components/DialogPresenter/store';
import { successObservable } from 'in-services/util/result';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { pendingResult } from 'in-services/fixedObjects';
import Input from 'in-components/form/Input/Input';
import Dialog from 'in-components/Dialog/Dialog';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox.mless';

const USER_LIMIT = 5;
const agentDetailsPagePath = '/agents/installation';

const closeModal = () => {
  closedInviteAndShareModal();
  close();
};

interface FieldsProps {
  children: JSX.Element | JSX.Element[] | string;
  helpText?: JSX.Element | string | null;
  helpTextIcon?: JSX.Element | null;
  className?: string;
}

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
          <HelpText>{helpText}</HelpText>
          {helpTextIcon}
        </Stack>
      ) : (
        <HelpText>{helpText}</HelpText>
      )}
      {children}
    </FormGroup>
  );
};

interface UserResultProp {
  id: string;
  email: string;
}

interface ShortUrlProps {
  data?: { shortUrl: string };
  errors: [];
  progress: { loading: boolean };
  time?: number;
}

interface UnitKeysProps {
  agentKey: string;
  downloadKey: string;
}

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
  message?: string;
  path?: string;
  pageName?: string | null;
  userSentState: UserSentState;
}

interface ShareAndInviteDialogBoxProps {
  hideShare?: boolean;
}

const ShareAndInviteDialogBox = ({ hideShare }: ShareAndInviteDialogBoxProps) => {
  const { location, createHref, createHrefToPath } = useNavigation();
  const clonedLocation = cloneLocation(location);

  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string }>();
  const [fixateTime, setFixateTime] = useState(clonedLocation?.pathname.includes(agentDetailsPagePath) ? false : true);

  const getShortUrl = useShortUrl();
  const timeZone = new Date().toLocaleDateString('default', { day: '2-digit', timeZoneName: 'short' }).slice(4);

  const urlResult: ShortUrlProps | undefined | null = useObservable(getShortUrl({ fixateTime }), [fixateTime]);
  const shortUrl = urlResult?.data?.shortUrl;
  const groups: any =
    useObservable(role?.canConfigureTeams ? getStrippedGroupsAsResultObservable : successObservable, []) ??
    pendingResult;
  let timeConfig = useObservable(timeConfig$, []);
  const usersResult = useObservable(getUsersAsResultObservable, []) ?? pendingResult;
  const unitKeys: UnitKeysProps | undefined | null = useObservable(getUnitKeys(), []);
  const pendingInvitationResult = useObservable(getInvitations$, []) ?? pendingResult;
  const pendingInvitations = pendingInvitationResult?.data;

  const [invitationResult, setInvitationResult] = useState<UserInvite[]>([]);
  const initialState = createInviteForm(invitationResult);
  const [form, setForm]: [ListForm<any>, any] = useState(initialState);

  const { pageRootName, productArea } = getViewTrackingMetaData();
  const [emailMessage, setEmailMessage] = useState('');

  interface ConfigProps {
    activated: boolean;
  }

  const isSamlConfigured: Result<ConfigProps> | undefined | null = useObservable(getSamlConfig, []);
  const isLdapConfigured: Result<ConfigProps> | undefined | null = useObservable(getLdapConfig, []);
  const isOidcConfigured: Result<ConfigProps> | undefined | null = useObservable(getOidcConfig, []);

  const isAnyIDPActive =
    disableInvitesWithIdpEnabled &&
    (isSamlConfigured?.data?.activated || isLdapConfigured?.data?.activated || isOidcConfigured?.data?.activated);

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

      form.map((inviteItem: Item) => {
        const invite: MapForm<any> = inviteItem as MapForm<any>;
        if (canSelectGroup) {
          groupId = (invite.get('groupId') as Field<string>).value;
          const group: ApiGroup = groups.length ? groups.find((group: ApiGroup) => group.id === groupId) : null;
          const groupName = group && group.name ? group.name : 'default';
          shareAndInviteSubmitTracker({ group: groupName });
        } else {
          groupId = defaultRoleId;
          shareAndInviteSubmitTracker({ group: 'default' });
        }
      });
      const invitations = form.toJS().map((e: any) => ({
        groupId: e.groupId,
        email: e.email,
        message: emailMessage,
        path: hideShare ? '/#/home' : createHref(clonedLocation), // if invited from user section or pending invite section, the return URL should be to /home
        pageName: productArea,
        userSentState: e.userSentState === InviteSentState.INTERNAL_ERROR ? InviteSentState.notSentYet : e.userSentState
      }));
      onDoInviteUser(setMessage, invitations, setForm, setInvitationResult, noop); // noop instead of goToPath since we are not redirecting anymore
    };
  };

  if (fixateTime) {
    setTimeConfig(clonedLocation, fixateTimeConfig(getTimeConfig(clonedLocation)));
  }

  if (fixateTime && timeConfig) {
    timeConfig = fixateTimeConfig(timeConfig);
  }

  const users = usersResult?.data ?? [];
  let sortedGroups: Options = [];

  useEffect(() => {
    inviteAndShareButtonClicked({ pageRootName, productArea });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (message?.type === 'success') {
      if (message?.text === t('in-settings:tabs.sendingInvitation')) {
        addMessage(
          {
            type: 'info',
            title: t('in-settings:ShareAndInviteDialogBox.invitationSend'),
            content: message.text
          },
          1
        );
      } else {
        removeMessage(1); // we are removing the sending invite toast.
        addMessage({
          type: 'info',
          title: t('in-settings:ShareAndInviteDialogBox.invitationSend'),
          content: message.text
        });
      }
    } else if (message?.type === 'error') {
      removeMessage(1); // we are removing the sending invite toast.
      addMessage({
        type: 'warning',
        title: t('in-settings:ShareAndInviteDialogBox.somethingWentWrong'),
        content: t('in-settings:ShareAndInviteDialogBox.failedToSendInvitation')
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

  // Hide invite section if the user doesn't have the permission to "User management".
  // Hide invite section if IDP enabled.
  // Hide invite section in play with.
  const showInvite = role?.canConfigureUsers && !(playwithEnabled || playWithReleaseEnabled) && !isAnyIDPActive;

  const disableSendButton = (!form.hierarchyValid && form.touched) || !anyValidEntry(form);

  return (
    <Dialog
      data-testid="share-and-invite-dialog-box"
      title={
        <div className={locals.title}>
          <Stack gap="disabled">
            <Typography variant="heading-400">
              {`${t('in-settings:ShareAndInviteDialogBox.share')} ${productArea?.toLowerCase() ?? ''}`}
            </Typography>
            {showInvite ? (
              <Typography variant="body-regular">
                {t('in-settings:ShareAndInviteDialogBox.inviteYourTeamMates')}
              </Typography>
            ) : (
              <Typography variant="body-regular">{t('in-settings:ShareAndInviteDialogBox.shareALink')}</Typography>
            )}
          </Stack>
        </div>
      }
      className={locals.shareAndInviteDialogBox}
      onClose={closeModal}
      withoutBodyPadding
    >
      <form onSubmit={onSubmitInvitation(canSelectGroup)}>
        <div
          className={classNames({
            [locals.modalBody]: true,
            [locals.hideInvite]: !showInvite
          })}
        >
          {/*
            we don't want to show the invite section if the user :
              1. Does'nt have the right to invite
              2. play with is enabled
          */}
          {showInvite && (
            <>
              <div data-testid="user-list">
                {(form as any).map((invite: MapForm<any>, index: number) => (
                  <Row key={index} className={locals.emailAndGroupRow}>
                    {(invite.get('email') as Field<string>).map((field: Field<string>) => (
                      <Col xs={9}>
                        <Fields helpText={index === 0 ? t('in-settings:ShareAndInviteDialogBox.emailAddress') : null}>
                          <CreatableComboBox
                            value={{ value: field.value, label: field.value }}
                            options={users
                              .filter(
                                (item: UserResultProp) =>
                                  !form
                                    .toJS()
                                    .map((e: any) => e.email)
                                    .includes(item.email)
                              )
                              .map((item: UserResultProp) => ({ value: item.email, label: item.email }))}
                            onChange={(e: any) => onChange(index, [index, 'email'], e.value, invite)}
                            placeholder={t('in-settings:ShareAndInviteDialogBox.emailAddress')}
                            formatCreateLabel={(inputText: string) =>
                              `${t('in-settings:ShareAndInviteDialogBox.add')} "${inputText}"`
                            }
                            isClearable={false}
                          />
                          <TouchedMessages field={field} />
                          {(invite.get('userSentState') as Field<string>).map((field: Field<string>) => {
                            return <TouchedMessages field={field} />;
                          })}
                        </Fields>
                      </Col>
                    ))}
                    {(invite.get('groupId') as Field<string>).map((field: Field<string>) => (
                      <Col xs={3}>
                        <Fields
                          helpText={index === 0 ? t('in-settings:ShareAndInviteDialogBox.group') : null}
                          helpTextIcon={
                            index === 0 ? (
                              <Tooltip
                                content={t('in-settings:ShareAndInviteDialogBox.groupToolTip')}
                                align="topMiddle"
                              >
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
                              onChange={e => onChange(index, [index, 'groupId'], (e as Option).value, invite)}
                              className={locals.groupComboBox}
                              isClearable={false}
                            />
                            <Button
                              icon="lib_actions_delete"
                              kind="action"
                              iconSize="s"
                              size="normal"
                              onClick={() => onRemove(index)}
                              disabled={form.size <= 1}
                            >
                              {''}
                            </Button>
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
                    iconSize="xs"
                    kind="action"
                    onClick={() => setForm(form.push(emptyInvite()).setTouched(true))}
                    disabled={form.size >= USER_LIMIT}
                  >
                    {t('in-settings:ShareAndInviteDialogBox.addUser')}
                  </Button>
                </Col>
                {role?.canConfigureTeams && (
                  <Col xs={3}>
                    <Button
                      icon="lib_openclose_add_circle_outline"
                      iconSize="xs"
                      kind="action"
                      href={createHrefToPath(teamSettingsAccessControlGroupNew)}
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
                      placeholder={t('in-settings:ShareAndInviteDialogBox.defaultEmailMessage')}
                    />
                  </Fields>
                  <HelpText>{t('in-settings:ShareAndInviteDialogBox.youCanEditThisMessage')}</HelpText>
                </Col>
              </Row>
            </>
          )}
          {!hideShare && (
            <>
              <Row>
                <Col xs={12}>
                  <Fields helpText={t('in-settings:ShareAndInviteDialogBox.pageLink')} className={locals.greyedOutText}>
                    <div data-testid="short-url-component">
                      <InputWithButton type="copy" displayContent={shortUrl} inputValue={shortUrl} size="fullWidth" />
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

        {showInvite && (
          <FormFooter>
            <CancelButton data-testid="cancel-button" onClick={closeModal}>
              {t('in-settings:ShareAndInviteDialogBox.cancel')}
            </CancelButton>
            <SaveButton
              type="submit"
              disabled={disableSendButton}
              className={classNames({
                [locals.saveButton]: true,
                [locals.buttonDisabled]: disableSendButton
              })}
            >
              {t('in-settings:ShareAndInviteDialogBox.send')}
            </SaveButton>
          </FormFooter>
        )}
      </form>
    </Dialog>
  );
};

export default ShareAndInviteDialogBox;
