/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useRef, useState } from 'react';

import { Card, LoadingSkeleton, Stack, Toggle, Typography } from '@instana/components';

import {
  getIntegrationsSubPages,
  Integration
} from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Integrations/utils';
import { callToastFlyout } from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Integrations/utils';
// @ts-ignore
import { refresh } from 'in-integrations/logging/configurationsStore';
import SubViewHeaderComponent from 'in-settings/components/SubViewHeader';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
// @ts-ignore
import { get, save } from 'in-integrations/logging/api';
import Title from 'in-components/Title/Title';
import { t } from 'in-i18n';

import locals from './Integrations.mless';

const localisationStrings = {
  logIntegrations: t('in-settings:tabs.integrations.logIntegrations'),
  logIntegrationsTooltip: t('in-settings:tabs.integrations.logIntegrationsTooltip'),
  logIntegrationsDescription: t('in-settings:tabs.integrations.logIntegrationsDescription'),
  logIntegrationsTooltipApiError: t('in-settings:tabs.integrations.logIntegrationsTooltipApiError'),
  disabled: t('in-settings:tabs.integrations.disabled'),
  on: t('in-settings:tabs.integrations.on'),
  off: t('in-settings:tabs.integrations.off'),
  successTitle: t('in-settings:tabs.integrations.toastSuccessTitle'),
  errorTitle: t('in-settings:tabs.integrations.toastErrorTitle'),
  integrationEnabled: t('in-settings:tabs.integrations.integerationEnabled'),
  integrationDisabled: t('in-settings:tabs.integrations.integerationDisabled'),
  configureIntegrations: t('in-settings:tabs.integrations.configureIntegrations')
};

export default function LogIntegrations() {
  const { goToPath } = useNavigation();
  const isCancelled = useRef(false);

  useEffect(() => {
    getIntegrationsEnabled();

    return () => {
      isCancelled.current = true;
    };
  }, []);

  const [integrations, setIntegrations] = useState<Integration[]>(getIntegrationsSubPages());
  const [loading, setLoading] = useState(true);

  const onClick = (e: any, path: string) => {
    let targetClass = e.target.parentElement.className.baseVal || e.target.parentElement.className;
    if (!targetClass.includes('cds--toggle')) {
      goToPath(path);
    }
  };

  const onToggle = (e: boolean, integration: Integration) => {
    integration.enabled = e;
    let updatedIntegrations = integrations?.map(i => {
      if (i === integration) {
        return { ...i, enabled: e };
      }
      return i;
    });
    setIntegrations(updatedIntegrations);
    const result$ = save(integration);
    result$.once(() => {
      refresh();
      const toastMessage = integration.enabled
        ? t('in-settings:tabs.integrations.integerationEnabled', { integrationType: integration.label })
        : t('in-settings:tabs.integrations.integerationDisabled', { integrationType: integration.label });
      const content = (
        <section className={locals.toast}>
          <Typography variant="heading-200">
            {t('in-settings:tabs.integrations.toastSuccessTitle', { integrationType: integration.label })}
          </Typography>
          <Typography variant="body-regular">{toastMessage}</Typography>
        </section>
      );
      callToastFlyout('success', content);
      getIntegrationsEnabled();
    });
    result$.errors().once((error: any) => {
      const message = t('in-settings:tabs.failedToSaveConfiguration', { err: error.message });
      refresh();
      const content = (
        <section className={locals.toast}>
          <Typography variant="heading-200">{t('in-settings:tabs.integrations.toastErrorTitle')}</Typography>
          <Typography variant="heading-200">
            {t('in-settings:tabs.integrations.integrationConfigurationFailed', { error: message })}
          </Typography>
        </section>
      );
      callToastFlyout('error', content);
      getIntegrationsEnabled();
    });
  };

  const getIntegrationsEnabled = () => {
    const result$ = get();
    let integrations: Integration[] = [];
    result$.once((response: any) => {
      getIntegrationsSubPages().map((integration: Integration) => {
        let obj1 = integration;
        let obj2 = response.find((i: Integration) => i.type === integration.type);
        integrations.push({ ...obj1, ...obj2, isConfigurable: !obj2 });
      });
      if (!isCancelled.current) {
        setIntegrations(integrations);
        setLoading(false);
      }
    });

    result$.errors().once(() => {
      if (!isCancelled.current) {
        setIntegrations(getIntegrationsSubPages());
        setLoading(false);
      }
    });
  };

  return (
    <>
      <section>
        <Title title="Log Integrations" />
        <section className={locals.titleSection}>
          <SubViewHeaderComponent>{localisationStrings.logIntegrations}</SubViewHeaderComponent>
          <Typography variant="body-regular">{localisationStrings.logIntegrationsDescription}</Typography>
        </section>
        <main className={locals.marginRight}>
          <Stack direction="horizontal" gap="large" wrap>
            {integrations &&
              integrations.map((integration: Integration) => {
                return (
                  <div
                    key={`div-${integration.label}`}
                    onClick={e => onClick(e, integration.path)}
                    className={locals.cardDiv}
                  >
                    <Card
                      key={`card-${integration.label}`}
                      headerClassName={locals.cardHeader}
                      title={integration.label}
                      bodyClassName={locals.cardBody}
                      className={locals.card}
                    >
                      <div className={locals.cardFooter}>
                        {loading ? (
                          <LoadingSkeleton className={locals.skeleton} />
                        ) : !integration.baseUrl && !integration.url && integration?.isConfigurable ? (
                          <div className={locals.configureIntegration}>{localisationStrings.configureIntegrations}</div>
                        ) : (
                          <span>
                            <Toggle
                              className={locals.toggle}
                              labelA={
                                !integration.url && !integration.baseUrl
                                  ? localisationStrings.disabled
                                  : localisationStrings.off
                              }
                              labelB={localisationStrings.on}
                              key={`toggle-${integration.label}`}
                              disabled={!integration.url && !integration.baseUrl && !!integration.isConfigurable}
                              onToggle={e => onToggle(e, integration)}
                              checked={integration.enabled ?? false}
                            />{' '}
                          </span>
                        )}
                      </div>
                    </Card>
                  </div>
                );
              })}
          </Stack>
        </main>
      </section>
    </>
  );
}
