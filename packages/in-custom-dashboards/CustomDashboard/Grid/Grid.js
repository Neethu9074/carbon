import { WidthProvider, Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import React from 'react';

import {
  rowHeightPixels,
  cols,
  margin,
  breakpoints,
  containerPadding
} from 'in-custom-dashboards/CustomDashboard/Grid/settings';
import widgets from 'in-custom-dashboards/widgets';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Grid.mless';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function Grid({
  config,
  onLayoutChange,
  isEditing,
  isDeletable,
  isResizable,
  isConfigurable,
  isDraggable,
  onEditWidget,
  onRemoveWidget
}) {
  return (
    <ResponsiveReactGridLayout
      className={locals.layout}
      cols={cols}
      rowHeight={rowHeightPixels}
      margin={margin}
      containerPadding={containerPadding}
      breakpoints={breakpoints}
      isDraggable={isEditing && isDraggable}
      isResizable={isEditing && isResizable}
      onDragStop={forwardLayoutChange}
      onResizeStop={forwardLayoutChange}
    >
      {config.widgets.map(widget => {
        const { Widget, minimumWidth, minimumHeight } = widgets[widget.type];
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
          >
            <Widget title={widget.title} config={widget.config} />
            {isEditing &&
              isConfigurable && (
                <SvgIcon
                  type="lib_actions_edit"
                  size="xs"
                  className={locals.edit}
                  onClick={() => onEditWidget(widget.id)}
                />
              )}
            {isEditing &&
              isDeletable && (
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
    </ResponsiveReactGridLayout>
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
