import ReactGridLayout from 'react-grid-layout';
import TrackVisibility from 'react-on-screen';
import React, { useState } from 'react';

import LifecycleObserver from 'in-components/LifecycleObserver';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import {
  rowHeightPixels as rowHeightPixelsFromSettings,
  cols,
  margin,
  breakpoints,
  containerPadding
} from 'in-custom-dashboards/CustomDashboard/Grid/settings';
import { evaluateClassNames } from 'in-services/util/classnames';
import ErrorBoundary from 'in-components/ErrorBoundary';
import widgets from 'in-custom-dashboards/widgets';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Grid.mless';

const disabledTransitionStyle = {
  transition: 'none'
};

export default function Grid({
  config,
  onLayoutChange,
  draggableHandle,
  isDeletable,
  isResizable,
  isConfigurable,
  isDraggable,
  onEditWidget,
  rowHeightPixels = rowHeightPixelsFromSettings,
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
        width={width}
        containerPadding={containerPadding}
        breakpoints={breakpoints}
        isDraggable={isDraggable}
        isResizable={isResizable}
        onDragStop={forwardLayoutChange}
        onResizeStop={forwardLayoutChange}
        draggableHandle={`.${draggableHandle}`}
      >
        {config.widgets.map(widget => {
          const { Widget, minimumWidth, minimumHeight, onlyRenderInsideViewport } = widgets[widget.type];

          const widgetComponent = <Widget title={widget.title} config={widget.config} />;

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
              id={getWidgetId(widget.id)}
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
              {isConfigurable && (
                <SvgIcon
                  type="lib_actions_edit"
                  size="xs"
                  className={locals.edit}
                  onClick={() => onEditWidget(widget.id)}
                />
              )}
              {isDeletable && (
                <SvgIcon
                  type="lib_actions_delete"
                  size="xs"
                  className={locals.remove}
                  onClick={() => onRemoveWidget(widget.id)}
                />
              )}
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
