/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useRef, useState } from 'react';

import { Button, Card, LoadingSkeleton, Stack, Toggle, Typography } from '@instana/components';

import {
  callToastFlyout,
  getIntegrationsSubPages
} from 'in-settings/tabs/GlobalSettings/pages/integrations/database/Integrations/utils';
import { Integration, Variant } from 'in-settings/tabs/GlobalSettings/pages/integrations/database/types';
import { getDbIntegrations, saveDbIntegration } from 'in-integrations/database/api';
import SubViewHeaderComponent from 'in-settings/components/SubViewHeader';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Title from 'in-components/Title/Title';
import { t } from 'in-i18n';

import locals from './DbIntegrations.mless';

const localisationStrings = {
  dbIntegrations: t('in-settings:tabs.team.integrations.database.dbIntegrations'),
  dbIntegrationsTooltip: t('in-settings:tabs.team.integrations.database.dbIntegrationsTooltip'),
  dbIntegrationsDescription: t('in-settings:tabs.team.integrations.database.dbIntegrationsDescription'),
  dbIntegrationsTooltipApiError: t('in-settings:tabs.team.integrations.database.dbIntegrationsTooltipApiError'),
  configureIntegration: t('in-settings:tabs.team.integrations.configureIntegration'),
  disabled: t('in-settings:tabs.integrations.disabled'),
  on: t('in-settings:tabs.integrations.on'),
  off: t('in-settings:tabs.integrations.off'),
  successTitle: t('in-settings:tabs.integrations.toastSuccessTitle'),
  toggleSuccessMessage: (integration: Integration) =>
    integration.enabled
      ? t('in-settings:tabs.integrations.integerationEnabled', { integrationType: integration.label })
      : t('in-settings:tabs.integrations.integerationDisabled', { integrationType: integration.label }),
  errorTitle: t('in-settings:tabs.integrations.toastErrorTitle'),
  toggleErrorMessage: (integrationType: string) =>
    t('in-settings:tabs.integrations.toastErrorMessage', { integrationType })
};

const toastContent = (variant: Variant, integration: Integration) => {
  const title = variant === 'success' ? localisationStrings.successTitle : localisationStrings.errorTitle;
  const message =
    variant === 'success'
      ? localisationStrings.toggleSuccessMessage(integration)
      : localisationStrings.toggleErrorMessage(integration.label);

  return { title, message };
};

export default function DbIntegrations() {
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
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);

  const onClick = (e: any, path: string) => {
    let targetClass = e.target.parentElement.className.baseVal || e.target.parentElement.className;
    if (!targetClass.includes('cds--toggle')) {
      goToPath(path);
    }
  };

  const onToggle = (e: boolean, integration: Integration) => {
    integration.enabled = e;
    const updatedIntegrations = integrations?.map(i => {
      if (i === integration) {
        return { ...i, enabled: e };
      }
      return i;
    });
    setIntegrations(updatedIntegrations);

    const result$ = saveDbIntegration(integration);
    result$.once(() => {
      const { title, message } = toastContent('success', integration);
      callToastFlyout('success', title, message);
      getIntegrationsEnabled();
    });
    result$.errors().once(() => {
      const { title, message } = toastContent('error', integration);
      callToastFlyout('error', title, message);
      getIntegrationsEnabled();
    });
  };

  const getIntegrationsEnabled = () => {
    const result$ = getDbIntegrations();
    const integrations: Integration[] = [];

    result$.once((response: Integration[]) => {
      // merge Frontend and Backend objects to one.
      getIntegrationsSubPages().forEach((integration: Integration) => {
        let obj1 = integration;
        let obj2 = response.find((i: Integration) => i.type === integration.type);
        integrations.push({ ...obj1, ...obj2 });
      });
      if (!isCancelled.current) {
        setIntegrations(integrations);
        setLoading(false);
      }
    });

    result$.errors().once(() => {
      if (!isCancelled.current) {
        setIntegrations(getIntegrationsSubPages());
        setTooltipMessage(localisationStrings.dbIntegrationsTooltipApiError);
        setLoading(false);
      }
    });
  };

  return (
    <section>
      <Title title={localisationStrings.dbIntegrations} />
      <section className={locals.titleSection}>
        <SubViewHeaderComponent>{localisationStrings.dbIntegrations}</SubViewHeaderComponent>
        <Typography variant="body-regular">{localisationStrings.dbIntegrationsDescription}</Typography>
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
                      ) : !integration.url ? (
                        <Button
                          kind="subtle"
                          size="xl"
                          onClick={() => goToPath(integration.path)}
                          className={locals.cardButton}
                        >
                          {localisationStrings.configureIntegration}
                        </Button>
                      ) : (
                        <Tooltip content={tooltipMessage} align="bottomMiddle">
                          <Toggle
                            className={locals.toggle}
                            labelA={!integration.url ? localisationStrings.disabled : localisationStrings.off}
                            labelB={localisationStrings.on}
                            key={`toggle-${integration.label}`}
                            disabled={!integration.url}
                            onToggle={e => onToggle(e, integration)}
                            checked={integration.enabled ?? false}
                          />
                        </Tooltip>
                      )}
                    </div>
                  </Card>
                </div>
              );
            })}
        </Stack>
      </main>
    </section>
  );
}
