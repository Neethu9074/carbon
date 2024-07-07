/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useRef, useState } from 'react';

import { Card, LoadingSkeleton, Stack, Toggle, Typography } from '@instana/components';

import {
  getIntegrationsSubPages,
  Integration,
  Variant
} from 'in-settings/tabs/TeamSettings/pages/logManagement/Integrations/utils';
// @ts-ignore
import { refresh } from 'in-integrations/logging/configurationsStore';
import SubViewHeaderComponent from 'in-settings/components/SubViewHeader';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
// @ts-ignore
import { get, save } from 'in-integrations/logging/api';
import SectionLine from 'in-settings/components/SectionLine';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Title from 'in-components/Title/Title';
import { t } from 'in-i18n';

import locals from './Integrations.mless';

const localisationStrings = {
  logIntegrations: t('in-settings:tabs.integrations.integrations'),
  integrationsTooltip: t('in-settings:tabs.integrations.integrationsTooltip'),
  logIntegrationsDescription: t('in-settings:tabs.integrations.integrationsDescription'),
  integrationsTooltipApiError: t('in-settings:tabs.integrations.integrationsTooltipApiError'),
  disabled: t('in-settings:tabs.integrations.disabled'),
  on: t('in-settings:tabs.integrations.on'),
  off: t('in-settings:tabs.integrations.off'),
  successTitle: t('in-settings:tabs.integrations.toastSuccessTitle'),
  errorTitle: t('in-settings:tabs.integrations.toastErrorTitle')
};

export default function Integrations() {
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
  const [TooltipMessage, setTooltipMessage] = useState(localisationStrings.integrationsTooltip);

  const onClick = (e: any, path: string) => {
    let targetClass = e.target.parentElement.className.baseVal || e.target.parentElement.className;
    if (!targetClass.includes('cds--toggle')) {
      goToPath(path);
    }
  };

  const callToastFlyout = (variant: Variant, instanceName: string) => {
    const toastMessage = {
      successMessage: t('in-settings:tabs.integrations.toastSuccessMessage', { instanceName }),
      errorMessage: t('in-settings:tabs.integrations.toastErrorMessage', { instanceName })
    };
    addMessage({
      type: variant === 'success' ? 'info' : 'danger',
      icon: 'lib_help_error_info_outline',
      content: (
        <section className={locals.toast}>
          <Typography variant="heading-200">{localisationStrings[`${variant}Title`]}</Typography>
          <Typography variant="body-regular">{toastMessage[`${variant}Message`]}</Typography>
        </section>
      ),
      timeout: 5000
    });
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
      callToastFlyout('success', integration.label);
      getIntegrationsEnabled();
    });
    result$.errors().once(() => {
      refresh();
      callToastFlyout('error', integration.label);
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
        setTooltipMessage(localisationStrings.integrationsTooltipApiError);
        setLoading(false);
      }
    });
  };

  return (
    <>
      <section>
        <Title title="Log Integrations" />
        <section>
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
                        <SectionLine />
                        {loading ? (
                          <LoadingSkeleton className={locals.skeleton} />
                        ) : (
                          <Tooltip
                            content={!integration.url && !integration.baseUrl && TooltipMessage}
                            align="bottomMiddle"
                          >
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
                                disabled={!integration.url && !integration.baseUrl}
                                onToggle={e => onToggle(e, integration)}
                                checked={integration.enabled ?? false}
                              />{' '}
                            </span>
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
    </>
  );
}
