import { compose, withState } from 'recompose';
import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import { twoDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import HighlightSwitch from 'in-kubernetes/Dashboards/Namespace/tabs/HighlightSwitch';
import ButtonGroup from 'in-new-components/ButtonGroup';
import Button from 'in-new-components/Button';

import locals from './ControlFrame.mless';

export default compose(
  withState('grouping', 'setGrouping', 'SERVICE'),
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

            <br />
            <br />
            <br />

            <h4 className={locals.groupHeading}>GROUP BY</h4>
            <ul className={locals.list}>
              <li className={locals.item}>
                <Button
                  className={locals.button}
                  onClick={() => setGrouping('SERVICE')}
                  kind={grouping === 'SERVICE' ? 'primaryv2' : 'subtle'}
                >
                  Service
                </Button>
              </li>
              <li className={locals.item}>
                <Button
                  className={locals.button}
                  onClick={() => setGrouping('DEPLOYMENT')}
                  kind={grouping === 'DEPLOYMENT' ? 'primaryv2' : 'subtle'}
                >
                  Deployment
                </Button>
              </li>
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
