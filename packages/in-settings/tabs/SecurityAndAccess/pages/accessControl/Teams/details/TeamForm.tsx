/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { CarbonForm, CarbonTag, CarbonTextArea, CarbonTextInput } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { ApiTeamTag, getTagsAsResultObservable } from 'in-settings/tabs/SecurityAndAccess/api/tags';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from './TeamForm.mless';

interface TeamFormProps {
  setValid: (isValid: boolean) => void;
  setTeamData: (name: string, description: string) => void;
  name?: string;
  originalName?: string;
  description?: string;
  editable?: boolean;
}

const TeamForm = ({
  setValid,
  setTeamData: setNameDescription,
  editable = false,
  name = '',
  originalName = '',
  description = ''
}: TeamFormProps) => {
  const [nameValidationMessage, setNameValidationMessage] = useState('');
  const tagsResult = useObservable(getTagsAsResultObservable, []) ?? pendingResult;
  const tags = tagsResult?.data as ApiTeamTag[];

  const validate = (teamName: string) => {
    if (teamName?.length === 0) {
      // Team name is required
      setNameValidationMessage(t('in-settings:createTeamDialog.nameRequired'));
      setValid(false);
    } else {
      // Check if team name already exists as tag
      if (originalName !== '' && originalName !== teamName && tags && tags.some(tag => tag.displayName === teamName)) {
        setNameValidationMessage(t('in-settings:createTeamDialog.nameAlreadyExists'));
        setValid(false);
      } else {
        // Valid
        setNameValidationMessage('');
        setValid(true);
      }
    }
  };

  return (
    <>
      {!editable && (
        <>
          <CarbonTag type="blue">{name}</CarbonTag>
          <div className={locals.description}>{description}</div>
        </>
      )}
      {editable && (
        <CarbonForm>
          <CarbonTextInput
            id={'rbac-team-name'}
            labelText={t('in-settings:createTeamDialog.name')}
            helperText={t('in-settings:createTeamDialog.nameHelperText')}
            invalid={!!nameValidationMessage}
            invalidText={nameValidationMessage}
            type="text"
            value={name}
            onChange={e => {
              const value = e.target.value;
              setNameDescription(value, description);
              validate(value);
            }}
            required
            maxLength={256}
          />
          <CarbonTextArea
            id={'rbac-team-description'}
            className={locals.description}
            labelText={t('in-settings:createTeamDialog.description')}
            helperText={t('in-settings:createTeamDialog.descriptionHelperText')}
            value={description}
            rows={7}
            onChange={e => {
              setNameDescription(name, e.target.value);
              // no validation required
            }}
            maxLength={2048}
          />
        </CarbonForm>
      )}
    </>
  );
};

export default TeamForm;
