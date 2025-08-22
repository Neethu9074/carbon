/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button, Typography } from '@instana/components';
import { Callout } from '@instana/carbon';

import TeamAssociationDropdown, {
  useTaggedTeamsSelection
} from 'in-settings/components/Shared/TeamAssociationDropdown/TeamAssociationDropdown';
import { playwithEnabled, rbacTeamsEnabled } from 'in-services/featureFlags';
import Paragraph from 'in-mobile-apps/NewMobileAppFlow/Paragraph';
import ValidationBlock from 'in-components/form/ValidationBlock';
import Frame from 'in-mobile-apps/NewMobileAppFlow/Frame';
import SaveError from 'in-components/form/SaveError';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './InputStep.mless';

export default function InputStep({ field, saveError, loading, onChange, onSubmit, teams, onTeamsChange }) {
  const { teamsTagged, teamsSelected } = useTaggedTeamsSelection(teams || [], onTeamsChange);
  return (
    <Frame title={t('in-mobile-apps:newAppFlow.addMobileAppTitle')}>
      <Paragraph>{t('in-mobile-apps:newAppFlow.addMobileAppDesc')}</Paragraph>

      <form onSubmit={onSubmit}>
        <FormGroup className={locals.group}>
          <Label htmlFor="mobile-app-name">{t('in-mobile-apps:newAppFlow.mobileAppNameLabel')}</Label>

          {saveError && <SaveError>{saveError}</SaveError>}

          <div className={locals.actionWrapper}>
            <Input
              id="mobile-app-name"
              type="text"
              autoFocus
              value={field.value}
              onChange={onChange}
              hasError={field.touched && !field.valid}
              className={locals.input}
              disabled={loading}
            />
            {rbacTeamsEnabled && (
              <div className={locals.teamDropdown}>
                <div>
                  <h1 className={locals.title}>{t('in-mobile-apps:newAppFlow.teamsLabel')}</h1>
                  <Typography variant="body-01">
                    {t('in-mobile-apps:dashboard.tabs.configurations.teamsDescription')}
                  </Typography>
                  <Callout
                    className={locals.message}
                    subtitle={t('in-mobile-apps:dashboard.tabs.configurations.teamsCallout')}
                    lowContrast
                  />
                  <div className={locals.dropdownRow}>
                    <div className={locals.teamsSelector}>
                      <TeamAssociationDropdown
                        onTeamsSelectionChanged={onTeamsChange}
                        assignedTeamTags={teamsSelected || []}
                        teamsTagged={teamsTagged || []}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Button
              type="submit"
              kind="create"
              disabled={playwithEnabled || loading || (field.touched && !field.valid)}
              className={locals.button}
            >
              {t('in-mobile-apps:newAppFlow.addMobileAppBtn')}
            </Button>
          </div>

          {field.touched &&
            field.messages.map((message, i) => (
              <ValidationBlock hasError key={i}>
                {message.message}
              </ValidationBlock>
            ))}
        </FormGroup>
      </form>
    </Frame>
  );
}
