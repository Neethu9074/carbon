/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Stack, StackItem } from '@instana/components';
import { ButtonGroup } from '@instana/components';

import {
  PER_AP_SERVICE,
  PER_AP
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import ChartSubEntitySelection from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/ChartSubEntitySelection';
import { ShowApplicationSelection } from 'in-alerting/smart-alerts/applications/chart/ShowApplicationSelection';
import { firstApplicationId } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { days } from 'in-services/time';

import locals from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator.mless';

/**
 * Timeframe used for the entities shown to pick for the preview. The bigger the timeframe, the better the coverage of entities
 * to be selected, even for entities that did not receive any calls recently.
 * However, large timeframes makes resolving entities slow, and UI interaction hard, or even impossible due to timeouts.
 */
const entitySelectionQueryWindowSize = days.toMillis(1);

export default function ChartViewConfiguratorWithEntitySelection({
  selectedChartViewConfigIndex = 0,
  alertConfigWithFormModel,
  children,
  className,
  title,
  headerTransparent,
  framed = false,
  onChartViewConfigChange,
  onEntityIdChange,
  isTearSheet,
  sectionHeader
}) {
  const selectApLevelOnly = alertConfigWithFormModel.evaluationType === PER_AP;
  const selectServiceLevel = alertConfigWithFormModel.evaluationType === PER_AP_SERVICE;
  const firstAppId = firstApplicationId(alertConfigWithFormModel?.applications);
  const selectedChartViewConfig = chartViewConfigs[selectedChartViewConfigIndex];
  const [serviceId, setServiceId] = useState();
  const [endpointId, setEndpointId] = useState();
  const [applicationId, setApplicationId] = useState(selectApLevelOnly ? firstAppId : null);
  const applications = Object.values(alertConfigWithFormModel?.applications);
  const showEntitySelection = !selectApLevelOnly || applications.length > 1;

  const handleSetApplicationId = applicationId => {
    setApplicationId(applicationId);
    onEntityIdChange?.({ applicationId });
  };

  const handleSetServiceId = serviceId => {
    setServiceId(serviceId);
    onEntityIdChange?.({ serviceId });
  };

  const handleSetEndpointId = endpointId => {
    setEndpointId(endpointId);
    onEntityIdChange?.({ endpointId });
  };

  useEffect(() => {
    // as long as no appId is in state we should watch the form for selection updates
    // or if our current selection vanishes from the selected apps we should switch to the first app of the form
    if (!applicationId || !applications.find(({ applicationId: id }) => id === applicationId)) {
      handleSetApplicationId(firstAppId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstAppId, applications]);

  useEffect(() => {
    // do a simple reset, after somebody switched evaluationType
    handleSetEndpointId(null);
    handleSetServiceId(null);
    if (selectApLevelOnly) {
      handleSetApplicationId(firstAppId);
    } else {
      handleSetApplicationId(null);
    }
    // trigger only when evaluationType was changed, but no by "firstApplicationId"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectApLevelOnly, selectServiceLevel]);

  return isTearSheet ? (
    <>
      <div className={locals.flexItem}>
        {sectionHeader}
        {showEntitySelection && (
          <ChartSubEntitySelection
            applicationId={applicationId}
            setApplicationId={handleSetApplicationId}
            serviceId={serviceId}
            setServiceId={handleSetServiceId}
            endpointId={endpointId}
            setEndpointId={handleSetEndpointId}
            alertConfigWithFormModel={alertConfigWithFormModel}
            queryWindowSize={entitySelectionQueryWindowSize}
            isTearSheet={isTearSheet}
          />
        )}
        {!showEntitySelection && applications.length > 1 && <ShowApplicationSelection applicationId={applicationId} />}

        <ButtonGroup
          buttonPropsList={chartViewConfigs.map((chartConfig, index) => ({
            text: chartConfig.label,
            key: chartConfig.label,
            onClick: () => onChartViewConfigChange(index)
          }))}
          activeKey={selectedChartViewConfig.label}
        />
      </div>
      <div className={locals.boxBorder}>{children(selectedChartViewConfig, applicationId, serviceId, endpointId)}</div>
    </>
  ) : (
    <LightCard
      className={classNames(locals.container, {
        [className]: className, // className overrides everything
        [locals.withSelection]: showEntitySelection && !className
      })}
      title={title}
      headerClassName={headerTransparent ? locals.headerTransparent : null}
      header={
        <ButtonGroup
          buttonPropsList={chartViewConfigs.map((chartConfig, index) => ({
            text: chartConfig.label,
            key: chartConfig.label,
            onClick: () => onChartViewConfigChange(index)
          }))}
          activeKey={selectedChartViewConfig.label}
        />
      }
      framed={framed}
      darkFrame
    >
      <Stack>
        {showEntitySelection && (
          <StackItem>
            <ChartSubEntitySelection
              applicationId={applicationId}
              setApplicationId={handleSetApplicationId}
              serviceId={serviceId}
              setServiceId={handleSetServiceId}
              endpointId={endpointId}
              setEndpointId={handleSetEndpointId}
              alertConfigWithFormModel={alertConfigWithFormModel}
              queryWindowSize={entitySelectionQueryWindowSize}
            />
          </StackItem>
        )}
        {!showEntitySelection && applications.length > 1 && (
          <StackItem>
            <ShowApplicationSelection applicationId={applicationId} />
          </StackItem>
        )}
        <StackItem>{children(selectedChartViewConfig, applicationId, serviceId, endpointId)}</StackItem>
      </Stack>
    </LightCard>
  );
}

ChartViewConfiguratorWithEntitySelection.propTypes = {
  children: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number,
  className: PropTypes.string,
  title: PropTypes.string,
  headerTransparent: PropTypes.bool,
  framed: PropTypes.bool,
  alertConfigWithFormModel: PropTypes.shape({
    applicationId: PropTypes.string, // deprecated
    applications: PropTypes.object,
    websiteId: PropTypes.string,
    evaluationType: PropTypes.string
  }),
  onChartViewConfigChange: PropTypes.func.isRequired,
  onEntityIdChange: PropTypes.func,
  isTearSheet: PropTypes.bool,
  sectionHeader: PropTypes.object
};
