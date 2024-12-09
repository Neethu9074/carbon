/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef, useState } from 'react';
import classNames from 'classnames';

import { HorizontalIndicator, SvgIcon, Button } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import { PresentedLaneProps } from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import RenderScheduler from 'in-components/Chart/RenderScheduler';
import { ChartContentPostition } from 'in-components/Chart/types';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { Nullish, TimeConfig } from 'in-types';
import { ScaleType } from 'in-services/scale';
import { t } from 'in-i18n';

import locals from './MarkerLane.mless';

/*
 Adding a new LaneItem:
 If you want to add a completely new item which doesn't wrap around an existing one like "SingleMarkerLaneItem",
 you need to ensure that it provides the functions outlined below. Otherwise Showing overlays would not work
 because we need some hover data about the hovered item. For reference please have a look at component
 "SingleMarkerLaneItem".

  onMouseEnter={e => {
    onHover?.({
      isHovered: true,
      timestamp: eventData.timestamp,
      iconConfig
    });
  }}

  onMouseLeave={e => {
    onHover?.({});
  }}
*/

export interface MarkerLaneEvent {
  timestamp: number;
  count?: number;
  id?: string;
}

/**
 * Note: This is missing props provided through the restProps mechanism, because this would create a very messy type structure.
 *       Please only add the needed props from the restProps when migrating marker lane overlays.
 */
export interface MarkerLaneHoverOverlayConfig {
  xPos?: number;
  fromXPos: number;
  toXPos: number;
  chartContentPosition: ChartContentPostition;
  eventData: MarkerLaneEvent;
  xScale: ScaleType | Nullish;
  clusterWidth: number;
  commonOverlayStyles: ReturnType<typeof getCommonOverlayStyles>;
  isClustered?: boolean;
  chartHeight?: number;
  timeAxisHeight?: number;
  markerPaneHeight?: number;
}

/**
 * Note: This is missing props provided through the restProps mechanism, because this would create a very messy type structure.
 *       Please only add the needed props from the restProps when migrating marker lane items.
 */
export interface LaneItemProps<EventType extends MarkerLaneEvent> {
  xPos?: number;
  onHover: (event: EventType | Nullish) => void;
  showIconForCluster?: boolean;
  chartContentPosition: ChartContentPostition;
  isClustered?: boolean;
  eventData: EventType;
  xScale: ScaleType | Nullish;
  timeConfig?: TimeConfig;
}

interface MarkersLaneProps<EventType extends MarkerLaneEvent> extends Partial<PresentedLaneProps> {
  width: number;
  events: EventType[];
  TooltipContent?: React.JSXElementConstructor<EventType>;
  label?: string;
  iconConfigForMultipleAlertTypes?: {};
  chartContentPosition: ChartContentPostition;
  LaneItem: React.JSXElementConstructor<LaneItemProps<EventType>>;
  HoverOverlay?: React.JSXElementConstructor<MarkerLaneHoverOverlayConfig>;
  SecondaryHoverOverlay?: React.JSXElementConstructor<MarkerLaneHoverOverlayConfig>;
  selectedEventData?: EventType;
  isLoading?: boolean;
  /* when present, this message will be shown instead of any events */
  errorMessage?: string;
  /* when present, a retry button will be rendered */
  onRetry?: () => void;
  trackMarkerHoverEvent?: (event: EventType) => void;
  color?: string;
  // optionally overriding label visibility to make it always visible
  alwaysDisplayLabels?: boolean;
  calloutContent?: (props: any) => JSX.Element;
}

class MarkersLaneRenderScheduler<EventType extends MarkerLaneEvent> extends React.Component<
  MarkersLaneProps<EventType>
> {
  renderScheduler: RenderScheduler<this>;

  constructor(props: MarkersLaneProps<EventType>) {
    super(props);
    this.renderScheduler = new RenderScheduler(this);
  }

  componentDidUpdate() {
    this.renderScheduler.update(this.props.timeConfig!, this.props.width);
    if (this.props.events?.length > 0) this.props?.onLaneHasMarkersToRender!();
  }

  componentWillUnmount() {
    this.renderScheduler.dispose();
  }

  render() {
    return <MarkersLanePresenter {...this.props} renderScheduler={this.renderScheduler} />;
  }
}

interface MarkersLanePresenterProps<EventType extends MarkerLaneEvent> extends MarkersLaneProps<EventType> {
  renderScheduler: RenderScheduler<MarkersLaneRenderScheduler<EventType>>;
}

function MarkersLanePresenter<EventType extends MarkerLaneEvent>({
  events,
  TooltipContent,
  renderScheduler,
  labelAlignment,
  label,
  chartContentPosition,
  isClustered,
  LaneItem,
  HoverOverlay,
  SecondaryHoverOverlay,
  selectedEventData,
  laneLabelsVisible,
  isLoading,
  errorMessage,
  onRetry,
  trackMarkerHoverEvent,
  ...remainingProps
}: MarkersLanePresenterProps<EventType>) {
  // For tabbing to be correct for the marker lanes we need to initially
  // sort by the timestamp
  events = events.slice().sort((a, b) => a.timestamp - b.timestamp);

  const { timeConfig, clusterSizeMillis, alwaysDisplayLabels } = remainingProps;
  const xScale = useObservable(renderScheduler.xScaleBackBuffer$.nextFrame(), [timeConfig!.autoRefresh], {
    pure: !timeConfig!.autoRefresh
  });
  const [hoveredEventData, setHoveredEventData] = useState<MarkerLaneEvent | Nullish>(null);

  const clusterAreaWidth = xScale?.getRangeArea(clusterSizeMillis) ?? 0;
  return (
    <>
      <span className={locals.hoverAreaContainer}>
        {(hoveredEventData || selectedEventData) &&
          (() => {
            const eventDataTimestamp = hoveredEventData?.timestamp ?? selectedEventData!.timestamp;
            const xPos = getClampedXPos(eventDataTimestamp);
            const config: MarkerLaneHoverOverlayConfig = {
              xPos,
              fromXPos: Math.max(0, xPos - clusterAreaWidth / 2),
              toXPos: Math.min(xPos + clusterAreaWidth / 2, xScale?.getRangeTo() ?? 0),
              chartContentPosition,
              eventData: hoveredEventData ?? selectedEventData!,
              xScale,
              clusterWidth: clusterAreaWidth,
              commonOverlayStyles: getCommonOverlayStyles({ chartContentPosition, ...remainingProps }),
              isClustered,
              ...remainingProps
            };
            return (
              <>
                {HoverOverlay && <HoverOverlay {...config} />}
                {SecondaryHoverOverlay && <SecondaryHoverOverlay {...config} />}
              </>
            );
          })()}
      </span>
      <div
        className={classNames({
          [locals.lane]: true,
          [locals.lanePostChart]: chartContentPosition === 'post'
        })}
      >
        {!errorMessage &&
          events.map(eventData => {
            const showIconForCluster = (eventData?.count ?? 0) > 1;
            const xPos = getClampedXPos(eventData.timestamp);
            return (
              <Tooltip
                align={getTooltipAlignmentForChartContentPosition(chartContentPosition)}
                legacy
                key={`${eventData.id ?? eventData.timestamp}`}
                content={
                  TooltipContent ? (
                    <div>
                      <TooltipContent {...eventData} />
                    </div>
                  ) : null
                }
              >
                <LaneItem
                  xPos={xPos}
                  onHover={s => {
                    setHoveredEventData(s);
                    trackMarkerHoverEvent?.(eventData);
                  }}
                  showIconForCluster={showIconForCluster}
                  chartContentPosition={chartContentPosition}
                  isClustered={isClustered}
                  eventData={eventData}
                  xScale={xScale}
                  {...remainingProps}
                />
              </Tooltip>
            );
          })}
        {!errorMessage && (alwaysDisplayLabels || laneLabelsVisible) && (
          <div className={locals.laneLabel} style={{ [labelAlignment!]: 0 }}>
            <div
              className={locals.laneLabelText}
              style={{
                [`padding${labelAlignment === 'left' ? 'Right' : 'Left'}`]: '8px'
              }}
            >
              {label}
            </div>
          </div>
        )}
        {errorMessage && <MarkerLaneErrorMessage errorMessage={errorMessage} onRetry={onRetry} />}
        <div className={locals.loadingIndicatorContainer}>
          <HorizontalIndicator progress={{ loading: isLoading ?? false }} />
        </div>
      </div>
    </>
  );

  function getXPosCluster(timestamp: number): number {
    return (xScale?.getRange(timestamp) ?? 0) + clusterAreaWidth / 2 - remainingProps.chartBucketWidth! / 2;
  }

  function getClampedXPos(timestamp: number): number {
    const rangeTo = xScale?.getRangeTo() ?? 0;
    const xPos = isClustered ? getXPosCluster(timestamp) : xScale?.getRange(timestamp) ?? 0;
    return Math.max(0, Math.min(rangeTo, xPos));
  }

  function getTooltipAlignmentForChartContentPosition(chartContentPosition: ChartContentPostition) {
    if (chartContentPosition === 'pre') return 'topMiddle';
    if (chartContentPosition === 'post') return 'bottomMiddle';
    return undefined as never;
  }
}

interface MarkerLaneErrorMessageProps {
  errorMessage: string;
  onRetry?: () => void;
}

function MarkerLaneErrorMessage({ errorMessage, onRetry }: MarkerLaneErrorMessageProps) {
  return (
    <div className={locals.laneError}>
      <div className={locals.laneErrorIconText}>
        <Tooltip content={errorMessage}>
          <HorizontalFlexWrapper className={locals.laneErrorIconTextWrapper}>
            <SvgIcon
              className={locals.laneErrorIcon}
              color={themes.default.ids.color.option.neutral['600']}
              type="lib_help_error_warning_outline"
              size="xs"
            />
            <span className={locals.laneErrorLabelText}>{errorMessage}</span>
            {onRetry && (
              <Button kind="action" size="compact" onClick={() => onRetry()} className={locals.tryAgain}>
                {t('in-components:chart.chartMarkerLane.retryButtonLabel')}
              </Button>
            )}
          </HorizontalFlexWrapper>
        </Tooltip>
      </div>
    </div>
  );
}

interface GetCommonOverlayStylesProps {
  chartContentPosition: ChartContentPostition;
  color?: string;
}

function getCommonOverlayStyles({ chartContentPosition, color }: GetCommonOverlayStylesProps): React.CSSProperties {
  return {
    // setting zIndex to ensure the lanes added before the chart (1st in stacking order) will overlay the chart when hovered
    zIndex: chartContentPosition === 'pre' ? 1 : 'auto',
    color
  };
}

export default function MarkersLane<EventType extends MarkerLaneEvent>(
  props: Omit<MarkersLaneProps<EventType>, 'width'>
) {
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref}>{<MarkersLaneRenderScheduler {...props} width={ref.current?.offsetWidth ?? 0} />}</div>;
}
