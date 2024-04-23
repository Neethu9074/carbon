/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ChangeEvent, FormEvent, useState } from 'react';
import { createField, createMapForm } from 'formalistic';

import { Code, Spacer, Stack, StackItem, Typography } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { Button } from '@instana/legacy';

import { PersonalApiToken, createPersonalApiToken } from 'in-settings/tabs/UserSettings/api/personalApiToken';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { notBlankValidator } from 'in-services/validators/string';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import CancelButton from 'in-components/form/CancelButton';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import Actions from 'in-components/Dialog/Actions';
import Dialog from 'in-components/Dialog/Dialog';
import { user } from 'in-stores/user';
import { Error } from 'in-types';
import { t } from 'in-i18n';

/**
 * Props for CreateForm component
 * @property onCreated CB for passing in the created token
 * @property onClose CB for passing in the (Dialog) close function
 */
interface CreateFormProps {
  readonly onCreated: (token: PersonalApiToken) => void;
  readonly onClose: () => void;
}

/**
 * Component for creating a PersonalApiToken
 * @param param0 props for creation
 * @returns Component
 */
function CreateForm({ onCreated, onClose }: CreateFormProps) {
  const [form, setForm] = useState(
    createMapForm().put('name', createField({ value: '', validator: notBlankValidator }))
  );
  const [creating, setCreating] = useState<boolean>(false);
  const [errors, setErrors] = useState<Error[] | undefined>();

  const userId = user?.id ?? ('' as string);

  /**
   * Handles a form submit
   * @param e event to be handled
   */
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);

    createPersonalApiToken({
      tokenId: generateUniqueShortId(),
      accessGrantingToken: generateUniqueShortId(),
      userId,
      name: form.toJS()['name']
    }).once(
      body => {
        onCreated({
          tokenId: body.tokenId,
          name: body.name,
          accessGrantingToken: body.accessGrantingToken,
          userId: body.userId
        });
        setCreating(false);
      },
      () => {
        const message = t('in-settings:tabs.failedToCreatePersonalApiToken');
        setErrors([{ code: 'SERVER', message }]);
        setCreating(false);
      }
    );
  };

  /**
   * Handles a name change
   * @param e ChangeEvent to be handled
   */
  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    // @ts-expect-error not typesafe...
    const updatedForm = form.updateIn(['name'], field => field.setValue(e.target.value).setTouched(true));
    // @ts-expect-error not typesafe...
    setForm(updatedForm);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <ErroneousResultPresenter errors={errors} addBottomMargin />
      {form.get('name').map(field => (
        <FormGroup>
          <Label htmlFor="personal-api-token-name" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.personalApiTokenNameDescription')}
          </Label>
          <Input
            id="personal-api-token-name"
            value={field.value}
            onChange={onNameChange}
            hasError={!field.valid && field.touched}
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      <Actions>
        <CancelButton onClick={onClose} isSaving={creating} />
        <SaveButton isSaving={creating} disabled={!form.hierarchyValid} kind="primary">
          {t('forms.actions.save')}
        </SaveButton>
      </Actions>
    </form>
  );
}

/**
 * Properties for ShowCreatedToken component
 * @property token to be used as actual credential
 * @property name to be used as display name of the token
 * @property description to be used as display description of the token
 * @property onClose to close the dialogue
 */
interface ShowCreatedTokenProps {
  readonly token: string;
  readonly name: string;
  readonly description: string;
  readonly onClose: () => void;
}
//style={{ maxWidth: '22rem' }}
/**
 * Component to display the created token
 * @param param0 {ShowCreatedTokenProps} used to pass in current infos
 * @returns component
 */
export function ShowCreatedToken({ name, token, description, onClose }: ShowCreatedTokenProps) {
  return (
    <Stack>
      <StackItem>
        <Typography variant="body-small">{description}</Typography>
        <Spacer />
      </StackItem>
      <StackItem>
        <Stack gap="disabled">
          <StackItem>
            <Typography variant="body-regular">{t('in-settings:tabs.displayName')}</Typography>
          </StackItem>
          <StackItem>
            <Typography variant="body-bold">{name}</Typography>
          </StackItem>
        </Stack>
      </StackItem>
      <StackItem>
        <Stack gap="disabled">
          <StackItem>
            <Typography variant="body-regular">{t('in-settings:tabs.token')}</Typography>
          </StackItem>
          <StackItem>
            <Code code={token} lang="jsx" />
          </StackItem>
        </Stack>
      </StackItem>
      <StackItem>
        <Actions>
          <Button onClick={onClose} kind="subtle">
            {t('forms.actions.close')}
          </Button>
        </Actions>
      </StackItem>
    </Stack>
  );
}

/**
 * Props for the CreatePersonalApiToken component
 * @property onClose to close the current dialogue
 */
interface CreatePersonalApiTokenProps {
  readonly onClose: () => void;
}

/**
 * Component to create a new personal api token
 * @param param0 {CreatePersonalApiTokenProps} props for current component
 * @returns current component
 */
export default function CreatePersonalApiToken({ onClose }: CreatePersonalApiTokenProps) {
  const [created, setCreated] = useState<PersonalApiToken | null>(null);
  const headline = created
    ? t('in-settings:tabs.createdPersonalApiToken')
    : t('in-settings:tabs.createPersonalApiToken');
  const tokenDescription = t('in-settings:tabs.personalApiTokenDescription');

  return (
    <Dialog title={headline} onClose={onClose}>
      {created ? (
        <ShowCreatedToken
          name={created.name}
          token={created.accessGrantingToken}
          description={tokenDescription}
          onClose={onClose}
        />
      ) : (
        <CreateForm onClose={onClose} onCreated={token => setCreated(token)} />
      )}
    </Dialog>
  );
}
