import { combineLatest } from 'reactive-observables';
import { on } from 'reactive-observables';
import React from 'react';

import { highlightedTimeframe$, clearHighlightedTimeframe } from 'in-stores/timeline/highlightedTimeframe';
import { allowDownloadMetricsFromCharts } from 'in-services/featureFlags';
import { getFixedTimeframeUrl } from 'in-stores/timeline';
import { alwaysNull } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

import locals from './ContextMenu.mless';

const MAX_ZOOM_LEVEL = 1000 * 60;

export default connectTo(
  {
    highlightedTimeframe: highlightedTimeframe$
  },

  class extends React.Component {
    static displayName = 'ContextMenu';

    state = {
      xPos: null,
      yPos: null
    };

    componentDidMount() {
      this.setupSubscriptions();
    }

    shouldComponentUpdate(nextProps, nextState) {
      return (
        this.props.glassPane !== nextProps.glassPane ||
        this.props.xScale !== nextProps.xScale ||
        this.props.highlightedTimeframe !== nextProps.highlightedTimeframe ||
        this.state.xPos !== nextState.xPos
      );
    }

    componentDidUpdate(nextProps) {
      if (this.props.glassPane !== nextProps.glassPane) {
        this.disposeSubscriptions();
        this.setupSubscriptions();
      }
    }

    componentWillUnmount() {
      this.disposeSubscriptions();
    }

    onClickOutside = e => {
      if (e.target.className !== locals.contextMenu) {
        this.closeContextMenu();
      }
    };

    closeContextMenu = () => {
      this.setState({ xPos: null, yPos: null });
    };

    render() {
      const { highlightedTimeframe, chart } = this.props;
      const { xPos, yPos } = this.state;
      if (
        !highlightedTimeframe ||
        !xPos ||
        (!highlightedTimeframe && !allowDownloadMetricsFromCharts && !chart.config.additionalContextMenuButtons)
      ) {
        return null;
      }

      const buttonProps = {
        className: locals.button,
        kind: 'secondary',
        size: 'compact'
      };

      return (
        <div className={locals.contextMenu} style={{ left: xPos, top: yPos }}>
          {(chart.config.additionalContextMenuButtons || []).map((buttonConfig, index, originalTimeConfig) => {
            return (
              <Button
                key={index}
                {...buttonProps}
                icon={buttonConfig.icon}
                href$={
                  buttonConfig.getHref$
                    ? buttonConfig.getHref$(
                        getHighlightedTimeConfig(highlightedTimeframe, originalTimeConfig),
                        this.getStrippedConfig()
                      )
                    : undefined
                }
                onClick={() => {
                  this.closeContextMenu();
                  if (buttonConfig.onClick) {
                    buttonConfig.onClick(this.getStrippedConfig());
                  }
                }}
              >
                {buttonConfig.label}
              </Button>
            );
          })}
          {highlightedTimeframe && (
            <Button
              {...buttonProps}
              icon="lib_datetime_time"
              href$={getHighlightedTimeframeUrl$()}
              onClick={this.closeContextMenu}
            >
              Zoom to time range
            </Button>
          )}
          {allowDownloadMetricsFromCharts && (
            <Button
              {...buttonProps}
              icon="lib_actions_download"
              onClick={e => {
                this.closeContextMenu();
                this.download(e);
              }}
            >
              Download JSON
            </Button>
          )}
          {highlightedTimeframe && (
            <Button
              {...buttonProps}
              icon="lib_openclose_circle_outline"
              onClick={() => {
                this.closeContextMenu();
                clearHighlightedTimeframe();
              }}
            >
              Clear selection
            </Button>
          )}
        </div>
      );
    }

    setupSubscriptions = () => {
      const glassPane = this.props.glassPane;
      if (!glassPane) {
        return;
      }
      this.onContextMenuSubscription = on(glassPane, 'contextmenu').subscribe(this.onContextMenu.bind(this));
      this.onClickSubscription = on(glassPane, 'click').subscribe(this.onClickOutside.bind(this));
    };

    onContextMenu(e) {
      const highlightedTimeframe = this.props.highlightedTimeframe;
      e.preventDefault();

      if (!highlightedTimeframe) {
        return;
      }

      const from = highlightedTimeframe[0];
      let to = highlightedTimeframe[1];
      const clickedDomain = this.props.xScale.getDomain(e.offsetX);
      if (clickedDomain >= from && clickedDomain <= to) {
        this.setState({ xPos: Math.max(0, e.offsetX - 10), yPos: Math.max(0, e.offsetY - 10) });
      }
    }

    download = e => {
      const metrics = this.props.metrics;
      metrics.y1._metricValuesForDownload = metrics['y1'].metrics;

      e.preventDefault();
      const data = filterOnHighlightedTimeframe(this.props.highlightedTimeframe, mapMetricsToDownloadFormat(metrics));
      let fileName = metrics.cardTitle;
      if (!fileName) {
        fileName = 'metrics';
      }
      const a = document.body.appendChild(document.createElement('a'));
      a.download = fileName + '.json';
      a.href = `data:text/json;charset=utf-8,${encodeURIComponent(getJsonData(data))}`;
      a.click();
    };

    getStrippedConfig = () => {
      const config = this.props.chart.config;
      return {
        renderedMetrics: [
          ...getNonFilteredMetricsForaxis(config.y1, config.filteredDataSeries),
          ...getNonFilteredMetricsForaxis(config.y2, config.filteredDataSeries)
        ]
        // add more properties, depending on the use case
      };
    };

    disposeSubscriptions = () => {
      if (this.onContextMenuSubscription) {
        this.onContextMenuSubscription.dispose();
        this.onContextMenuSubscription = null;
      }
      if (this.onClickSubscription) {
        this.onClickSubscription.dispose();
        this.onClickSubscription = null;
      }
    };
  }
);

function getNonFilteredMetricsForaxis(axis, filteredDataSeries) {
  if (!axis) {
    return [];
  }
  return axis.labels
    .filter(label => !filteredDataSeries.has(label))
    .map(label => axis.labels.indexOf(label))
    .map(i => (axis.metricIds || axis.labels)[i]);
}

function filterOnHighlightedTimeframe(highlightedTimeframe, metrics) {
  if (!highlightedTimeframe) {
    return metrics;
  }

  const from = highlightedTimeframe[0];
  let to = highlightedTimeframe[1];

  const metricKeys = Object.keys(metrics);
  for (let i = 0; i < metricKeys.length; i++) {
    const metric = metricKeys[i];
    metrics[metric] = metrics[metric].filter(({ timestamp }) => timestamp >= from && timestamp <= to);
  }

  return metrics;
}

function mapMetricsToDownloadFormat(metrics) {
  const values = {};
  for (let i = 0; i < metrics.y1.labels.length; i++) {
    values[metrics.y1.labels[i]] = getMetricData(metrics.y1._metricValuesForDownload[i]);
  }
  return values;
}

function getMetricData(metricValues) {
  return metricValues.map(v => ({ timestamp: v[0], value: v[1] }));
}

function getJsonData(data) {
  return JSON.stringify(data, null, 2);
}

function getHighlightedTimeframeUrl$() {
  return combineLatest([highlightedTimeframe$, timeConfig$]).flatMap(([highlightedTimeframe, originalTimeConfig]) => {
    if (!highlightedTimeframe) {
      return alwaysNull;
    }

    const timeConfig = {
      ...originalTimeConfig
    };

    const from = highlightedTimeframe[0];
    let to = highlightedTimeframe[1];
    let windowSize = to - from;

    if (windowSize <= MAX_ZOOM_LEVEL) {
      windowSize = MAX_ZOOM_LEVEL;
    }

    if (timeConfig.focusedMoment > to || timeConfig.focusedMoment < from) {
      timeConfig.focusedMoment = to;
    }

    return getFixedTimeframeUrl({
      windowSize,
      to,
      focusedMoment: timeConfig.focusedMoment,
      clearHighlightedTimeframe: true
    });
  });
}

function getHighlightedTimeConfig(highlightedTimeframe, originalTimeConfig) {
  const timeConfig = {
    ...originalTimeConfig
  };

  const from = highlightedTimeframe[0];
  let to = highlightedTimeframe[1];
  let windowSize = to - from;

  if (windowSize <= MAX_ZOOM_LEVEL) {
    windowSize = MAX_ZOOM_LEVEL;
  }

  if (timeConfig.focusedMoment > to || timeConfig.focusedMoment < from) {
    timeConfig.focusedMoment = to;
  }

  const highlightedTimeConfig = {
    windowSize,
    to,
    focusedMoment: timeConfig.focusedMoment,
    clearHighlightedTimeframe: true
  };

  return highlightedTimeConfig;
}
