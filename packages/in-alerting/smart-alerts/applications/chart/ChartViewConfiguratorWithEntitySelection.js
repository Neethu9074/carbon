/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
  PER_AP_SERVICE,
  PER_AP
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import ChartSubEntitySelection from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/ChartSubEntitySelection';
import { ShowApplicationSelection } from 'in-alerting/smart-alerts/applications/chart/ShowApplicationSelection';
import { firstApplicationId } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { maxChartViewTimeframe } from 'in-alerting/components/Chart/chartViewConfig';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import ButtonGroup from 'in-new-components/ButtonGroup';
import Stack from 'in-new-components/layout/Stack';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/ChartViewConfigurator.mless';

export default function ChartViewConfiguratorWithEntitySelection({
  selectedChartViewConfigIndex = 0,
  alertConfigWithFormModel,
  children,
  className,
  doNotSetDefaultHeight,
  title,
  headerTransparent,
  framed = false,
  onChartViewConfigChange
}) {
  const selectApLevelOnly = alertConfigWithFormModel.evaluationType === PER_AP;
  const selectServiceLevel = alertConfigWithFormModel.evaluationType === PER_AP_SERVICE;
  const selectedChartViewConfig = chartViewConfigs[selectedChartViewConfigIndex];
  const [serviceId, setServiceId] = useState();
  const [endpointId, setEndpointId] = useState();
  const [applicationId, setApplicationId] = useState(
    selectApLevelOnly ? firstApplicationId(alertConfigWithFormModel?.applications) : null
  );
  const applications = Object.values(alertConfigWithFormModel?.applications);
  const showEntitySelection = !selectApLevelOnly || applications.length > 1;

  useEffect(() => {
    // do a simple reset, after somebody switched evaluationType
    setEndpointId(null);
    setServiceId(null);
    if (selectApLevelOnly) {
      setApplicationId(firstApplicationId(alertConfigWithFormModel?.applications));
    } else {
      setApplicationId(null);
    }
    // trigger only when evaluationType was changed, but no by "firstApplicationId"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectApLevelOnly, selectServiceLevel]);

  return (
    <LightCard
      className={classNames(locals.container, {
        [className]: className, // className overrides everything
        [locals.defaultSize]: !showEntitySelection && !className && !doNotSetDefaultHeight,
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
              setApplicationId={setApplicationId}
              serviceId={serviceId}
              setServiceId={setServiceId}
              endpointId={endpointId}
              setEndpointId={setEndpointId}
              alertConfigWithFormModel={alertConfigWithFormModel}
              // use maximum possible timeframe, to have a stable list when switching between options
              queryWindowSize={maxChartViewTimeframe}
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
  doNotSetDefaultHeight: PropTypes.bool,
  title: PropTypes.string,
  headerTransparent: PropTypes.bool,
  framed: PropTypes.bool,
  alertConfigWithFormModel: PropTypes.shape({
    applicationId: PropTypes.string, // deprecated
    applications: PropTypes.object,
    websiteId: PropTypes.string,
    evaluationType: PropTypes.string
  }),
  onChartViewConfigChange: PropTypes.func.isRequired
};
