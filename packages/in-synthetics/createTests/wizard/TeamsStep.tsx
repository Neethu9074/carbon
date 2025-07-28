/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { Callout } from '@instana/carbon';
import { TeamTag } from '@instana/types';

import TeamAssociationDropdown, {
  useTaggedTeamsSelection
} from 'in-settings/components/Shared/TeamAssociationDropdown/TeamAssociationDropdown';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/wizard/TeamsStep.mless';

export const SYNTHETIC_TAB = Object.freeze({
  TESTS: 'Tests',
  CREDENTIALS: 'Credentials'
} as const);

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  tab: string;
}

export default function TeamsStep({ form, updateForm, tab }: Props) {
  const teamsAssigned: TeamTag[] = form.getIn(['rbacTags'])?.value ?? [];
  const assignedTeamTags = teamsAssigned.map(team => ({
    id: team.id ?? '',
    displayName: team.displayName
  }));
  const { teamsTagged, teamsLoading, teamsError, teamsSelected } = useTaggedTeamsSelection(
    assignedTeamTags,
    updateTeamsInForm
  );
  function updateTeamsInForm(items: TeamTag[]) {
    updateForm(
      form.updateIn(['rbacTags'], (field: Item) => (field as Field<TeamTag[]>).setValue(items).setTouched(true))
    );
  }
  return (
    <div className={locals.teamsContainer}>
      <Callout
        className={locals.message}
        subtitle={t('in-synthetics:dialog.createTest.advancedMode.teamsCalloutMessage', {
          syntheticTab:
            tab === SYNTHETIC_TAB.TESTS
              ? t('in-synthetics:dashboard.testList.secondaryLabels.tests')
              : t('in-synthetics:dashboard.testList.secondaryLabels.credentials')
        })}
        lowContrast
      />
      {!teamsLoading && !teamsError && (
        <div id="teamsSelect" className={locals.teamsSelector}>
          <TeamAssociationDropdown
            assignedTeamTags={teamsSelected}
            teamsTagged={teamsTagged}
            onTeamsSelectionChanged={updateTeamsInForm}
          />
        </div>
      )}
    </div>
  );
}
