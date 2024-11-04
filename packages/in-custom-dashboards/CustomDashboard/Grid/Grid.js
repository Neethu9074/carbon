/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { memo, useEffect, useContext, useState } from 'react';
import { InView } from 'react-intersection-observer';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import classNames from 'classnames';

import { Card, IconButton, Message, SvgIcon } from '@instana/components';

import {
  breakpoints,
  cols,
  containerPadding,
  margin,
  rowHeightPixels
} from 'in-custom-dashboards/CustomDashboard/Grid/settings';
import { carbonMoreMenuEnabled, customDashboardsExportPdfWidget, zoomWidgetEnabled } from 'in-services/featureFlags';
import { CustomDashboardContext } from 'in-custom-dashboards/CustomDashboard/CustomDashboardContext';
import { CUSTOM_DASHBOARD_WIDGET_DOWNLOAD_PDF } from 'in-services/tracking/tracking';
import ViewTracker from 'in-custom-dashboards/CustomDashboard/Grid/ViewTracker';
import { gridGutter } from 'in-custom-dashboards/CustomDashboard/Grid/settings';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { ViewLogsButton } from 'in-logging/components/ViewLogsButton';
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import CopyToClipboard from 'in-components/CopyToClipboard';
import ErrorBoundary from 'in-components/ErrorBoundary';
import widgets from 'in-custom-dashboards/widgets';
import Tooltip from 'in-components/Tooltip';
import { t, Trans } from 'in-i18n';

import locals from './Grid.mless';
import './Grid.less';

const disabledTransitionStyle = {
  transition: 'none'
};

const dragHandle = (
  <Tooltip content={t('in-forge:plugins.docker.dashboard.dragHandleTootip')}>
    <div>
      <SvgIcon className={locals.dragHandle} type="lib_actions_reorder" />
    </div>
  </Tooltip>
);
export default function GridPropsChecker(props) {
  if (!props.width) {
    return null;
  }
  return <Grid {...props} />;
}

function Grid({
  config,
  onLayoutChange,
  draggableHandle,
  isResizable,
  isConfigurable,
  isDraggable,
  onEditWidget,
  onCopyWidget,
  onDuplicateWidget,
  onZoomWidget,
  onRemoveWidget,
  tvMode,
  scrollAreaDomNode,
  shouldWidgetRenderOutsideViewport,
  width
}) {
  // react-grid-layout has transitions enabled on each widget element. This means at the time of
  // mounting each widget is temporarily visible at coordinates 0,0. This in turn means that any
  // kind of visibility detection fails, because coordinates 0,0 are always visibile.
  //
  // To work around this we disable the transitions while mounting the component tree. On the next
  // browser tick after mounting we re-enable transitions again so that react-grid-layout works
  // as intended.
  const [disabledTransitions, setDisabledTransitions] = useState(true);

  const { trackCta } = useSegmentTracking();

  const { setExportWidgetId, setShouldExportWidget } = useContext(CustomDashboardContext);

  useEffect(() => {
    const handle = setTimeout(setDisabledTransitions, 0, false);

    return () => {
      clearTimeout(handle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const layout = config.widgets
    .map(widget => {
      const { minimumWidth = 3, minimumHeight = 9 } = widgets[widget.type] ?? {};
      return getLayoutFields(widget, minimumWidth, minimumHeight);
    })
    .sort((a, b) => (a.y !== b.y ? a.y - b.y : a.x - b.x)); // sort the layout based on the widget position

  const orderedIds = layout.map(item => item.i);
  const sortedWidgets = orderedIds.map(id => config.widgets.find(item => item.id === id)).filter(Boolean);

  return (
    <ReactGridLayout
      className={classNames({
        [locals.layout]: true,
        [locals.tvMode]: tvMode
      })}
      cols={cols}
      rowHeight={rowHeightPixels}
      margin={margin}
      // Remove the horizontal spacing added by the grid layout to avoid
      // horizontal overflow.
      width={width - gridGutter}
      containerPadding={containerPadding}
      layout={layout}
      breakpoints={breakpoints}
      isDraggable={isDraggable}
      isResizable={isResizable}
      onDragStop={forwardLayoutChange}
      onResizeStop={forwardLayoutChange}
      draggableHandle={`.${draggableHandle || locals.dragHandle}`}
    >
      {sortedWidgets.map(widget => {
        const content = widgets[widget.type] ? (
          <MemoizedWidgetContent
            widget={widget}
            isConfigurable={isConfigurable}
            shouldRenderOutsideViewport={shouldWidgetRenderOutsideViewport}
            onEditWidget={onEditWidget}
            onCopyWidget={onCopyWidget}
            onDuplicateWidget={onDuplicateWidget}
            onZoomWidget={onZoomWidget}
            onRemoveWidget={onRemoveWidget}
            setExportWidgetId={setExportWidgetId}
            setShouldExportWidget={value => {
              trackCta(CUSTOM_DASHBOARD_WIDGET_DOWNLOAD_PDF, { widgetId: widget.id });
              setShouldExportWidget(value);
            }}
            isDraggable={isDraggable}
            scrollAreaDomNode={scrollAreaDomNode}
          />
        ) : (
          <Card title={widget.title || '-'}>
            <Message type="error" withIcon>
              <Trans i18nKey="in-custom-dashboards:widgets.invalidWidgetTypeErrorMessage" />
            </Message>
          </Card>
        );

        return (
          <div
            key={widget.id}
            className={locals.widget}
            id={getWidgetId(widget.id)}
            style={disabledTransitions ? disabledTransitionStyle : undefined}
          >
            <ErrorBoundary
              name={t('in-custom-dashboards:customDashboard.grid.grid.customDashboardWidgetTitle', {
                title: widget.title
              })}
              meta={widget}
            >
              {content}
            </ErrorBoundary>
          </div>
        );
      })}
    </ReactGridLayout>
  );

  function forwardLayoutChange(layout) {
    onLayoutChange(
      layout.map(widget => ({
        id: widget.i,
        width: widget.w,
        height: widget.h,
        x: widget.x,
        y: widget.y
      }))
    );
  }
}

function WidgetContent({
  widget,
  isConfigurable,
  onEditWidget,
  onCopyWidget,
  onDuplicateWidget,
  onZoomWidget,
  onRemoveWidget,
  setExportWidgetId,
  setShouldExportWidget,
  isDraggable,
  customHeight,
  scrollAreaDomNode,
  shouldRenderOutsideViewport = false
}) {
  const { Widget, onlyRenderInsideViewport = true, trackViews } = widgets[widget.type];

  const actions = isConfigurable && (
    <WidgetMoreMenu
      onEditWidget={onEditWidget}
      widget={widget}
      onDuplicateWidget={onDuplicateWidget}
      onCopyWidget={onCopyWidget}
      onZoomWidget={onZoomWidget}
      setExportWidgetId={setExportWidgetId}
      setShouldExportWidget={setShouldExportWidget}
      onRemoveWidget={onRemoveWidget}
    />
  );

  let content = (
    <Widget
      title={widget.title || '–'}
      actions={actions}
      dragHandle={isDraggable && dragHandle}
      config={widget.config}
      setApDialogOpen={widget.setApDialogOpen}
      widgetId={widget.id}
      setExportWidgetId={setExportWidgetId}
      customHeight={customHeight}
    />
  );

  if (trackViews) {
    content = <ViewTracker widget={widget}>{content}</ViewTracker>;
  }

  if (onlyRenderInsideViewport && !shouldRenderOutsideViewport) {
    // We cannot reference 'content' directly within InView as this would create a circular rendering problem.
    const trackVisibilityContent = content;
    content = (
      <InView as="div" triggerOnce root={scrollAreaDomNode}>
        {({ inView, ref }) => (
          <div
            className={classNames({
              [locals.visibilityTrackWrapper]: true,
              [locals.notInViewport]: !inView
            })}
            ref={ref}
          >
            {inView && trackVisibilityContent}
          </div>
        )}
      </InView>
    );
  }

  return content;
}

export const MemoizedWidgetContent = memo(WidgetContent);

function WidgetMoreMenu({
  onEditWidget,
  widget,
  onDuplicateWidget,
  onCopyWidget,
  onZoomWidget,
  onRemoveWidget,
  setExportWidgetId,
  setShouldExportWidget
}) {
  return (
    <div className={classNames(locals.moreMenuContainer, { [locals.carbonMoreMenuContainer]: carbonMoreMenuEnabled })}>
      <ViewLogsButton className={locals.viewInAnalyze} config={widget.config} />
      {zoomWidgetEnabled && (
        <Tooltip content={t('in-forge:plugins.docker.dashboard.zoomTooltip')}>
          <div>
            <IconButton
              kind="action"
              size={carbonMoreMenuEnabled ? 'compact' : 'normal'}
              className={locals.zoom}
              type="lib_actions_maximize"
              onClick={() => onZoomWidget(widget.id)}
            />
          </div>
        </Tooltip>
      )}
      <Tooltip content={carbonMoreMenuEnabled ? null : t('in-forge:plugins.docker.dashboard.moreTooltip')}>
        <div className={classNames({ [locals.moreMenuContent]: carbonMoreMenuEnabled })}>
          <MoreMenu
            kind="secondaryDarker"
            size="compact"
            className={locals.more}
            iconDescription={t('in-forge:plugins.docker.dashboard.moreTooltip')}
          >
            <MoreMenuButton icon="lib_actions_edit" onClick={() => onEditWidget(widget.id)}>
              {t('in-custom-dashboards:customDashboard.grid.grid.edit')}
            </MoreMenuButton>
            <CopyToClipboard
              getText={() => onCopyWidget(widget.id)}
              successText={t('in-custom-dashboards:customDashboard.grid.grid.copied')}
            >
              {copyToClipboardRef => (
                <MoreMenuButton icon="lib_actions_copy" ref={copyToClipboardRef}>
                  {t('in-custom-dashboards:customDashboard.grid.grid.copy')}
                </MoreMenuButton>
              )}
            </CopyToClipboard>
            <MoreMenuButton icon="lib_group_by" onClick={() => onDuplicateWidget(widget.id)}>
              {t('in-custom-dashboards:customDashboard.grid.grid.duplicate')}
            </MoreMenuButton>
            {customDashboardsExportPdfWidget && (
              <MoreMenuButton
                icon="lib_actions_download"
                onClick={() => {
                  setExportWidgetId(widget.id);
                  setShouldExportWidget(true);
                }}
              >
                {t('in-custom-dashboards:customDashboard.grid.grid.exportPDF')}
              </MoreMenuButton>
            )}
            <MoreMenuButton icon="lib_actions_delete" onClick={() => onRemoveWidget(widget.id)}>
              {t('in-custom-dashboards:customDashboard.grid.grid.delete')}
            </MoreMenuButton>
          </MoreMenu>
        </div>
      </Tooltip>
    </div>
  );
}

export function getWidgetId(id) {
  return `widget-${id}`;
}

function getLayoutFields(widget, minimumWidth, minimumHeight) {
  return {
    i: widget.id,
    w: Math.max(widget.width, minimumWidth),
    h: Math.max(widget.height, minimumHeight),
    x: widget.x,
    y: widget.y,
    minW: minimumWidth,
    minH: minimumHeight
  };
}
