/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  EventSpecificationInfo,
  ServiceLevelsAlertConfigWithMetadata,
  SyntheticAlertConfigWithMetadata,
  TriggerType
} from '@instana/types';
import { CarbonFormGroup, Spacer } from '@instana/components';

import {
  ApplicationSmartAlertConfigWithMetadata,
  GlobalApplicationsSmartAlertConfigWithMetadata
} from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import {
  MobileAppSmartAlertConfigWithMetadata,
  WebsiteSmartAlertConfigWithMetadata
} from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import ListEntityNameColumn from 'in-alerting/smart-alerts/applications/list/columns/ListEntityNameColumn';
import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import ListFilterColumn from 'in-alerting/smart-alerts/applications/list/columns/ListFiltersColumn';
import { EntityType } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/Events';
import useMobileAppLabel from 'in-alerting/smart-alerts/mobileApp/hooks/useMobileAppLabel';
import SyntheticsScopeColumn from 'in-alerting/smart-alerts/synthetics/lists/ScopeColumn';
import { TriggerSpecification, isGlobalApplicationSmartAlert } from 'in-automation/types';
import InfraScopeColumn from 'in-alerting/smart-alerts/infrastructure/lists/ScopeColumn';
import MobileAppScopeColumn from 'in-alerting/smart-alerts/mobileApp/lists/ScopeColumn';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import useWebsiteLabel from 'in-alerting/smart-alerts/websites/hooks/useWebsiteLabel';
import WebsiteScopeColumn from 'in-alerting/smart-alerts/websites/list/ScopeColumn';
import SloAppliedColumn from 'in-alerting/smart-alerts/slo/list/SloAppliedColumn';
import DefaultCell from 'in-alerting/smart-alerts/components/list/DefaultCell';
import LogScopeColumn from 'in-alerting/smart-alerts/logs/lists/ScopeColumn';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { t } from 'in-i18n';

interface TriggerTypeFieldProps {
  trigger: TriggerSpecification;
  type: TriggerType;
}

export function TriggerTypeField({ trigger, type }: TriggerTypeFieldProps) {
  const fields = {
    applicationSmartAlert: {
      label: t('in-automation:policies.filterApplied'),
      component: (
        <AppFilterApplied
          item={trigger as ApplicationSmartAlertConfigWithMetadata | GlobalApplicationsSmartAlertConfigWithMetadata}
        />
      )
    },
    globalApplicationSmartAlert: {
      label: t('in-automation:policies.filterApplied'),
      component: (
        <AppFilterApplied
          item={trigger as ApplicationSmartAlertConfigWithMetadata | GlobalApplicationsSmartAlertConfigWithMetadata}
        />
      )
    },
    websiteSmartAlert: {
      label: t('in-automation:policies.filterApplied'),
      component: <WebsiteFilterApplied item={trigger as WebsiteSmartAlertConfigWithMetadata} />
    },
    mobileAppSmartAlert: {
      label: t('in-automation:policies.filterApplied'),
      component: <MobileAppFilterApplied item={trigger as MobileAppSmartAlertConfigWithMetadata} />
    },
    infraSmartAlert: {
      label: t('in-automation:policies.filterApplied'),
      component: <InfraScopeColumn config={trigger as InfraSmartAlertConfigWithMetadata} />
    },
    syntheticsSmartAlert: {
      label: t('in-synthetics:dashboard.alertList.filterApplied'),
      component: <SyntheticFilterApplied item={trigger as SyntheticAlertConfigWithMetadata} />
    },
    logSmartAlert: {
      label: t('in-automation:policies.filterApplied'),
      component: <LogScopeColumn config={trigger as LogSmartAlertConfigWithMetadata} />
    },
    sloSmartAlert: {
      label: t('in-automation:policies.filterApplied'),
      component: <SloAppliedColumn config={trigger as ServiceLevelsAlertConfigWithMetadata} />
    },
    builtinEvent: {
      label: t('in-automation:policies.entityType'),
      component: <EntityType entity={trigger as EventSpecificationInfo} />
    },
    customEvent: {
      label: t('in-automation:policies.entityType'),
      component: <EntityType entity={trigger as EventSpecificationInfo} />
    }
  };
  return <CarbonFormGroup legendText={fields[type].label}>{type && fields[type].component}</CarbonFormGroup>;
}

function AppFilterApplied({
  item
}: {
  item: ApplicationSmartAlertConfigWithMetadata | GlobalApplicationsSmartAlertConfigWithMetadata;
}) {
  const { tagFilterExpression, rule, threshold, applications } = item;
  const backendModelTagFilterExpression = fromBackendModel(tagFilterExpression);
  const isGlobalSmartAlertConfig = isGlobalApplicationSmartAlert(item);
  return (
    <HorizontalFlexWrapper>
      <ListEntityNameColumn applications={applications} isGlobalSmartAlertConfig={isGlobalSmartAlertConfig} />
      <Spacer horizontal="small" />
      {backendModelTagFilterExpression.length > 0 && (
        <ListFilterColumn tagFilterExpression={backendModelTagFilterExpression} rule={rule} threshold={threshold} />
      )}
    </HorizontalFlexWrapper>
  );
}

function WebsiteFilterApplied({ item }: { item: WebsiteSmartAlertConfigWithMetadata }) {
  const websiteLabel = useWebsiteLabel(item.websiteId);
  if (!websiteLabel) return <LoadingIndicator size="s" />;
  return <WebsiteScopeColumn config={item} websiteLabel={websiteLabel} />;
}

function MobileAppFilterApplied({ item }: { item: MobileAppSmartAlertConfigWithMetadata }) {
  const mobileAppLabel = useMobileAppLabel(item.mobileAppId);
  if (!mobileAppLabel) return <LoadingIndicator size="s" />;
  return <MobileAppScopeColumn config={item} mobileAppLabel={mobileAppLabel} />;
}

function SyntheticFilterApplied({ item }: { item: SyntheticAlertConfigWithMetadata }) {
  return (
    <HorizontalFlexWrapper>
      <DefaultCell
        title={t('in-synthetics:dashboard.alertList.testsCount', {
          testsCount: item.syntheticTestIds.length
        })}
        subtitle={t('in-synthetics:dashboard.alertList.testsApplied')}
      />
      <Spacer horizontal="small" />
      <SyntheticsScopeColumn config={item} />
    </HorizontalFlexWrapper>
  );
}
