import { on } from 'reactive-observables';
import React from 'react';

import downloadButtonConfig from 'in-components/Chart/components/ContextMenu/downloadButtonConfig';
import zoomInButtonConfig from 'in-components/Chart/components/ContextMenu/zoomInButtonConfig';
import { setHighlightedTimeframe } from 'in-stores/timeline/highlightedTimeframe';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { allowDownloadMetricsFromCharts } from 'in-services/featureFlags';
import { evaluateClassNames } from 'in-services/util/classnames';
import { containsIgnoreCase } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ContextMenu.mless';

const MAX_ZOOM_LEVEL = 1000 * 60;

export default class extends React.Component {
  static displayName = 'ContextMenu';

  constructor(props) {
    super(props);

    const { setShowContextMenu, highlightedTimeframe, chart } = props;

    const basicButtonConfigs = [
      highlightedTimeframe && {
        ...zoomInButtonConfig,
        getHref$: () => zoomInButtonConfig.getHref$(chart)
      },
      highlightedTimeframe && {
        icon: 'lib_views_tag',
        label: 'Highlight on all charts',
        onClick: () => {
          setHighlightedTimeframe(highlightedTimeframe[0], highlightedTimeframe[1]);
          chart.config.clearLocalHighlightedTimeframe();
          setShowContextMenu(false);
        }
      },
      allowDownloadMetricsFromCharts && {
        ...downloadButtonConfig,
        onClick: () => downloadButtonConfig.onClick(this.props.metrics, highlightedTimeframe)
      }
    ];

    const contextMenuButtons = [...chart.config.additionalContextMenuButtons, ...basicButtonConfigs]
      .filter(Boolean)
      .map(config => {
        if (config.onClick) {
          const originalOnClick = config.onClick;
          config.onClick = e => {
            stopPropagationAndPreventDefault(e);
            setShowContextMenu(false);
            if (originalOnClick) {
              originalOnClick(this.getStrippedConfig());
            }
          };
        }
        if (config.getHref$) {
          const originalGetHref$ = config.getHref$;
          config.getHref$ = () =>
            originalGetHref$(getHighlightedTimeConfig(highlightedTimeframe), this.getStrippedConfig());
        }
        return config;
      });

    this.state = {
      contextMenuButtons
    };
  }

  componentDidMount() {
    this.onMouseDownSubscription = on(window, 'mousedown').subscribe(e => this.onMouseDown(e));
  }

  componentWillUnmount() {
    if (this.onMouseDownSubscription) {
      this.onMouseDownSubscription.dispose();
      this.onMouseDownSubscription = null;
    }
  }

  onMouseDown(e) {
    const targetClassName = e?.target?.className;
    if (
      typeof targetClassName === 'string' &&
      !containsIgnoreCase(targetClassName, locals.contextMenu) &&
      !containsIgnoreCase(targetClassName, locals.button) &&
      !containsIgnoreCase(targetClassName, locals.contextMenuActionsButtonsWrapper)
    ) {
      this.props.setShowContextMenu(false);
      this.props.chart.config.clearLocalHighlightedTimeframe();
    }
  }

  render() {
    const { showContextMenu, immediatelyOpenContextMenu, highlightedTimeframe, xScale, chart } = this.props;
    const contextMenuButtons = this.state.contextMenuButtons;

    const isContextMenuAvailable =
      (highlightedTimeframe &&
        highlightedTimeframe[1] > xScale.getDomainFrom() &&
        highlightedTimeframe[0] < xScale.getDomainTo()) ||
      contextMenuButtons.length === 0;
    if (!isContextMenuAvailable) {
      return null;
    }

    const buttonProps = {
      className: locals.button,
      kind: 'secondary',
      size: 'compact'
    };

    const leftAligned = this.isLeftAligned();
    const barWidthInPx = xScale.getRangeArea(chart.config.granularity);

    return (
      <>
        <div
          className={locals.contextMenuActionsButtonsWrapper}
          style={{ left: this.getXPosition(contextMenuButtons.length) }}
        >
          {!immediatelyOpenContextMenu && this.renderButtons(contextMenuButtons)}
          {showContextMenu && (
            <div
              className={evaluateClassNames({
                [locals.contextMenu]: true,
                [locals.leftAligned]: leftAligned,
                [locals.rightAligned]: !leftAligned
              })}
              style={{
                marginLeft: leftAligned ? 2 : 0,
                marginRight: leftAligned ? 0 : barWidthInPx + 2
              }}
            >
              {contextMenuButtons.slice(immediatelyOpenContextMenu ? 0 : 1).map((buttonConfig, index) => (
                <Button
                  key={index}
                  {...buttonProps}
                  icon={buttonConfig.icon}
                  href$={buttonConfig.getHref$ && buttonConfig.getHref$()}
                  onClick={buttonConfig.onClick}
                >
                  {buttonConfig.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  getXPosition = numActions => {
    const { highlightedTimeframe, xScale } = this.props;
    return xScale.getRange(highlightedTimeframe[1]) - (numActions > 1 ? 68 : 30);
  };

  isLeftAligned = () => {
    const { highlightedTimeframe, xScale } = this.props;
    const fullDomain = xScale.getDomainTo() - xScale.getDomainFrom();
    return highlightedTimeframe[1] < xScale.getDomainFrom() + fullDomain / 2;
  };

  toggleContextMenu = () => {
    this.props.setShowContextMenu(!this.props.showContextMenu);
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

  renderButtons = contextMenuButtons => {
    if (contextMenuButtons.length === 0) {
      return null;
    }

    const primaryButton = createIconButton(contextMenuButtons[0]);

    if (contextMenuButtons.length === 1) {
      return primaryButton;
    }

    if (contextMenuButtons.length === 2) {
      return (
        <>
          {primaryButton}
          {this.renderSecondaryButton(contextMenuButtons)}
        </>
      );
    }

    return (
      <>
        {primaryButton}
        {this.renderContextMenu()}
      </>
    );
  };

  renderSecondaryButton = contextMenuButtons => {
    return createIconButton(contextMenuButtons[1]);
  };

  renderContextMenu = () => {
    return createIconButton({
      icon: 'lib_menu_more_horizontal',
      onClick: this.toggleContextMenu
    });
  };
}

function createIconButton(config) {
  const button = (
    <Button
      className={locals.contextMenuOpenButton}
      href$={config.getHref$ && config.getHref$()}
      onClick={config.onClick}
      kind="secondary"
    >
      <SvgIcon className={locals.contextMenuOpenButtonIcon} type={config.icon} />
    </Button>
  );
  if (config.label) {
    return <Tooltip content={config.label}>{button}</Tooltip>;
  }
  return button;
}

function getNonFilteredMetricsForaxis(axis, filteredDataSeries) {
  if (!axis) {
    return [];
  }
  return axis.labels
    .filter(label => !filteredDataSeries.has(label))
    .map(label => axis.labels.indexOf(label))
    .map(i => (axis.metricIds || axis.labels)[i]);
}

function getHighlightedTimeConfig(highlightedTimeframe) {
  const from = highlightedTimeframe[0];
  let to = highlightedTimeframe[1];
  let windowSize = to - from;

  if (windowSize <= MAX_ZOOM_LEVEL) {
    windowSize = MAX_ZOOM_LEVEL;
  }

  const highlightedTimeConfig = {
    windowSize,
    to,
    focusedMoment: to,
    clearHighlightedTimeframe: true
  };

  return highlightedTimeConfig;
}
