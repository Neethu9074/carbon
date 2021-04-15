/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest, just } from '@instana/observables';
import React, { useState, useEffect } from 'react';
import { useObservable } from '@instana/hooks';

import useIsTagFilterFormModelValid from 'in-alerting/smart-alerts/applications/hooks/useIsTagFilterFormModelValid';
import { getEntitySelectionAsTagFilterFormModel } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { maxChartViewTimeframe } from 'in-alerting/components/Chart/chartViewConfig';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import SelectorOverlay from 'in-new-components/SelectorOverlay/SelectorOverlay';
import getApplication from 'in-subscription/application/getApplication';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import getServices from 'in-subscription/application/getServices';
import { isLoading, success } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import Overlay from 'in-new-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/ChartViewConfigurator.mless';

export default function ChartSubEntitySelection({
  applicationId,
  setApplicationId,
  selectApLevelOnly,
  serviceId,
  setServiceId,
  alertConfigWithFormModel,
  queryWindowSize
}) {
  const { applications, boundaryScope, tagFilterExpression } = alertConfigWithFormModel;
  const [serviceName, setServiceName] = useState(null);
  const [query, onQueryChange] = useState('');
  const applicationName = useObservable(
    applicationId ? getApplication({ id: applicationId }).map(({ data }) => data && data.label) : just(null),
    [applicationId]
  );

  useEffect(() => {
    if (selectApLevelOnly) {
      setServiceName(null);
    }
  }, [selectApLevelOnly]);

  // only pass the user-defined part of the query, because the generated part is valid anyways, and the validation
  // would reject the entity-filter anyways, because the user is not allowed to use them
  const isQueryValid = useIsTagFilterFormModelValid(tagFilterExpression);

  const applicationIds = Object.values(applications).map(a => a.applicationId);
  const fetchApps = applicationIds.map(applicationId => {
    if (selectApLevelOnly) {
      return getApplication({ id: applicationId });
    }
    const scopeDownEnrichedTagFilterFormModel = joinExpressions({
      expressions: [
        getEnrichedFiltersForApplication(alertConfigWithFormModel, applicationId),
        getEntitySelectionAsTagFilterFormModel(applications, boundaryScope)
      ]
    });
    return combineLatest([
      getApplication({ id: applicationId }),
      isQueryValid ? getServiceList(queryWindowSize, scopeDownEnrichedTagFilterFormModel) : just(pendingResult)
    ]).map(([app, services]) => {
      if (isLoading(app) || isLoading(services)) return pendingResult;
      return success({
        app: app.data,
        services: services.data?.items
      });
    });
  });

  const applicationList = useObservable(combineLatest(fetchApps), [applications, isQueryValid, selectApLevelOnly]);
  const loading = !applicationList || applicationList?.some(result => isLoading(result));

  const options = loading ? loadingOptions : createOptionsList(applicationList, applicationIds, selectApLevelOnly);

  const loadingOptions = [{ label: t('in-alerting:smartAlerts.components.smartAlertDialog.Loading') }];

  let SelectService = props => {
    return (
      <SelectorOverlay
        {...props}
        onChange={node => {
          if (node.type === 'SERVICE') {
            setServiceName(node.description);
            setServiceId(node.id);
            setApplicationId(node.appId);
          }
          if (node.type === 'APPLICATION' && selectApLevelOnly) {
            // only change AP when in AP-only mode
            setApplicationId(node.id);
          }
          props.close();
        }}
      />
    );
  };

  return (
    <Overlay
      content={SelectService}
      props={{
        query,
        onQueryChange,
        setServiceId,
        options: loading ? loadingOptions : options
      }}
      align="bottomLeft"
      withoutWrapper
    >
      {({ toggle, refSetter }) => (
        <HorizontalFlexWrapper>
          <DropdownButton
            kind="secondary"
            size="compact"
            refSetter={refSetter}
            onClick={toggle}
            className={locals.labelWithGap}
          >
            {selectApLevelOnly
              ? t('in-alerting:smartAlerts.components.smartAlertDialog.PreviewForAP')
              : t('in-alerting:smartAlerts.components.smartAlertDialog.PreviewForService')}
          </DropdownButton>
          <ApplicationScopePath
            applicationName={applicationName ?? applicationId}
            applicationId={applicationId}
            serviceId={serviceId}
            serviceName={serviceName}
            noBottomMargin
          />
        </HorizontalFlexWrapper>
      )}
    </Overlay>
  );
}

function getEnrichedFiltersForApplication(alertConfigWithFormModel, applicationId, serviceId) {
  const blueprintConfig = getBlueprintConfig(alertConfigWithFormModel.rule.alertType);

  return joinExpressions({
    expressions: [
      // don't define the subEntityId to get the results of all services in scope
      blueprintConfig.getEntityTagFilterFormModel(alertConfigWithFormModel, applicationId, null, serviceId),
      // only use the user-defined filters, but not the rule-specific filters, to not exclude services that might not
      // match any call at the moment, but could do so in the future. Thus the user should be able to select them.
      alertConfigWithFormModel.tagFilterExpression
    ]
  });
}

function getServiceList(queryWindowSize, enrichedTagFilterFormModel) {
  return getServices({
    pagination: {
      page: 1,
      pageSize: 100
    },
    order: {
      by: 'serviceLabel',
      direction: 'ASC'
    },
    metrics: {},
    filter: {
      timeConfig: {
        windowSize: maxChartViewTimeframe
      }
    },
    tagFilterExpression: enrichedTagFilterFormModel && toBackendQueryModel(enrichedTagFilterFormModel),
    contextScope: 'NONE'
  });
}

function createOptionsList(applicationList, applicationIds, selectApLevelOnly) {
  if (applicationIds.length === 0) return [];

  if (selectApLevelOnly) {
    return applicationList
      .filter(result => Boolean(result.data))
      .map(({ data }) => data)
      .map(({ id, label }) => {
        return {
          label: label,
          id: id,
          icon: 'lib_application',
          type: 'APPLICATION'
        };
      });
  }

  if (applicationIds.length === 1) {
    const apWithServiceData = applicationList.map(({ data }) => data)[0];
    return mapServicesToOptions(apWithServiceData);
  }

  return [
    {
      label: 'Applications:',
      children: applicationList
        .filter(result => Boolean(result.data))
        .map(({ data }) => data)
        .filter(data => Boolean(data.app))
        .map(({ app, services }) => ({
          breadcrumbAndLabel: app.label,
          value: app.id,
          label: app.label, // visible as a header on next level
          icon: 'lib_application',
          type: 'APPLICATION',
          children: services?.map(({ service }) => ({
            appId: app.id,
            id: service.id,
            description: service.label,
            breadcrumbAndLabel: app.label, // in search result
            // DECIDE label: service.label, // looks better, more dark, but not searchable
            value: service.label,
            type: 'SERVICE',
            icon: 'lib_application_service'
          }))
        }))
    }
  ];
}

function mapServicesToOptions(app0) {
  return app0.services?.map(({ service }) => ({
    appId: app0.app.id,
    id: service.id,
    description: service.label,
    breadcrumbAndLabel: app0.app.label, // in search result
    // DECIDE label: service.label, // looks better, more dark, but not searchable
    value: service.label,
    type: 'SERVICE',
    icon: 'lib_application_service'
  }));
}
