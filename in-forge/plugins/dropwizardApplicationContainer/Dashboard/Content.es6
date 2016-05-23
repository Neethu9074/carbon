import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  withSiPrefixThreeDecimalPlaces
} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ResponsiveTable from 'in-components/ResponsiveTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {emptyList} from 'in-services/fixedImmutables';
import classnames from 'in-services/util/classnames';
import {timeframeShape} from 'in-stores/timeline';
import Mtd from 'in-components/Mtd';


const chartHeight = 200;

const DropwizardDashboard = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
      snapshot: irpt.map.isRequired,
      timeframe: timeframeShape
    },

    getInitialState() {
      return {
        selectedMetricGauge: null,
        selectedMetricCounter: null,
        selectedMetricMeter: null
      };
    },

    render() {
      const timeframe = this.props.timeframe;
      const snapshot = this.props.snapshot;

      const gauges = snapshot.getIn(['data', 'metrics.gauges'], emptyList).toArray();
      const counters = snapshot.getIn(['data', 'metrics.counters'], emptyList).toArray();
      const meters = snapshot.getIn(['data', 'metrics.meters'], emptyList).toArray();

      return (
        <div>
          {gauges && gauges.length > 0 ?
            <DashboardSection title='Gauges'>
              {this.state.selectedMetricGauge ?
                <ChartWithLegend snapshot={snapshot}
                                 timeframe={timeframe}
                                 height={chartHeight}
                                 margins={{
                                   left: 90
                                 }}
                                 y1={{
                                   formatter: withSiPrefixThreeDecimalPlaces,
                                   metrics: ['metrics.gauges.' + this.state.selectedMetricGauge],
                                   labels: [this.state.selectedMetricGauge],
                                   type: 'line'
                                 }}/>
              : null}
              <ResponsiveTable clickable={true}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Value</th>
                  </tr>
                </thead>

                <tbody>
                  {gauges.map(gauge =>
                    <tr key={gauge}
                        onClick={() => this.setState({selectedMetricGauge: gauge})}
                        className={classnames({
                          'active': gauge === this.state.selectedMetricGauge
                        })}>
                      <td>
                        {gauge}
                      </td>
                      <Mtd metric={'metrics.gauges.' + gauge}
                           snapshot={snapshot}
                           formatter={withSiPrefixThreeDecimalPlaces} />
                    </tr>
                  )}
                </tbody>
              </ResponsiveTable>
            </DashboardSection>
          : null}
          {counters && counters.length > 0 ?
            <DashboardSection title='Counter'>
              {this.state.selectedMetricCounter ?
                <ChartWithLegend snapshot={snapshot}
                                 timeframe={timeframe}
                                 height={chartHeight}
                                 margins={{
                                   left: 90
                                 }}
                                 y1={{
                                   formatter: withSiPrefixThreeDecimalPlaces,
                                   metrics: ['metrics.counters.' + this.state.selectedMetricCounter],
                                   labels: [this.state.selectedMetricCounter],
                                   type: 'line'
                                 }}/>
              : null}
              <ResponsiveTable clickable={true}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Value</th>
                  </tr>
                </thead>

                <tbody>
                  {counters.map(counter =>
                    <tr key={counter}
                        onClick={() => this.setState({selectedMetricCounter: counter})}
                        className={classnames({
                          'active': counter === this.state.selectedMetricCounter
                        })}>
                      <td>
                        {counter}
                      </td>
                      <Mtd metric={'metrics.counters.' + counter}
                           snapshot={snapshot}
                           formatter={withSiPrefixThreeDecimalPlaces} />
                    </tr>
                  )}
                </tbody>
              </ResponsiveTable>
            </DashboardSection>
          : null}
          {meters && meters.length > 0 ?
            <DashboardSection title='Meter'>
              {this.state.selectedMetricMeter ?
                <ChartWithLegend snapshot={snapshot}
                                 timeframe={timeframe}
                                 height={chartHeight}
                                 margins={{
                                   left: 90
                                 }}
                                 y1={{
                                   formatter: withSiPrefixThreeDecimalPlaces,
                                   metrics: ['metrics.meters.' + this.state.selectedMetricMeter],
                                   labels: [this.state.selectedMetricMeter + ' rate'],
                                   type: 'line'
                                 }}/>
              : null}
              <ResponsiveTable clickable={true}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Rate</th>
                  </tr>
                </thead>

                <tbody>
                  {meters.map(meter =>
                    <tr key={meter}
                        onClick={() => this.setState({selectedMetricMeter: meter})}
                        className={classnames({
                          'active': meter === this.state.selectedMetricMeter
                        })}>
                      <td>
                        {meter}
                      </td>
                      <Mtd metric={'metrics.meters.' + meter}
                           snapshot={snapshot}
                           formatter={withSiPrefixThreeDecimalPlaces} />
                    </tr>
                  )}
                </tbody>
              </ResponsiveTable>
            </DashboardSection>
          : null}
        </div>
      );
    }
});

export default DropwizardDashboard;
