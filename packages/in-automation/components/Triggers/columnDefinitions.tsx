/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  EventSpecificationInfo,
  LogAlertConfigWithMetadata,
  MobileAppAlertConfigWithMetadata,
  ServiceLevelsAlertConfigWithMetadata,
  SyntheticAlertConfigWithMetadata,
  WebsiteAlertConfigWithMetadata
} from '@instana/types';
import { Spacer, Typography } from '@instana/components';

import {
  TriggerSpecification,
  isApplicationSmartAlert,
  isEventSpecification,
  isGlobalApplicationSmartAlert,
  isInfraSmartAlert,
  isMobileAppSmartAlert,
  isSloSmartAlert,
  isSyntheticsSmartAlert,
  isWebsiteSmartAlert
} from 'in-automation/types';
import {
  ApplicationSmartAlertConfigWithMetadata,
  GlobalApplicationsSmartAlertConfigWithMetadata
} from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { replaceTitlePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { SimpleListNameColumn } from 'in-alerting/smart-alerts/applications/list/columns/SimpleListNameColumn';
import ListEntityNameColumn from 'in-alerting/smart-alerts/applications/list/columns/ListEntityNameColumn';
import { EntityType, EventName } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/Events';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import ListFilterColumn from 'in-alerting/smart-alerts/applications/list/columns/ListFiltersColumn';
import { getSubtitle as getSubtitleInfra } from 'in-alerting/smart-alerts/infrastructure/Alerts';
import { getSubtitle as getSubtitleMobileApp } from 'in-alerting/smart-alerts/mobileApp/Alerts';
import { getSubtitle as getSubtitleWebsite } from 'in-alerting/smart-alerts/websites/Alerts';
import useMobileAppLabel from 'in-alerting/smart-alerts/mobileApp/hooks/useMobileAppLabel';
import SyntheticsScopeColumn from 'in-alerting/smart-alerts/synthetics/lists/ScopeColumn';
import { NameColumnCell } from 'in-alerting/smart-alerts/components/list/NameColumnCell';
import InfraScopeColumn from 'in-alerting/smart-alerts/infrastructure/lists/ScopeColumn';
import MobileAppScopeColumn from 'in-alerting/smart-alerts/mobileApp/lists/ScopeColumn';
import FourLineWrapper from 'in-automation/components/FourLineWrapper/FourLineWrapper';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import useWebsiteLabel from 'in-alerting/smart-alerts/websites/hooks/useWebsiteLabel';
import { getSubtitle as getSubtitleLog } from 'in-alerting/smart-alerts/logs/Alerts';
import WebsiteScopeColumn from 'in-alerting/smart-alerts/websites/list/ScopeColumn';
import SloAppliedColumn from 'in-alerting/smart-alerts/slo/list/SloAppliedColumn';
import DefaultCell from 'in-alerting/smart-alerts/components/list/DefaultCell';
import LogScopeColumn from 'in-alerting/smart-alerts/logs/lists/ScopeColumn';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { t } from 'in-i18n';

export const triggerNameColumn: ColumnDefinition<TriggerSpecification> = {
  id: 'name',
  label: t('in-automation:name'),
  getContent: item => {
    if (isWebsiteSmartAlert(item)) {
      return <NameColumnCell config={item} getSubtitle={config => getSubtitleWebsite(config.rule, config.threshold)} />;
    }
    if (isApplicationSmartAlert(item)) {
      return <SimpleListNameColumn config={item} />;
    }
    if (isMobileAppSmartAlert(item)) {
      return (
        <NameColumnCell config={item} getSubtitle={config => getSubtitleMobileApp(config.rule, config.threshold)} />
      );
    }
    if (isGlobalApplicationSmartAlert(item)) {
      return <SimpleListNameColumn config={item} />;
    }
    if (isSyntheticsSmartAlert(item)) {
      return (
        <NameColumnCell
          config={item}
          getSubtitle={() => t('in-alerting:smartAlerts.synthetics.alertList.numberOfFailures')}
          renderName={config => replaceTitlePlaceholdersWithMarkup(config.name)}
        />
      );
    }
    if (isInfraSmartAlert(item)) {
      return (
        <NameColumnCell
          config={item}
          getSubtitle={config => getSubtitleInfra(config.rule, config.threshold, config.predictiveTrigger)}
        />
      );
    }
    if (isSloSmartAlert(item)) {
      <NameColumnCell config={item} />;
    }
    if (isEventSpecification(item)) {
      return <EventName hasRowNavigation={false} entity={item} />;
    }

    return <NameColumnCell config={item} getSubtitle={config => getSubtitleLog(config.threshold)} />;
  },
  width: 25
};

export const triggerDescriptionColumn: ColumnDefinition<TriggerSpecification> = {
  id: 'description',
  label: t('in-automation:description'),
  getContent: item => (
    <FourLineWrapper>
      <Typography variant="body-regular">{item.description}</Typography>
    </FourLineWrapper>
  ),
  width: 25
};

export const appFilterAppliedColumn: ColumnDefinition<
  ApplicationSmartAlertConfigWithMetadata | GlobalApplicationsSmartAlertConfigWithMetadata
> = {
  id: 'filterApplied',
  label: t('in-automation:policies.filterApplied'),
  getContent: item => {
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
  },
  ellipsis: true,
  sortable: false
};

export const websiteFilterAppliedColumn: ColumnDefinition<WebsiteAlertConfigWithMetadata> = {
  id: 'filterApplied',
  label: t('in-automation:policies.filterApplied'),
  getContent: function Content(item) {
    const websiteLabel = useWebsiteLabel(item.websiteId);
    if (!websiteLabel) return <LoadingIndicator size="s" />;
    return <WebsiteScopeColumn config={item} websiteLabel={websiteLabel} />;
  },
  ellipsis: true,
  sortable: false
};

export const mobileAppFilterAppliedColumn: ColumnDefinition<MobileAppAlertConfigWithMetadata> = {
  id: 'filterApplied',
  label: t('in-automation:policies.filterApplied'),
  getContent: function Content(item) {
    const mobileAppLabel = useMobileAppLabel(item.mobileAppId);
    if (!mobileAppLabel) return <LoadingIndicator size="s" />;
    return <MobileAppScopeColumn config={item} mobileAppLabel={mobileAppLabel} />;
  },
  ellipsis: true,
  sortable: false
};

export const infraFilterAppliedColumn: ColumnDefinition<InfraSmartAlertConfigWithMetadata> = {
  id: 'filterApplied',
  label: t('in-automation:policies.filterApplied'),
  getContent: item => <InfraScopeColumn config={item} />,
  ellipsis: true,
  sortable: false
};

export const syntheticFilterAppliedColumn: ColumnDefinition<SyntheticAlertConfigWithMetadata> = {
  id: 'filterApplied',
  label: t('in-synthetics:dashboard.alertList.filterApplied'),
  getContent: item => (
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
  ),
  ellipsis: true,
  sortable: false
};

export const logsFilterAppliedColumn: ColumnDefinition<LogAlertConfigWithMetadata> = {
  id: 'filterApplied',
  label: t('in-automation:policies.filterApplied'),
  getContent: item => <LogScopeColumn config={item} />,
  ellipsis: true,
  sortable: false
};

export const sloFilterAppliedColumn: ColumnDefinition<ServiceLevelsAlertConfigWithMetadata> = {
  id: 'filterApplied',
  label: t('in-automation:policies.filterApplied'),
  getContent: item => <SloAppliedColumn config={item} />,
  ellipsis: true,
  sortable: false
};

export const entityTypeColumn: ColumnDefinition<EventSpecificationInfo> = {
  id: 'entityType',
  label: t('in-automation:policies.entityType'),
  getContent: item => <EntityType entity={item} />,
  ellipsis: true,
  sortable: false
};
