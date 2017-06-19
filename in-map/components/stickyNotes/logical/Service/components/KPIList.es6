import irpt from 'react-immutable-proptypes';
import rpt from 'prop-types';
import React from 'react';

import { zeroDecimalPlacesPerSecond, zeroDecimalPlaces } from 'in-services/formatters/number';
import LabeledSparkChart from 'in-sdk/components/sidebar/LabeledSparkChart';
import { showAggregations$ } from 'in-stores/metric/showAggregations';
import getSnapshot from 'in-hoc/getSnapshot';
import SvgIcon from 'in-components/SvgIcon';
import KPIList from 'in-components/KPIList';
import connectTo from 'in-hoc/connectTo';
import { getKpis } from 'in-sdk/kpi';

import 'in-map/components/stickyNotes/logical/Service/components/KPIList.less';

const block = 'in-sticky-note-process-kpi-list';

export default connectTo(
  { showAggregations: showAggregations$ },
  getSnapshot(
    class extends React.Component {
      static displayName = 'KPIList';

      static propTypes = {
        snapshotId: rpt.string.isRequired,
        onExpand: rpt.func.isRequired,
        snapshot: irpt.map,
        showAggregations: rpt.bool
      };

      state = {
        isExpanded: false
      };

      render() {
        const snapshot = this.props.snapshot;
        if (!snapshot) {
          return false;
        }

        const isExpanded = this.state.isExpanded;

        let className = block;
        if (isExpanded) {
          className += ' ' + className + '--highlighted';
        }

        const kpis = getKpis(snapshot);

        // If you ever stumble upon this: I am really sorry!
        // This logic is very stupid and sadly a limitation of our KPI /
        // metric aggregation forge. This is done to remove the "/s" sufix
        // of the calls metric in the application map.
        const formatters = kpis.map(kpi => kpi.valueOnlyFormatter);
        if (this.props.showAggregations) {
          formatters.forEach((formatter, i) => {
            if (formatter == zeroDecimalPlacesPerSecond) {
              formatters[i] = zeroDecimalPlaces;
            }
          });
        }

        return (
          <div className={className}>
            <div
              className={`${block}__icon-wrapper`}
              onClick={() => {
                this.setState({ isExpanded: !isExpanded });
                this.props.onExpand(!isExpanded);
              }}
            >
              <SvgIcon
                className={`${block}__expand-icon`}
                type={isExpanded ? 'timeline_close' : 'timeline_open'}
                height={14}
                width={14}
                color="#7b8e96"
              />
            </div>

            <div className={`${block}__kpi-wrapper`}>
              {isExpanded
                ? kpis.map(kpi =>
                    <LabeledSparkChart
                      className={block + '__spark-chart'}
                      key={kpi.label}
                      snapshotId={this.props.snapshotId}
                      label={kpi.label}
                      design="dark"
                      metric={kpi.metric}
                      formatter={kpi.formatter}
                      optionalTimeWindowAggregation={kpi.timeWindowAggregation}
                    />
                  )
                : <KPIList
                    snapshot={snapshot}
                    metrics={kpis.map(kpi => kpi.metric)}
                    labels={kpis.map(kpi => kpi.label)}
                    formatters={formatters}
                    timeWindowAggregations={kpis.map(kpi => kpi.timeWindowAggregation)}
                  />}
            </div>
          </div>
        );
      }
    }
  )
);
