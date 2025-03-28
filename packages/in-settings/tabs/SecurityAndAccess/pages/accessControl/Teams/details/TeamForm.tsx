/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { CarbonForm, CarbonTag, CarbonTextArea, CarbonTextInput } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { TeamTag } from '@instana/types';

import { ApiTeam as Team } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { getTagsResult } from 'in-settings/tabs/SecurityAndAccess/api/tags';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from './TeamForm.mless';

interface TeamFormProps {
  setValid: (isValid: boolean) => void;
  setTeamData: (team: Partial<Team>) => void;
  name?: string;
  originalName?: string;
  description?: string;
  editable?: boolean;
}

const TeamForm = ({
  setValid,
  setTeamData,
  editable = false,
  name = '',
  originalName = '',
  description = ''
}: TeamFormProps) => {
  const [nameValidationMessage, setNameValidationMessage] = useState('');
  const tagsResult = useObservable(getTagsResult, []) ?? pendingResult;
  const tags: Array<TeamTag> = tagsResult?.data;

  const validate = (teamName: string) => {
    if (teamName?.length === 0) {
      // Team name is required
      setNameValidationMessage(t('in-settings:tabs.teams.nameRequired'));
      setValid(false);
    } else if (originalName !== teamName && tags?.some(tag => tag.displayName === teamName)) {
      // Check if team name already exists as tag
      setNameValidationMessage(t('in-settings:tabs.teams.nameAlreadyExists'));
      setValid(false);
    } else {
      // Valid
      setNameValidationMessage('');
      setValid(true);
    }
  };

  return (
    <>
      {!editable && (
        <>
          <CarbonTag type="blue" size="lg">
            {name}
          </CarbonTag>
          <div className={locals.description}>{description}</div>
        </>
      )}
      {editable && (
        <CarbonForm>
          <CarbonTextInput
            helperText={t('in-settings:tabs.teams.nameHelperText')}
            id="rbac-team-name"
            invalid={!!nameValidationMessage}
            invalidText={nameValidationMessage}
            labelText={t('in-settings:tabs.teams.name')}
            maxLength={256}
            onChange={e => {
              const value = e.target.value;
              setTeamData({ tag: value, info: { description: description } });
              validate(value);
            }}
            required
            type="text"
            value={name}
          />
          <CarbonTextArea
            className={locals.description}
            helperText={t('in-settings:tabs.teams.descriptionHelperText')}
            id="rbac-team-description"
            labelText={t('in-settings:tabs.teams.description')}
            maxLength={2048}
            onChange={e => {
              setTeamData({ tag: name, info: { description: e.target.value } });
              // no validation required
            }}
            rows={7}
            value={description}
          />
        </CarbonForm>
      )}
    </>
  );
};

export default TeamForm;
