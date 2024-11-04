/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Result, CustomPayloadConfigurationWithLastUpdated, CustomPayloadContext } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { GlobalTagBasedPayloadConfigurator } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/GlobalCustomPayloadPage';
import { getGlobalCustomPayloadAsResultObservable } from 'in-settings/tabs/GlobalSettings/api/customPayload';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import CustomPayloadCard from 'in-alerting/smart-alerts/components/details/CustomPayloadCard';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import IconLabel from 'in-alerting/components/IconLabel';
import { t } from 'in-i18n';

export default function GlobalCustomPayloadCard({ context = 'ALL' }: { context?: CustomPayloadContext }) {
  const globalCustomPayloads: Result<CustomPayloadConfigurationWithLastUpdated> =
    useObservable(() => getGlobalCustomPayloadAsResultObservable(context), [context]) ?? pendingResult;

  const loading = isLoading(globalCustomPayloads);
  const hasErrors = hasError(globalCustomPayloads);

  if (loading || hasErrors) {
    return (
      <ExpandableLightCard
        title={t('in-alerting:components.customPayload.globalCustomPayload')}
        openByDefault={hasErrors}
        darkFrame
      >
        {loading && <LoadingIndicator size={'s'} />}
        {hasErrors && (
          <IconLabel
            type={'lib_help_error_info_outline'}
            text={t('in-alerting:components.customPayload.globalCustomPayloadRetrieveFailed')}
          />
        )}
      </ExpandableLightCard>
    );
  }

  return (
    <CustomPayloadCard
      title={t('in-alerting:components.customPayload.globalCustomPayloadTitle', {
        count: globalCustomPayloads?.data?.fields?.length
      })}
      customPayloadFields={globalCustomPayloads?.data?.fields ?? []}
      TagBasedPayloadConfigurator={GlobalTagBasedPayloadConfigurator}
      noCustomPayloadConfiguredText={t('in-alerting:components.customPayload.noGlobalCustomPayloadConfigured')}
      alternatingBg
    />
  );
}
