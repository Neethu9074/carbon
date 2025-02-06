/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ChangeEvent, FormEvent, useState } from 'react';

import ExpirationDateDropdown from 'in-settings/components/ApiTokenExpiration/ExpirationDateDropdown/ExpirationDateDropdown';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { PersonalApiToken, savePersonalApiToken } from 'in-settings/tabs/UserSettings/api/personalApiToken';
import { createPersonalApiTokenForm } from 'in-settings/tabs/UserSettings/pages/PersonalApiTokens/form';
import { SETTINGS_PERSONAL_API_TOKEN_UPDATE } from 'in-services/tracking/eventNames';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { apiTokenExpirationEnabled } from 'in-services/featureFlags';
import FormGroup from 'in-settings/components/FormGroup/FormGroup';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import CancelButton from 'in-components/form/CancelButton';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import Actions from 'in-components/Dialog/Actions';
import Dialog from 'in-components/Dialog/Dialog';
import { Error } from 'in-types';
import { t } from 'in-i18n';

/**
 * Props for the EditPersonalApiToken component
 * @property onClose to close the current dialogue
 * @property current the personalApiToken to be edited
 */
interface Props {
  readonly onClose: () => void;
  readonly current: PersonalApiToken;
}

/**
 * Component to edit the personal Api token
 * @param param0 props (see definition)
 * @returns instance of component
 */
export default function EditPersonalApiToken({ onClose, current }: Props) {
  const [form, setForm] = useState(createPersonalApiTokenForm(current));
  const [isUpdating, setUpdating] = useState<boolean>(false);
  const [errors, setErrors] = useState<Error[] | undefined>();
  const { unstable_trackEvent } = useSegmentTracking();

  /**
   * Handles a form submit
   * @param e event to be handled
   */
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    savePersonalApiToken({
      ...current,
      name: form.toJS()['name'],
      expiresOn: form.toJS()['expiresOn']
    }).once(
      apiToken => {
        setUpdating(false);
        const customData = {
          id: apiToken.tokenId,
          expiryDate: apiToken.expiresOn,
          expiryOption: form.toJS()['expiryOption']
        };
        unstable_trackEvent(UPDATED_OBJECT, { objectType: SETTINGS_PERSONAL_API_TOKEN_UPDATE }, customData);
        onClose();
      },
      () => {
        const message = t('in-settings:tabs.failedToUpdatePersonalApiToken');
        setErrors([{ code: 'SERVER', message }]);
        setUpdating(false);
      }
    );
  };

  /**
   * Handles a name change
   * @param e ChangeEvent to be handled
   */
  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedForm = form.updateIn(
      ['name'],
      // @ts-expect-error not typesafe...
      field => field.setValue(e.target.value).setTouched(e.target.value !== current.name)
    );
    // @ts-expect-error not typesafe...
    setForm(updatedForm);
  };

  return (
    <Dialog title={t('in-settings:tabs.editPersonalApiToken')} onClose={onClose}>
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
        {apiTokenExpirationEnabled && (
          <ExpirationDateDropdown id="api-token-expiration" form={form} setForm={setForm} />
        )}

        <Actions>
          <CancelButton onClick={onClose} isSaving={isUpdating} />
          <SaveButton isSaving={isUpdating} disabled={!form.hierarchyValid || !form.hierarchyTouched} kind="primary">
            {t('forms.actions.save')}
          </SaveButton>
        </Actions>
      </form>
    </Dialog>
  );
}
