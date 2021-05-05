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
import { createOptionsList } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/createOptions';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import getApplication from 'in-subscription/application/getApplication';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import Overlay from 'in-new-components/overlays/Overlay';
import { isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/ChartViewConfigurator.mless';

const loadingOptions = [{ label: t('in-alerting:smartAlerts.components.smartAlertDialog.Loading') }];

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

  const { applications, boundaryScope, evaluationType, includeSynthetic } = alertConfigWithFormModel;

  const [query, onQueryChange] = useState('');
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
    // reset on first rendering or evaluation mode change
    if (isSelectApLevel) {
      setServiceName(null);
      setEndpointName(null);
    } else if (isSelectServiceLevel) {
      setEndpointName(null);
    }
  }, [isSelectApLevel, isSelectServiceLevel]);

  const applicationIds = Object.keys(applications);

  const applicationAndServicesList = useApplicationsAndServicesSubscriptions({
    applicationIds,
    alertConfigWithFormModel,
    isSelectApLevel,
    queryWindowSize
  });
  const loading = !applicationAndServicesList || applicationAndServicesList.some(result => isLoading(result));

  const options = useMemo(
    () =>
      loading
        ? loadingOptions
        : createOptionsList(
            applicationAndServicesList,
            /* derived from/based on applications */
            applicationIds,
            isSelectApLevel,
            isSelectServiceLevel,
            /* derived from/based on queryWindowSize */
            timeConfig,
            boundaryScope,
            includeSynthetic
          ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      loading,
      applicationAndServicesList,
      queryWindowSize,
      includeSynthetic,
      applications,
      boundaryScope,
      isSelectApLevel,
      isSelectServiceLevel
    ]
    // do not watch loadingOptions intentionally, because it is constant
  );

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
        options
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

function EntitySelectionOverlay({
  setEndpointId,
  setEndpointName,
  setServiceId,
  setServiceName,
  setApplicationId,
  isSelectServiceLevel,
  isSelectApLevel,
  ...props
}) {
  return (
    <ThreeLevelsSelectorOverlay
      {...props}
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
