import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React, { useState } from 'react';

import CopyToClipboardButton from 'in-new-components/CopyToClipboardButton';
import TouchedMessages from 'in-components/form/TouchedMessages';
import classNames from 'classnames';
import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import ExpandableCard from 'in-new-components/ExpandableCard';
import FormGroup from 'in-components/form/FormGroup';
import { sendInvitation } from 'in-api/users';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import { light } from 'in-themes/themes';

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
    <LocallyChangedTheme theme={light}>
      <ExpandableCard
        className={locals.card}
        title="Need a colleague to install the Instana agent?"
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
                content={isRestricted ? 'This will be available once your instance is ready' : undefined}
                align="bottomMiddle"
              >
                <FormGroup
                  className={classNames({
                    [locals.userInvideFormGroup]: true,
                    [locals.disabledUserInvideFormGroup]: isRestricted
                  })}
                >
                  <Label>Add a colleague to your Instana account</Label>
                  <div className={locals.flexWrapper}>
                    <Input
                      className={locals.input}
                      disabled={isRestricted}
                      type="email"
                      placeholder="email"
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
                      {isInvitingUser ? '' : 'Invite'}
                    </Button>
                  </div>
                  <TouchedMessages field={field} />
                </FormGroup>
              </Tooltip>
            ))}

            <FormGroup>
              <Label>Send your agent key & guide to a colleague</Label>
              <div className={locals.flexWrapper}>
                <Input className={locals.input} type="text" onChange={() => {}} value={agentKey} />
                <CopyToClipboardButton kind="secondary" getText={() => agentKey} />
              </div>
            </FormGroup>
          </div>
        </form>
      </ExpandableCard>
    </LocallyChangedTheme>
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
