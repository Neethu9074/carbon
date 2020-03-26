import ReactGridLayout from 'react-grid-layout';
import TrackVisibility from 'react-on-screen';
import React, { useState } from 'react';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import {
  rowHeightPixels,
  cols,
  margin,
  breakpoints,
  containerPadding
} from 'in-custom-dashboards/CustomDashboard/Grid/settings';
import { MoreMenu, MoreMenuButton } from 'in-new-components/MoreMenu';
import { evaluateClassNames } from 'in-services/util/classnames';
import LifecycleObserver from 'in-components/LifecycleObserver';
import ErrorBoundary from 'in-components/ErrorBoundary';
import widgets from 'in-custom-dashboards/widgets';
import theme from 'in-themes';

import locals from './Grid.mless';
import './Grid.less';

const disabledTransitionStyle = {
  transition: 'none'
};

export default function Grid({
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
  width
}) {
  if (!width) {
    return null;
  }

  // react-grid-layout has transitions enabled on each widget element. This means at the time of
  // mounting each widget is temporarily visible at coordinates 0,0. This in turn means that any
  // kind of visibility detection fails, because coordinates 0,0 are always visibile.
  //
  // To work around this we disable the transitions while mounting the component tree. On the next
  // browser tick after mounting we re-enable transitions again so that react-grid-layout works
  // as intended.
  const [disabledTransitions, setDisabledTransitions] = useState(true);

  return (
    <>
      <LifecycleObserver onDidMount={() => setTimeout(setDisabledTransitions, 0, false)} />
      <ReactGridLayout
        className={evaluateClassNames({
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
        breakpoints={breakpoints}
        isDraggable={isDraggable}
        isResizable={isResizable}
        onDragStop={forwardLayoutChange}
        onResizeStop={forwardLayoutChange}
        draggableHandle={draggableHandle ? `.${draggableHandle}` : undefined}
      >
        {config.widgets.map(widget => {
          const { Widget, minimumWidth, minimumHeight, onlyRenderInsideViewport } = widgets[widget.type];

          const actions = isConfigurable && (
            <MoreMenu kind="secondaryDarker" size="compact" className={locals.more}>
              <MoreMenuButton icon="lib_actions_edit" onClick={() => onEditWidget(widget.id)}>
                Edit
              </MoreMenuButton>
              <MoreMenuButton icon="lib_views_popup" onClick={() => onDuplicateWidget(widget.id)}>
                Duplicate
              </MoreMenuButton>
              <MoreMenuButton icon="lib_actions_delete" onClick={() => onRemoveWidget(widget.id)}>
                Delete
              </MoreMenuButton>
            </MoreMenu>
          );
          const widgetComponent = <Widget title={widget.title} actions={actions} config={widget.config} />;

          let content = widgetComponent;
          if (onlyRenderInsideViewport) {
            content = (
              <TrackVisibility once offset={300} tag="div">
                {({ isVisible }) => isVisible && widgetComponent}
              </TrackVisibility>
            );
          }

          return (
            <div
              key={widget.id}
              className={locals.widget}
              id={getWidgetId(widget.id)}
              data-h={Math.max(widget.height, minimumHeight)}
              data-grid={{
                w: Math.max(widget.width, minimumWidth),
                h: Math.max(widget.height, minimumHeight),
                x: widget.x,
                y: widget.y,
                minW: minimumWidth,
                minH: minimumHeight
              }}
              style={disabledTransitions ? disabledTransitionStyle : undefined}
            >
              <ErrorBoundary name={`Custom dashboard widget: ${widget.title}`}>{content}</ErrorBoundary>
            </div>
          );
        })}
      </ReactGridLayout>
    </>
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
