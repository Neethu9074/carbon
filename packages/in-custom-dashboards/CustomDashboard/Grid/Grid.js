import { WidthProvider, Responsive } from 'react-grid-layout';
import React from 'react';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { rowHeightPixels, cols, margin, breakpoints } from 'in-custom-dashboards/CustomDashboard/Grid/settings';
import widgets from 'in-custom-dashboards/widgets';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Grid.mless';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function Grid({ config, onLayoutChange, isEditing, onEditWidget, onRemoveWidget }) {
  return (
    <ResponsiveReactGridLayout
      className="layout"
      cols={cols}
      rowHeight={rowHeightPixels}
      margin={[margin, margin]}
      breakpoints={breakpoints}
      isDraggable={isEditing}
      isResizable={isEditing}
      onDragStop={forwardLayoutChange}
      onResizeStop={forwardLayoutChange}
    >
      {config.widgets.map(widget => {
        const { Widget, minimumWidth, minimumHeight } = widgets[widget.type];
        return (
          <div
            key={widget.id}
            data-grid={{
              w: widget.width,
              h: widget.height,
              x: widget.x,
              y: widget.y,
              minW: minimumWidth,
              minH: minimumHeight
            }}
          >
            <Widget title={widget.title} config={widget.config} />
            {isEditing && (
              <SvgIcon
                type="lib_actions_edit"
                size="xs"
                className={locals.edit}
                onClick={() => onEditWidget(widget.id)}
              />
            )}
            {isEditing && (
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
