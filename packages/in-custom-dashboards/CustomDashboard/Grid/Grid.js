/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { InView } from 'react-intersection-observer';
import React, { useState, useEffect } from 'react';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import {
  rowHeightPixels,
  cols,
  margin,
  breakpoints,
  containerPadding
} from 'in-custom-dashboards/CustomDashboard/Grid/settings';
import ViewTracker from 'in-custom-dashboards/CustomDashboard/Grid/ViewTracker';
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import ErrorBoundary from 'in-components/ErrorBoundary';
import widgets from 'in-custom-dashboards/widgets';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './Grid.mless';
import './Grid.less';

const disabledTransitionStyle = {
  transition: 'none'
};

const dragHandle = <SvgIcon className={locals.dragHandle} type="lib_actions_reorder" />;

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
  onDuplicateWidget,
  onRemoveWidget,
  tvMode,
  scrollAreaDomNode,
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
  useEffect(() => {
    const handle = setTimeout(setDisabledTransitions, 0, false);
    return () => clearTimeout(handle);
  }, []);

  const layout = config.widgets.map(widget => {
    const { minimumWidth, minimumHeight } = widgets[widget.type];
    return {
      i: widget.id,
      w: Math.max(widget.width, minimumWidth),
      h: Math.max(widget.height, minimumHeight),
      x: widget.x,
      y: widget.y,
      minW: minimumWidth,
      minH: minimumHeight
    };
  });

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
      width={width - theme.grid.gutter}
      containerPadding={containerPadding}
      layout={layout}
      breakpoints={breakpoints}
      isDraggable={isDraggable}
      isResizable={isResizable}
      onDragStop={forwardLayoutChange}
      onResizeStop={forwardLayoutChange}
      draggableHandle={`.${draggableHandle || locals.dragHandle}`}
    >
      {config.widgets.map(widget => {
        const { Widget, onlyRenderInsideViewport = true, trackViews } = widgets[widget.type];

        const actions = isConfigurable && (
          <MoreMenu kind="secondaryDarker" size="compact" className={locals.more}>
            <MoreMenuButton icon="lib_actions_edit" onClick={() => onEditWidget(widget.id)}>
              {t('in-custom-dashboards:customDashboard.grid.grid.edit')}
            </MoreMenuButton>
            <MoreMenuButton icon="lib_actions_copy" onClick={() => onDuplicateWidget(widget.id)}>
              {t('in-custom-dashboards:customDashboard.grid.grid.duplicate')}
            </MoreMenuButton>
            <MoreMenuButton icon="lib_actions_delete" onClick={() => onRemoveWidget(widget.id)}>
              {t('in-custom-dashboards:customDashboard.grid.grid.delete')}
            </MoreMenuButton>
          </MoreMenu>
        );

        let content = (
          <Widget
            title={widget.title || '–'}
            actions={actions}
            dragHandle={isDraggable && dragHandle}
            config={widget.config}
            setApDialogOpen={widget.setApDialogOpen}
          />
        );

        if (trackViews) {
          content = <ViewTracker widget={widget}>{content}</ViewTracker>;
        }

        if (onlyRenderInsideViewport) {
          // We cannot reference 'content' directly within InView as this would create a circular rendering problem.
          const trackVisibilityContent = content;
          content = (
            <InView as="div" triggerOnce root={scrollAreaDomNode}>
              {({ inView, ref }) => (
                <div className={locals.visibilityTrackWrapper} ref={ref}>
                  {inView && trackVisibilityContent}
                </div>
              )}
            </InView>
          );
        }

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

export function getWidgetId(id) {
  return `widget-${id}`;
}
