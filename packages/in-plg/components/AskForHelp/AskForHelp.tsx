/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field, UpdatedMapForm, MapFormItems } from 'formalistic';
import React, { useState } from 'react';

import { Stack, KeyValue, Button } from '@instana/components';

import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input/Input';
import { sendInvitations } from 'in-api/users';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './AskForHelp.mless';

interface AskForHelpProps {
  agentKey?: string;
  isRestricted?: boolean;
}

const AskForHelp: React.FC<AskForHelpProps> = ({ agentKey, isRestricted = false }) => {
  const defaultRoleId = '-3';

  const [form, setForm] = useState<UpdatedMapForm<MapFormItems, 'email', Field<string>>>(
    createMapForm().put(
      'email',
      createField({
        value: '',
        validator: notBlankValidator
      })
    )
  );
  const [isInvitingUser, setIsInvitingUser] = useState<boolean>(false);

  const setEmail = (value: string) => {
    const updatedForm = form.updateIn(['email'], field => (field as Field<string>).setValue(value).setTouched(false));
    setForm(updatedForm as unknown as UpdatedMapForm<MapFormItems, 'email', Field<string>>);
  };

  const onSubmit = (
    form: UpdatedMapForm<MapFormItems, 'email', Field<string>>,
    setForm: React.Dispatch<React.SetStateAction<UpdatedMapForm<MapFormItems, 'email', Field<string>>>>,
    email: string,
    setIsInvitingUser: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!form.hierarchyValid) {
      return setForm(form.setTouched(true, { recurse: true }));
    }

    setIsInvitingUser(true);
    const invitationResult$ = sendInvitations([{ email: email, groupId: defaultRoleId }]);
    invitationResult$.once(() => {
      setIsInvitingUser(false);
    });
    invitationResult$.errors().once(() => {
      setIsInvitingUser(false);
    });
  };

  return (
    <Stack>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit(form, setForm, form.get('email').value, setIsInvitingUser);
        }}
      >
        {form.get('email').map((field: Field<string>) => (
          <Tooltip
            themeStyle="light"
            content={
              isRestricted ? t('in-plg:agentDetails.askForHelp.thisWillBeAvailableOnceYourInstanceIsReady') : undefined
            }
            align="bottomMiddle"
          >
            <FormGroup>
              <Stack gap="xxsmall" distribution="end">
                <Stack direction="horizontal" align="end">
                  <KeyValue
                    label={t('in-plg:agentDetails.askForHelp.inviteAColeague')}
                    value={
                      <Input
                        className={locals.input}
                        type="email"
                        disabled={isRestricted}
                        placeholder={t('in-plg:agentDetails.askForHelp.email')}
                        onChange={e => setEmail(e.target.value)}
                        value={field.value}
                        hasError={!field.valid && field.touched}
                      />
                    }
                    withGap
                  />
                  <Button
                    icon={isInvitingUser ? 'lib_actions_loading' : undefined}
                    iconSpinning={isInvitingUser}
                    size="compact"
                    kind="action"
                    type="submit"
                    noAutoMargin
                    disabled={isRestricted || isInvitingUser}
                  >
                    {isInvitingUser ? '' : t('in-plg:agentDetails.askForHelp.send')}
                  </Button>
                </Stack>
                <Stack>
                  <TouchedMessages field={field} />
                </Stack>
              </Stack>
            </FormGroup>
          </Tooltip>
        ))}
        <Stack>
          <Stack direction="horizontal" align="end">
            <KeyValue
              label={t('in-plg:agentDetails.askForHelp.agentKey')}
              value={<Input className={locals.input} disabled type="text" defaultValue={agentKey ? agentKey : ''} />}
              withGap
            />
            <CopyToClipboardButton size="compact" kind="action" getText={() => agentKey ?? ''} />
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default AskForHelp;
