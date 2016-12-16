import {combineLatest} from 'reactive-observables';
import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';
import {getMetricsForTimeframe} from 'in-stores/metric';
import {serverTime$} from 'in-stores/serverTime';
import {timeframe$} from 'in-stores/timeline';
import Button from 'in-components/Button';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './MetricChartDownloadView.less';


const block = 'in-metric-chart-download-view';
const rpt = React.PropTypes;

export default connectTo(props => {
  return {
    metricValues: combineLatest([timeframe$, serverTime$])
                    .map(([timeframe, serverTime]) => {
                      if (!timeframe.to) {
                        timeframe.to = serverTime;
                      }
                      return timeframe;
                    })
                    .distinct()
                    .flatMap(timeframe => combineLatest(props.snapshots.map(snapshot => {
                      const ops = {
                        snapshotId: snapshot.get('id'),
                        metric: props.metric,
                        timeframe
                      };

                      return getMetricsForTimeframe(ops).map(metrics => {
                        return {
                          label: getLabel(snapshot),
                          values: metrics.map(metricValues => metricValues.sort((a, b) => a.time - b.time))
                        };
                      });
                    }))
                  )
                  .map(metrics => {
                    const map = {};
                    metrics.forEach(metric => map[metric.label] = metric.values);
                    return map;
                  })
  };
},
React.createClass({

  displayName: 'MetricChartDownloadView',

  propTypes: {
    metric: rpt.string.isRequired,
    metricValues: rpt.object
  },

  render() {
    const metricValues = this.props.metricValues;
    if (!metricValues) {
      return (
        <LoadingIndicator type='dark' />
      );
    }

    return (
      <div>
        <a ref={link => this.downloadLink = link}
           onClick={stopPropagation} />
        <div  className={`${block}__wrapper`}>
          <Button kind='secondary'
                  size='sm'
                  onClick={e => this.onDownloadAsJsonClick(e)}>
            Download (*.json)
          </Button>
          <Button kind='secondary'
                  size='sm'
                  onClick={this.onDownloadAsCsvClick}>
            Download (*.csv)
          </Button>
        </div>
      </div>
    );
  },

  onDownloadAsJsonClick(e) {
    e.stopPropagation();
    this.downloadFile('json', encodeURIComponent(JSON.stringify(this.props.metricValues, null, 4)));
  },

  onDownloadAsCsvClick(e) {
    e.stopPropagation();
    const metrics = Object.keys(this.props.metricValues);
    if (metrics.length === 0) {
      return;
    }

    const timestamps = `timestamps,${this.props.metricValues[metrics[0]].map(value => value[0]).join(',')}`;
    const lines = Object.keys(this.props.metricValues).map(key => `${key},${this.props.metricValues[key].map(value => value[1]).join(',')}`).join('\n');
    this.downloadFile('csv', encodeURIComponent(`${timestamps}\n${lines}`));
  },

  downloadFile(fileType, data) {
    this.downloadLink.setAttribute('href', `data:text/${fileType};charset=utf-8,${data}`);
    this.downloadLink.setAttribute('download', `metric-${this.props.metric}.${fileType}`);
    this.downloadLink.click();
  }
}));

function stopPropagation(e) {
  e.stopPropagation();
}
