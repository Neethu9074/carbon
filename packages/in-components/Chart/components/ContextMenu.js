import { combineLatest } from 'reactive-observables';
import { on } from 'reactive-observables';
import React from 'react';

import { highlightedTimeframe$, clearHighlightedTimeframe } from 'in-stores/timeline/highlightedTimeframe';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { allowDownloadMetricsFromCharts } from 'in-services/featureFlags';
import { getFixedTimeframeUrl } from 'in-stores/timeline';
import { alwaysNull } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
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
      yPos: null,
      openendByClick: false
    };

    componentDidMount() {
      this.setupSubscriptions();
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
      const targetClassName = e.target.className;
      if (
        typeof targetClassName === 'string' &&
        (targetClassName !== locals.contextMenu &&
          targetClassName !== locals.contextMenuOpenButton &&
          targetClassName !== locals.button)
      ) {
        this.closeContextMenu();
      }
    };

    closeContextMenu = () => {
      this.setState({ xPos: null, yPos: null, openendByClick: false });
    };

    render() {
      const { highlightedTimeframe, xScale, chart } = this.props;
      const { xPos, yPos } = this.state;

      const isContextMenuAvailable =
        highlightedTimeframe &&
        highlightedTimeframe[1] > xScale.getDomainFrom() &&
        highlightedTimeframe[0] < xScale.getDomainTo();
      if (!isContextMenuAvailable) {
        return null;
      }

      const isContextMenuRendered = xPos > 0;

      const buttonProps = {
        className: locals.button,
        kind: 'secondary',
        size: 'compact'
      };

      const contextMenu = (
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

      const buttonXPos = this.props.xScale.getRange(highlightedTimeframe[1]);
      return (
        <>
          <Button
            className={locals.contextMenuOpenButton}
            style={{
              left: Math.max(0, buttonXPos - 30) // 30 is the buttonsize in px
            }}
            onClick={e => this.onOpenContextMenuClicked(e, buttonXPos)}
            kind="secondary"
          >
            <SvgIcon className={locals.contextMenuOpenButtonIcon} type="lib_menu_more_horizontal" />
          </Button>

          {isContextMenuRendered && contextMenu}
        </>
      );
    }

    setupSubscriptions = () => {
      const glassPane = this.props.glassPane;
      if (!glassPane) {
        return;
      }
      this.onContextMenuSubscription = on(glassPane, 'contextmenu').subscribe(this.onContextMenu.bind(this));
      this.onMoueDownSubscription = on(glassPane, 'mousedown').subscribe(this.onClickOutside.bind(this));
      this.onClickSubscription = on(window, 'click').subscribe(this.onClickOutside.bind(this));
    };

    onContextMenu(e) {
      e.preventDefault();

      if (this.props.isHighlightedTimeframeHovered) {
        this.setState({ xPos: Math.max(0, e.offsetX - 10), yPos: Math.max(0, e.offsetY - 10), openendByClick: false });
      } else {
        this.closeContextMenu();
      }
    }

    onOpenContextMenuClicked = (e, buttonXPos) => {
      stopPropagationAndPreventDefault(e);

      if (this.state.openendByClick) {
        this.closeContextMenu();
      } else {
        this.setState({ xPos: Math.max(0, buttonXPos - 10), yPos: 26, openendByClick: true });
      }
    };

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
      if (this.onMoueDownSubscription) {
        this.onMoueDownSubscription.dispose();
        this.onMoueDownSubscription = null;
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
