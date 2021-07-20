/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, useEffect, useMemo } from 'react';

import useApplicationsAndServicesSubscriptions from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/useApplicationsAndServicesSubscriptions';
import {
  getLevel,
  searchResultsToListItems
} from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/searchResults';
import {
  createOptionsList,
  loadingOptions
} from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/createOptions';
import getAppDataEntityChainsPaginated from 'in-alerting/smart-alerts/applications/subscriptions/getAppDataEntityChainsPaginated';
import { EntitySelectionOverlay } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/EntitySelectionOverlay';
import { PER_AP_SERVICE } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { getEntitySelectionAsTagFilterFormModel } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import DropdownButton from 'in-components/Button/DropdownButton';
import useCursorPagination from 'in-hooks/useCursorPagination';
import Overlay from 'in-components/overlays/Overlay';
import { isLoading } from 'in-services/util/result';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/ChartViewConfigurator.mless';

/*
  This could be adjusted when needed, short discussion we had, see this comment
  https://github.com/instana/ui-client/pull/6425#discussion_r641316497
 */
const maxSearchRetrievalSize = 200;

export default function ServiceOrEndpointSelection({
  setApplicationId,
  setServiceId,
  setEndpointId,
  alertConfigWithFormModel,
  queryWindowSize
}) {
  const [timeTo] = useState(Date.now()); // similar to S/E: have a "fixed current date"
  const timeConfig = {
    windowSize: queryWindowSize,
    to: timeTo,
    focusedMoment: timeTo
  };

  const {
    applications,
    boundaryScope,
    evaluationType,
    tagFilterExpression,
    includeInternal,
    includeSynthetic
  } = alertConfigWithFormModel;

  const [query, onQueryChange] = useState('');

  const isQuery = !isBlank(query);
  const isSelectServiceLevel = evaluationType === PER_AP_SERVICE;

  const [endpointName, setEndpointName] = useState();
  const [serviceName, setServiceName] = useState();

  useEffect(() => {
    // reset on first rendering or evaluation type change
    // apId is currently set automatically in parent
    setServiceName(null);
    setServiceId?.(null);
    setEndpointName(null);
    setEndpointId?.(null);
    // ignore any change to the setter functions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelectServiceLevel, applications]);

  const applicationIds = Object.keys(applications);

  const applicationAndServicesList = useApplicationsAndServicesSubscriptions({
    applicationIds,
    alertConfigWithFormModel,
    queryWindowSize
  });
  const loading = !applicationAndServicesList || applicationAndServicesList.some(result => isLoading(result));

  const options = useMemo(
    () => {
      return loading || query
        ? loadingOptions
        : createOptionsList(
            applicationAndServicesList,
            applicationIds,
            false,
            isSelectServiceLevel,
            applications,
            timeConfig,
            tagFilterExpression,
            boundaryScope,
            includeSynthetic
          );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      query,
      loading,
      applicationAndServicesList,
      queryWindowSize,
      tagFilterExpression,
      includeSynthetic,
      applications,
      boundaryScope,
      isSelectServiceLevel
    ]
    // applicationIds will already be tracked with applicationAndServicesList
    // timeConfig is depending on queryWindowSize
    // do not watch loadingOptions intentionally, because it is constant
  );

  const queryEntity = ({ cursor }) => {
    if (!isQuery) {
      return null;
    }

    const queryTagFilterExpression = toBackendQueryModel(
      joinExpressions({
        expressions: [tagFilterExpression, getEntitySelectionAsTagFilterFormModel(applications, boundaryScope)]
      })
    );

    return getAppDataEntityChainsPaginated({
      level: getLevel(evaluationType),
      pagination: {
        cursor,
        retrievalSize: maxSearchRetrievalSize
      },
      includeSynthetic,
      includeInternal,
      tagFilterExpression: queryTagFilterExpression,
      searchTerm: query,
      timeConfig,
      order: {
        by: 'applicationName',
        direction: 'DESC'
      }
    });
  };

  const searchResult = useCursorPagination(queryEntity, [query, evaluationType]);
  const isSearchLoading = !searchResult || isLoading(searchResult);
  const queryOptions = isSearchLoading ? loadingOptions : searchResultsToListItems(searchResult, evaluationType, query);

  return (
    <Overlay
      content={EntitySelectionOverlay}
      onCloseSideEffect={() => onQueryChange('')}
      props={{
        query,
        onQueryChange,
        setApplicationId,
        setServiceId,
        setServiceName,
        setEndpointId,
        setEndpointName,
        isSelectServiceLevel,
        options: isQuery ? queryOptions : options
      }}
      align="bottomLeft"
      withoutWrapper
    >
      {({ toggle, refSetter, isOpen }) => (
        <HorizontalFlexWrapper>
          <DropdownButton
            kind="secondary"
            size="compact"
            refSetter={refSetter}
            onClick={toggle}
            expanded={isOpen}
            className={locals.labelWithGap}
            disabled={applicationIds.length === 0}
          >
            <DropDownButtonLabel isServiceLevel={isSelectServiceLevel} />
          </DropdownButton>
          <ApplicationScopePath
            serviceName={isSelectServiceLevel && serviceName}
            endpointName={endpointName}
            noBottomMargin
          />
        </HorizontalFlexWrapper>
      )}
    </Overlay>
  );
}

function DropDownButtonLabel({ isServiceLevel }) {
  if (isServiceLevel) {
    return t('in-alerting:smartAlerts.components.smartAlertDialog.PreviewForService');
  }
  return t('in-alerting:smartAlerts.components.smartAlertDialog.PreviewForEndpoint');
}
