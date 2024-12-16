/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, createMapForm } from 'formalistic';
import React from 'react';

import { Label } from '@instana/components';

import {
  Integration,
  IntegrationForm,
  IntegrationFormFields,
  Variant
} from 'in-settings/tabs/GlobalSettings/pages/integrations/database/types';
import DbIntegrationsBreadcumb from 'in-settings/tabs/GlobalSettings/pages/integrations/database/Integrations/DbIntegrationsBreadcrumb';
import { callToastFlyout } from 'in-settings/tabs/GlobalSettings/pages/integrations/database/Integrations/utils';
import DbMarlinForm from 'in-settings/tabs/GlobalSettings/pages/integrations/database/DbMarlin/DbMarlinForm';
import { globalSettingsIntegrationsDatabaseDbMarlin } from 'in-settings/navigation/paths';
import { getDbIntegrations, saveDbIntegration } from 'in-integrations/database/api';
import { useIntegrationForm } from 'in-settings/hooks/useIntegrationForm';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import { dbMarlin } from 'in-integrations/database/consts';
import SaveCancel from 'in-settings/components/SaveCancel';
import { isBlank } from 'in-services/util/string';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './DbMarlinForm.mless';

const localisationStrings = {
  integrationType: t('in-settings:tabs.team.integrations.database.dbMarlin'),
  title: t('in-settings:tabs.team.integrations.database.configureDbMarlin'),
  subViewHeader: t('in-settings:tabs.team.integrations.database.configureYourDbMarlinSettings'),
  description: t('in-settings:tabs.team.integrations.database.configureDbMarlinDescription'),
  failedToLoadMessage: t('in-settings:tabs.team.integrations.database.failedToLoadDbMarlinConfiguration'),
  successTitle: t('in-settings:tabs.integrations.toastSuccessTitle'),
  successMessage: (integrationType: string) =>
    t('in-settings:tabs.integrations.toastSuccessMessage', { integrationType }),
  errorTitle: t('in-settings:tabs.integrations.toastErrorTitle'),
  errorMessage: (integrationType: string) => t('in-settings:tabs.integrations.toastErrorMessage', { integrationType })
};

const toastContent = (variant: Variant, integrationType: string) => {
  const title = variant === 'success' ? localisationStrings.successTitle : localisationStrings.errorTitle;
  const message =
    variant === 'success'
      ? localisationStrings.successMessage(integrationType)
      : localisationStrings.errorMessage(integrationType);

  return { title, message };
};

export default function DbMarlin() {
  const { goToPath } = useNavigation();
  const { form, loading, message, onChange, onSubmit } = useIntegrationForm({
    integrationKey: dbMarlin,
    createForm,
    failedToLoadMessage: localisationStrings.failedToLoadMessage,
    getIntegrations: getDbIntegrations,
    saveIntegration: saveDbIntegration,
    onSaveSuccess: () => {
      const { title, message } = toastContent('success', localisationStrings.integrationType);
      callToastFlyout('success', title, message);
      goToPath(globalSettingsIntegrationsDatabaseDbMarlin);
    },
    onSaveError: () => {
      const { title, message } = toastContent('error', localisationStrings.integrationType);
      callToastFlyout('error', title, message);
    }
  });

  const enabled = form?.get('enabled')?.value;

  return (
    <section className={locals.page}>
      <Title title={localisationStrings.title} />
      <DbIntegrationsBreadcumb />
      <SubViewHeader>{localisationStrings.subViewHeader}</SubViewHeader>
      <Label>{localisationStrings.description}</Label>
      <SectionLine />
      {form && (
        <form onSubmit={onSubmit}>
          <DbMarlinForm form={form} onChange={onChange} disabled={!enabled} />
          <SaveCancel
            form={form}
            message={message}
            loading={loading}
            hasCancelButton={false}
            saveEnabled={enabled && !isUrlBlank(form)}
            type="integration"
          />
        </form>
      )}
    </section>
  );
}

function createForm(integration?: Integration): IntegrationForm {
  return createMapForm<IntegrationFormFields>({
    items: {
      label: createField<string>({ value: t('in-settings:tabs.team.integrations.database.dbMarlin') }),
      type: createField<string>({ value: dbMarlin }),
      path: createField<string>({ value: globalSettingsIntegrationsDatabaseDbMarlin }),
      url: createField<string>({ value: integration?.['url'] ?? '' }),
      enabled: createField<boolean>({ value: integration?.['enabled'] ?? true })
    }
  });
}

function isUrlBlank(form: IntegrationForm) {
  return isBlank(form.get('url').value);
}
