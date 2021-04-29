/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
import React, { useState } from 'react';
import classNames from 'classnames';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import CopyToClipboardButton from 'in-new-components/CopyToClipboardButton';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import { sendInvitation } from 'in-api/users';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Collaboration.mless';

export const defaultRoleId = '-3';

export default function Collaboration({ isRestricted, agentKey }) {
  const [form, setForm] = useState(
    createMapForm().put(
      'email',
      createField({
        value: '',
        validator: notBlankValidator
      })
    )
  );
  const setEmail = value => {
    const updatedForm = form.updateIn(['email'], field => field.setValue(value).setTouched(false));
    setForm(updatedForm);
  };

  const [isInvitingUser, setIsInvitingUser] = useState(false);

  return (
    <ExpandableLightCard
      className={locals.card}
      title={t('in-waiting-for-deployment:needAColleagueToInstallTheInstanaAgent')}
      framed={false}
      openByDefault={false}
    >
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit(form, setForm, form.get('email').value, setIsInvitingUser);
        }}
      >
        <div className={locals.flexWrapper}>
          {form.get('email').map(field => (
            <Tooltip
              themeStyle="light"
              content={
                isRestricted ? t('in-waiting-for-deployment:thisWillBeAvailableOnceYourInstanceIsReady') : undefined
              }
              align="bottomMiddle"
            >
              <FormGroup
                className={classNames({
                  [locals.userInvideFormGroup]: true,
                  [locals.disabledUserInvideFormGroup]: isRestricted
                })}
              >
                <Label>{t('in-waiting-for-deployment:addAColleagueToYourInstanaAccount')}</Label>
                <div className={locals.flexWrapper}>
                  <Input
                    className={locals.input}
                    disabled={isRestricted}
                    type="email"
                    placeholder={t('in-waiting-for-deployment:email')}
                    onChange={e => setEmail(e.target.value)}
                    value={field.value}
                    hasError={!field.valid && field.touched}
                  />
                  <Button
                    className={locals.inviteButton}
                    icon={isInvitingUser ? 'lib_actions_loading' : undefined}
                    iconSpinning={isInvitingUser}
                    kind="secondary"
                    type="submit"
                    disabled={isRestricted || isInvitingUser}
                  >
                    {isInvitingUser ? '' : t('in-waiting-for-deployment:invite')}
                  </Button>
                </div>
                <TouchedMessages field={field} />
              </FormGroup>
            </Tooltip>
          ))}

          <FormGroup>
            <Label>{t('in-waiting-for-deployment:sendYourAgentKeyGuideToAColleague')}</Label>
            <div className={locals.flexWrapper}>
              <Input className={locals.input} type="text" onChange={() => {}} value={agentKey} />
              <CopyToClipboardButton kind="secondary" getText={() => agentKey} />
            </div>
          </FormGroup>
        </div>
      </form>
    </ExpandableLightCard>
  );
}

function onSubmit(form, setForm, email, setIsInvitingUser) {
  if (!form.hierarchyValid) {
    return setForm(form.setTouched(true, { recurse: true }));
  }

  setIsInvitingUser(true);
  const invitationResult$ = sendInvitation(email, defaultRoleId);
  invitationResult$.once(() => {
    setIsInvitingUser(false);
  });
  invitationResult$.errors().once(() => {
    setIsInvitingUser(false);
  });
}
