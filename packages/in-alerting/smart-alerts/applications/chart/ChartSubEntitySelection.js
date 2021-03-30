/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import useIsTagFilterFormModelValid from 'in-alerting/smart-alerts/applications/hooks/useIsTagFilterFormModelValid';
import { getEntitySelectionAsTagFilterFormModel } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import SelectorOverlay from 'in-new-components/SelectorOverlay/SelectorOverlay';
import getApplication from 'in-subscription/application/getApplication';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import getServices from 'in-subscription/application/getServices';
import { pendingResult } from 'in-services/fixedObjects';
import Overlay from 'in-new-components/overlays/Overlay';
import { isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/ChartViewConfigurator.mless';

/*
 * @param setServiceId () -> returns the selected service
 */
export default function ChartSubEntitySelection({
  applicationId,
  serviceId,
  setServiceId,
  alertConfigWithFormModel,
  queryWindowSize
}) {
  const [serviceName, setServiceName] = useState(null);

  // only pass the user-defined part of the query, because the generated part is valid anyways, and the validation
  // would reject the entity-filter anyways, because the user is not allowed to use them
  const isQueryValid = useIsTagFilterFormModelValid(alertConfigWithFormModel.tagFilterExpression);

  const applicationName = useObservable(
    applicationId ? getApplication({ id: applicationId }).map(({ data }) => data && data.label) : just(null),
    [applicationId]
  );

  const scopeDownEnrichedTagFilterFormModel = useMemo(
    () =>
      joinExpressions({
        expressions: [
          getEnrichedFiltersForApplication(alertConfigWithFormModel, applicationId),
          getEntitySelectionAsTagFilterFormModel(
            alertConfigWithFormModel.applications,
            alertConfigWithFormModel.boundaryScope
          )
        ]
      }),
    [
      alertConfigWithFormModel,
      applicationId,
      alertConfigWithFormModel.applications,
      alertConfigWithFormModel.boundaryScope,
      alertConfigWithFormModel.tagFilterExpression
    ]
  );

  const result =
    useServiceList(
      queryWindowSize,
      isQueryValid,
      alertConfigWithFormModel.tagFilterExpression,
      scopeDownEnrichedTagFilterFormModel
    ) ?? pendingResult;

  const options = applicationId
    ? result.data?.items?.map(({ service }) => ({
        label: service.label,
        breadcrumbAndLabel: service.label,
        value: service.id,
        icon: 'lib_application_service'
      }))
    : [];

  useEffect(() => {
    if (options) {
      if (!serviceId && options.length > 0) {
        // select first option by default
        setServiceName(options[0].label);
        setServiceId(options[0].value);
      } else if (serviceId && !options.some(option => option.value === serviceId)) {
        // unset selection if the current one is out of scope
        setServiceName(t('in-alerting:smartAlerts.components.smartAlertDialog.NoServiceInScope'));
        setServiceId(null);
      }
    }
  }, [options, serviceId]);

  const loadingOptions = [{ label: t('in-alerting:smartAlerts.components.smartAlertDialog.Loading') }];

  let SelectService = props => {
    return (
      <SelectorOverlay
        {...props}
        onChange={node => {
          setServiceName(node.label);
          props.setServiceId(node.value);
          props.close();
        }}
      />
    );
  };

  return (
    <Overlay
      content={SelectService}
      props={{
        setServiceId,
        options: isLoading(result) ? loadingOptions : options
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
            {t('in-alerting:smartAlerts.components.smartAlertDialog.PreviewForService')}
          </DropdownButton>
          <ApplicationScopePath
            applicationName={applicationName}
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

function useServiceList(queryWindowSize, isQueryValid, tagFilterFormModel, enrichedTagFilterFormModel) {
  return useObservable(
    ([queryWindowSize, isQueryValid]) => {
      if (!isQueryValid) {
        return just(pendingResult);
      }

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
            windowSize: queryWindowSize
          }
        },
        tagFilterExpression: enrichedTagFilterFormModel && toBackendQueryModel(enrichedTagFilterFormModel),
        contextScope: 'NONE'
      });
    },
    [queryWindowSize, isQueryValid, tagFilterFormModel, enrichedTagFilterFormModel]
  );
}
