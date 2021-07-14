/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect, useMemo } from 'react';

import { useObservable } from '@instana/hooks';
import { empty } from '@instana/observables';

import useApplicationsAndServicesSubscriptions from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/useApplicationsAndServicesSubscriptions';
import ThreeLevelsSelectorOverlay from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/ThreeLevelsSelectorOverlay';
import {
  PER_AP,
  PER_AP_SERVICE
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import getAppDataEntityChainsPaginated from 'in-alerting/smart-alerts/applications/subscriptions/getAppDataEntityChainsPaginated';
import {
  getLevel,
  searchResultsToListItems
} from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/search';
import { createOptionsList } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/createOptions';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import getApplication from 'in-subscription/application/getApplication';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import DropdownButton from 'in-components/Button/DropdownButton';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { pendingResult } from 'in-services/fixedObjects';
import Overlay from 'in-components/overlays/Overlay';
import { isLoading } from 'in-services/util/result';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/ChartViewConfigurator.mless';

const loadingOptions = [
  { label: t('in-alerting:smartAlerts.components.smartAlertDialog.Loading'), loadChildren: () => pendingResult }
];

/*
  This could be adjusted when needed, short discussion we had, see this comment
 https://github.com/instana/ui-client/pull/6425/files#r641383176
 */
const maxSearchRetrievalSize = 200;

export default function ChartSubEntitySelection({
  applicationId,
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
    includeSynthetic
  } = alertConfigWithFormModel;

  const [query, onQueryChange] = useState('');

  const isQuery = !isBlank(query);
  const isSelectApLevel = evaluationType === PER_AP;
  const isSelectServiceLevel = evaluationType === PER_AP_SERVICE;

  const [endpointName, setEndpointName] = useState();
  const [serviceName, setServiceName] = useState();
  const applicationName = useObservable(
    isSelectApLevel && applicationId
      ? getApplication({ id: applicationId }).map(({ data }) => data && data.label)
      : empty,
    [isSelectApLevel, applicationId]
  );

  useEffect(() => {
    // reset on first rendering or evaluation type change
    // apId is currently set automatically in parent
    setServiceName(null);
    setServiceId?.(null);
    setEndpointName(null);
    setEndpointId?.(null);
    // ignore any change to the setter functions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelectApLevel, isSelectServiceLevel, applications]);

  const applicationIds = Object.keys(applications);

  const applicationAndServicesList = useApplicationsAndServicesSubscriptions({
    applicationIds,
    alertConfigWithFormModel,
    isSelectApLevel,
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
            isSelectApLevel,
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
      isSelectApLevel,
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
    return getAppDataEntityChainsPaginated({
      level: getLevel(evaluationType),
      pagination: {
        cursor,
        retrievalSize: maxSearchRetrievalSize
      },
      includeSynthetic,
      //includeInternal // TODO clarify if needed in query on backend
      //tagFilterExpression  // TODO clarify if needed in query on backend
      searchTerm: query,
      timeConfig,
      order: {
        by: 'applicationName',
        direction: 'DESC'
      }
    });
  };

  const searchResult = useCursorPagination(queryEntity, [query]);

  // currently this is the only way how to figure out if it is still loading, until the
  // backend will be fixed, so that we could use isLoading(searchResult)  again,
  // see https://github.com/instana/ui-client/pull/6425/files#r641320862
  // TODO: after adapting backend, replace it with this line:
  //    const isSearchLoading = !searchResult || isLoading(searchResult);
  const isSearchLoading = !searchResult || (!searchResult.totalHits && searchResult?.totalHits !== 0);

  const queryOptions = isSearchLoading ? loadingOptions : searchResultsToListItems(searchResult, evaluationType);

  return (
    <Overlay
      content={EntitySelectionOverlay}
      props={{
        query,
        onQueryChange,
        setApplicationId,
        setServiceId,
        setServiceName,
        setEndpointId,
        setEndpointName,
        isSelectServiceLevel,
        isSelectApLevel,
        options: isQuery ? queryOptions : options
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
            disabled={applicationIds.length === 0}
          >
            <DropDownButtonLabel isApLevel={isSelectApLevel} isServiceLevel={isSelectServiceLevel} />
          </DropdownButton>
          <ApplicationScopePath
            applicationName={isSelectApLevel && (applicationName ?? applicationId)}
            serviceName={isSelectServiceLevel && serviceName}
            endpointName={endpointName}
            noBottomMargin
          />
        </HorizontalFlexWrapper>
      )}
    </Overlay>
  );
}

function DropDownButtonLabel({ isApLevel, isServiceLevel }) {
  if (isApLevel) {
    return t('in-alerting:smartAlerts.components.smartAlertDialog.PreviewForAP');
  }
  if (isServiceLevel) {
    return t('in-alerting:smartAlerts.components.smartAlertDialog.PreviewForService');
  }
  return t('in-alerting:smartAlerts.components.smartAlertDialog.PreviewForEndpoint');
}

export function EntitySelectionOverlay({
  setEndpointId,
  setEndpointName,
  setServiceId,
  setServiceName,
  setApplicationId,
  isSelectServiceLevel,
  isSelectApLevel,
  ...props
}) {
  useDisabledBodyScroll();

  return (
    <ThreeLevelsSelectorOverlay
      {...props}
      searchNodes={options => options /* override builtin search */}
      onChange={node => {
        if (node.type === 'ENDPOINT') {
          setEndpointId(node.id);
          setEndpointName(node.label);
          setServiceId(node.serviceId);
          setServiceName(node.serviceName);
          setApplicationId(node.appId);
          props.close();
        }
        if (node.type === 'SERVICE' && isSelectServiceLevel) {
          setServiceId(node.id);
          setServiceName(node.label);
          setApplicationId(node.appId);
          props.close();
        }
        if (node.type === 'APPLICATION' && isSelectApLevel) {
          // only change AP when in AP-only mode
          setApplicationId(node.id);
          props.close();
        }
      }}
    />
  );
}
