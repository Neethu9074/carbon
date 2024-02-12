/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import Dialog from 'in-components/Dialog/Dialog';

import locals from 'in-custom-dashboards/CustomDashboard/ZoomWidgetDialog/ZoomWidgetDialog.mless';

// Tracks which widgets should not have a min width defined.
const widgetsWithoutMinWidth = ['pie', 'timeZones', 'bigNumber', 'applicationHealth'];

// Tracks which widgets should have a minimum height defined
const widgetsWithHeight = ['apdex', 'slo'];

const widgetCustomHeight = 450;

export default function ZoomWidgetDialog({ widget, component: Widget, close }: any) {
  const hasMinWidth = !widgetsWithoutMinWidth.includes(widget.type);
  const hasHeight = widgetsWithHeight.includes(widget.type);

  const {
    config,
    config: { actions, dragHandle },
    setApDialogOpen
  } = widget;

  return (
    <Dialog title={widget.title || '–'} onClose={close}>
      <div
        className={classNames({
          [locals.container]: hasMinWidth,
          [locals.height]: hasHeight
        })}
      >
        <Widget
          actions={actions}
          dragHandle={dragHandle}
          config={config}
          setApDialogOpen={setApDialogOpen}
          height={widgetCustomHeight}
          customHeight={widgetCustomHeight}
          isInModal
        />
      </div>
    </Dialog>
  );
}
