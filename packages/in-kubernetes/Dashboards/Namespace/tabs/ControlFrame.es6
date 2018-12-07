import { compose, withState } from 'recompose';
import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import { twoDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import getKubernetesDeployment from 'in-subscription/kubernetes/getKubernetesDeployment';
import HighlightSwitch from 'in-kubernetes/Dashboards/Namespace/tabs/HighlightSwitch';
import getKubernetesService from 'in-subscription/kubernetes/getKubernetesService';
import getKubernetesNode from 'in-subscription/kubernetes/getKubernetesNode';
import ButtonGroup from 'in-new-components/ButtonGroup';
import Button from 'in-new-components/Button';

import locals from './ControlFrame.mless';

const groupings = {
  deployment: {
    technicalName: 'DEPLOYMENT',
    label: 'Deployment',
    getEntity: getKubernetesDeployment
  },
  service: {
    technicalName: 'SERVICE',
    label: 'Service',
    getEntity: getKubernetesService
  },
  node: {
    technicalName: 'NODE',
    label: 'Node',
    getEntity: getKubernetesNode
  }
};

export default compose(
  withState('grouping', 'setGrouping', groupings.service),
  withState('showHealth', 'setShowHealth', false),
  withState('sizeMetricConfig', 'setSizeMetricConfig', null)
)(ControlFrame);

function ControlFrame(props) {
  const { grouping, setGrouping, showHealth, setShowHealth, render, sizeMetricConfig, setSizeMetricConfig } = props;

  return (
    <div className={locals.frame}>
      <FullHeightWrapper
        render={height => (
          <div style={{ height }} className={locals.leftPanel}>
            <h4 className={locals.groupHeading}>SIZE BY</h4>
            <ul className={locals.list}>
              <li className={locals.item}>
                <Button
                  className={locals.button}
                  onClick={() =>
                    setSizeMetricConfig({
                      metricName: 'cpu',
                      format: twoDecimalPlaces,
                      metricType: sizeMetricConfig ? sizeMetricConfig.metricType : 'Limits'
                    })
                  }
                  kind={sizeMetricConfig && sizeMetricConfig.metricName === 'cpu' ? 'primaryv2' : 'subtle'}
                >
                  CPU
                </Button>
              </li>
              <li className={locals.item}>
                <Button
                  className={locals.button}
                  onClick={() =>
                    setSizeMetricConfig({
                      metricName: 'memory',
                      format: bytesZeroDecimalPlaces,
                      metricType: sizeMetricConfig ? sizeMetricConfig.metricType : 'Limits'
                    })
                  }
                  kind={sizeMetricConfig && sizeMetricConfig.metricName === 'memory' ? 'primaryv2' : 'subtle'}
                >
                  Memory
                </Button>
              </li>
              <li className={locals.item}>
                <Button
                  className={locals.button}
                  onClick={() => setSizeMetricConfig(null)}
                  kind={!sizeMetricConfig ? 'primaryv2' : 'subtle'}
                >
                  Containers
                </Button>
              </li>
            </ul>

            <h4 className={locals.groupHeading}>GROUP BY</h4>
            <ul className={locals.list}>
              {Object.keys(groupings).map(key => {
                const config = groupings[key];
                return (
                  <li key={key} className={locals.item}>
                    <Button
                      className={locals.button}
                      onClick={() => setGrouping(config)}
                      kind={grouping === config ? 'primaryv2' : 'subtle'}
                    >
                      {config.label}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      />

      <div className={locals.rightPanel}>
        <div className={locals.header}>
          <HighlightSwitch showHealth={showHealth} setShowHealth={setShowHealth} />

          {sizeMetricConfig && (
            <ButtonGroup
              buttonPropsList={[
                {
                  text: 'Limits',
                  key: 'Limits',
                  onClick: () =>
                    setSizeMetricConfig({
                      metricName: sizeMetricConfig.metricName,
                      format: sizeMetricConfig.format,
                      metricType: 'Limits'
                    })
                },
                {
                  text: 'Requests',
                  key: 'Requests',
                  onClick: () =>
                    setSizeMetricConfig({
                      metricName: sizeMetricConfig.metricName,
                      format: sizeMetricConfig.format,
                      metricType: 'Requests'
                    })
                }
              ]}
              activeKey={sizeMetricConfig.metricType}
            />
          )}
        </div>
        {render(props)}
      </div>
    </div>
  );
}
