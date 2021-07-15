/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, useEffect, useMemo } from 'react';

import { useObservable } from '@instana/hooks';
import { empty } from '@instana/observables';

import useApplicationsSubscriptions from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/useApplicationsSubscriptions';
import {
  createAPsList,
  loadingOptions
} from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/createOptions';
import { EntitySelectionOverlay } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/EntitySelectionOverlay';
import { createApOnlyItem } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/searchResults';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import getApplication from 'in-subscription/application/getApplication';
import { isBlank, containsIgnoreCase } from 'in-services/util/string';
import DropdownButton from 'in-components/Button/DropdownButton';
import Overlay from 'in-components/overlays/Overlay';
import { isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/ChartViewConfigurator.mless';

export default function APSelection({
  applicationId,
  setApplicationId,
  setServiceId,
  setEndpointId,
  alertConfigWithFormModel
}) {
  const { applications } = alertConfigWithFormModel;

  const applicationName = useObservable(
    applicationId ? getApplication({ id: applicationId }).map(({ data }) => data && data.label) : empty,
    [applicationId]
  );

  const [query, onQueryChange] = useState('');
  useEffect(() => {
    // reset on first rendering (also as soon as evaluation type has changed to PER_AP)
    setServiceId?.(null);
    setEndpointId?.(null);
    // ignore any change to the setter functions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applicationAndServicesList = useApplicationsSubscriptions(applications);

  const options = useMemo(
    () => {
      const loading = !applicationAndServicesList || applicationAndServicesList.some(result => isLoading(result));
      return loading ? loadingOptions : createAPsList(applicationAndServicesList);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applicationAndServicesList]
    // do not watch loadingOptions intentionally, because it is constant
  );

  // need to filter and transform
  const filteredAndTransformedAPs = () =>
    options
      .filter(option => containsIgnoreCase(option.label, query))
      .map(option => createApOnlyItem({ applicationName: option.label, applicationId: option.id }));

  return (
    <Overlay
      content={EntitySelectionOverlay}
      props={{
        query,
        onQueryChange,
        setApplicationId,
        setServiceId,
        setEndpointId,
        isSelectApLevel: true,
        options: isBlank(query) ? options : filteredAndTransformedAPs()
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
            disabled={applications.length === 0}
          >
            {t('in-alerting:smartAlerts.components.smartAlertDialog.PreviewForAP')}
          </DropdownButton>
          <ApplicationScopePath applicationName={applicationName ?? applicationId} noBottomMargin />
        </HorizontalFlexWrapper>
      )}
    </Overlay>
  );
}
