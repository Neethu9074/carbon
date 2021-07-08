/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';
import { on } from '@instana/observables';

import globalHighlightAction from 'in-components/Chart/components/ContextMenu/actions/globalHighlight';
import downloadAction from 'in-components/Chart/components/ContextMenu/actions/download';
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { allowDownloadMetricsFromCharts } from 'in-services/featureFlags';
import { containsIgnoreCase } from 'in-services/util/string';
import { emptyArray } from 'in-services/fixedObjects';
import { isEscape } from 'in-components/keyCodes';
import Tooltip from 'in-components/Tooltip';
import { minutes } from 'in-services/time';

import locals from './ContextMenu.mless';

const MAX_ZOOM_LEVEL = minutes.toMillis(1);

export default class extends React.Component {
  static displayName = 'ContextMenu';

  constructor(props) {
    super(props);

    const { setShowContextMenu, highlightedTimeframe, chart } = props;

    const basicButtonConfigs = [
      {
        ...globalHighlightAction,
        onClick: () => {
          globalHighlightAction.onClick(highlightedTimeframe);
          chart.config.clearLocalHighlightedTimeframe();
        }
      },
      {
        ...zoomInAction,
        getHref$: () => zoomInAction.getHref$(highlightedTimeframe)
      },
      allowDownloadMetricsFromCharts && {
        ...downloadAction,
        onClick: () => downloadAction.onClick(this.props.metrics, highlightedTimeframe)
      }
    ];

    const primaryContextMenuAction = chart.config.primaryContextMenuAction || zoomInAction.name;
    const excludedContextMenuActions = chart.config.excludedContextMenuActions || [];
    const contextMenuButtons = [...(chart.config.additionalContextMenuButtons || emptyArray), ...basicButtonConfigs]
      .filter(Boolean)
      .filter(config => !excludedContextMenuActions.includes(config.name))
      .sort((a1, a2) => sortByPrimaryAction(a1, a2, primaryContextMenuAction))
      .map(config => {
        if (config.onClick) {
          const originalOnClick = config.onClick;
          config.onClick = e => {
            if (!config.allowClickPropagationAndDefault) {
              stopPropagationAndPreventDefault(e);
            }
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
    this.keyDownSubscription = on(window, 'keydown').subscribe(e => this.onKeyDown(e));
  }

  componentWillUnmount() {
    if (this.onMouseDownSubscription) {
      this.onMouseDownSubscription.dispose();
      this.onMouseDownSubscription = null;
    }
    if (this.keyDownSubscription) {
      this.keyDownSubscription.dispose();
      this.keyDownSubscription = null;
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

  onKeyDown(e) {
    if (isEscape(e)) {
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
              className={classNames({
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
        ...getNonFilteredMetricsForaxis('y1', config.y1, config.filteredDataSeries),
        ...getNonFilteredMetricsForaxis('y2', config.y2, config.filteredDataSeries)
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

function getNonFilteredMetricsForaxis(axisName, axis, filteredDataSeries) {
  if (!axis) {
    return [];
  }
  return axis.labels
    .filter((label, i) => !filteredDataSeries.has(`${axisName}-${i}`))
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

// exporting for test
export function sortByPrimaryAction(i1, i2, primaryContextMenuAction) {
  if (i1.name === primaryContextMenuAction) {
    return -1;
  }
  if (i2.name === primaryContextMenuAction) {
    return 1;
  }
  return 0;
}
