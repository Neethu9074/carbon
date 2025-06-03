/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { keyCodes, Button } from '@instana/components';
import { on } from '@instana/observables';

import globalHighlightAction from 'in-components/Chart/components/ContextMenu/actions/globalHighlight';
import downloadJSONAction from 'in-components/Chart/components/ContextMenu/actions/downloadJSON';
import downloadCSVAction from 'in-components/Chart/components/ContextMenu/actions/downloadCSV';
import downloadPDFAction from 'in-components/Chart/components/ContextMenu/actions/downloadPDF';
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { customDashboardsExportPdfWidget } from 'in-services/featureFlags';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import { containsIgnoreCase } from 'in-services/util/string';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

import locals from './ContextMenu.mless';

const { isEscape } = keyCodes;
const MAX_ZOOM_LEVEL = minutes.toMillis(1);

export default class extends React.Component {
  static displayName = 'ContextMenu';

  constructor(props) {
    super(props);

    const {
      setShowContextMenu,
      highlightedTimeframe,
      chart,
      chartWrapper,
      isCustomDashboard,
      customDashboardTitle,
      exportWidgetToPdf,
      tooltipRef
    } = props;

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
        getHrefWithLocation$: (location, createHref) =>
          zoomInAction.getHighlightedTimeframeUrl$(highlightedTimeframe, location, createHref)
      },
      {
        ...downloadJSONAction,
        onClick: () => downloadJSONAction.onClick(this.props.metrics, highlightedTimeframe)
      },
      {
        ...downloadCSVAction,
        onClick: () => downloadCSVAction.onClick(this.props.metrics, highlightedTimeframe)
      }
    ];

    if (isCustomDashboard && customDashboardsExportPdfWidget) {
      basicButtonConfigs.push({
        ...downloadPDFAction,
        onClick: () =>
          exportWidgetToPdf({
            target: chartWrapper,
            tooltipRef,
            isHistogram: false,
            pdfHeaderTitle: customDashboardTitle
          })
      });
    }

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
        // Need for renderedMetrics value population by getStrippedConfig func.
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

    const leftAligned = this.isLeftAligned();
    const barWidthInPx = xScale.getRangeArea(chart.config.granularity);

    return (
      <>
        <div
          className={locals.contextMenuCarbonButtonWrapper}
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
                <ContextMenuButton buttonConfig={buttonConfig} key={index} />
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
    const uniqueMetrics = new Set(
      Object.values(config.metricsConfiguration?.metrics || emptyObject).map(
        ({ metric, aggregation }) => `${metric} ${aggregation}`
      )
    );
    return {
      renderedMetrics: [
        ...getNonFilteredMetricsForaxis('y1', config.y1, config.filteredDataSeries),
        ...getNonFilteredMetricsForaxis('y2', config.y2, config.filteredDataSeries)
      ],
      chartMetrics: uniqueMetrics
      // add more properties, depending on the use case
    };
  };

  renderButtons = contextMenuButtons => {
    if (contextMenuButtons.length === 0) {
      return null;
    }

    const primaryButton = <CreateIconButton config={contextMenuButtons[0]} isPrimary />;

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
    return <CreateIconButton config={contextMenuButtons[1]} />;
  };

  renderContextMenu = () => {
    return (
      <CreateIconButton
        config={{
          icon: 'lib_menu_more_horizontal',
          label: t('in-components:analyze.options'),
          onClick: this.toggleContextMenu
        }}
      />
    );
  };
}

function CreateIconButton(props) {
  const { config, isPrimary } = props;
  const { location, createHref } = useNavigation();
  const { icon, getHref, getHref$, getHrefWithLocation$, onClick } = config;
  const button = (
    <Button
      hasIconOnly
      style={isPrimary ? { left: '1px' } : {}}
      className={locals.contextMenuOpenButton}
      href$={config.getHref$ && config.getHref$()}
      {...(typeof getHref === 'string'
        ? { href: getHref }
        : getHref$
        ? { href$: getHref$() }
        : getHrefWithLocation$
        ? { href$: getHrefWithLocation$(location, createHref) }
        : {})}
      onClick={onClick}
      kind="tertiary"
      icon={icon}
      iconDescription={config.label}
      size="compact"
    >
      {''}
    </Button>
  );
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

function ContextMenuButton(props) {
  const { buttonConfig } = props;
  const { location, createHref } = useNavigation();
  const { icon, getHref, label, getHref$, getHrefWithLocation$, onClick } = buttonConfig;
  return (
    <Button
      className={locals.button}
      kind="action"
      size="compact"
      icon={icon}
      {...(typeof getHref === 'string'
        ? { href: getHref }
        : buttonConfig.getHref$
        ? { href$: getHref$() }
        : getHrefWithLocation$
        ? { href$: getHrefWithLocation$(location, createHref) }
        : {})}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
