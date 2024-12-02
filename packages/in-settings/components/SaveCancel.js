/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Button } from '@instana/components';

import { savingMessage as entityFormSavingMessage } from 'in-hoc/entityForm';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import SectionLine from 'in-settings/components/SectionLine';
import Section from 'in-settings/components/Section';
import { t } from 'in-i18n';

import locals from './SaveCancel.mless';

export default function SaveCancel({
  form,
  message,
  loading,
  saveEnabled = true,
  isCreate,
  listPath,
  cancelButtonLabel = t('forms.actions.cancel'),
  onClickCancelButton,
  hasSaveButton = true,
  hasCancelButton = true,
  type = ''
}) {
  const { goToPath } = useNavigation();
  const saving = loading && message === entityFormSavingMessage;
  const saveButtonLabel = isCreate
    ? t('forms.actions.create')
    : type == 'integration'
    ? t('forms.actions.saveIntegration')
    : t('forms.actions.save');
  const savingStateName = t('forms.states.saving');
  return (
    <Fragment>
      <Section className={locals.line}>
        <SectionLine withMarginBottom={false} />
      </Section>
      <Section className={type !== 'integration' ? locals.saveCancelRow : locals.saveButtonIntegrationContainer}>
        {hasCancelButton && (
          <Button
            kind={carbonButtonEnabled ? 'secondary' : 'subtle'}
            className={locals.button}
            onClick={onClickCancelButton || (() => goToPath(listPath))}
          >
            {cancelButtonLabel}
          </Button>
        )}
        {hasSaveButton && (
          <Button
            kind={type !== 'integration' ? 'create' : 'info'}
            type="submit"
            className={type !== 'integration' ? locals.button : locals.integrationButton}
            disabled={(!form.hierarchyValid && form.touched) || loading || saving || !saveEnabled}
            icon={saving ? 'lib_actions_loading' : null}
            iconSpinning
          >
            {saving ? savingStateName : saveButtonLabel}
          </Button>
        )}
      </Section>
    </Fragment>
  );
}
