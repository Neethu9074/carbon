/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect } from 'react';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import { EventsTitle } from 'in-custom-dashboards/widgets/Table/eventsTable/TablePresenter';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { dataSources } from 'in-custom-dashboards/widgets/Table';
import Dialog from 'in-components/Dialog/Dialog';
import usePrevious from 'in-hooks/usePrevious';

import locals from 'in-custom-dashboards/CustomDashboard/ZoomWidgetDialog/ZoomWidgetDialog.mless';

// Tracks which widgets should not have a min width defined.
const widgetsWithoutMinWidth = ['pie', 'timeZones', 'bigNumber', 'applicationHealth'];

// Tracks which widgets should have a minimum height defined
const widgetsWithHeight = ['apdex', 'slo', 'slo2'];

const widgetCustomHeight = 450;

export default function ZoomWidgetDialog({ widget, component: Widget, close }: any) {
  const location = useLocation();
  const previousLocation = usePrevious(location);
  const hasMinWidth = !widgetsWithoutMinWidth.includes(widget.type);
  const hasHeight = widgetsWithHeight.includes(widget.type);

  const hasUrlChanged = previousLocation && !isEqual(location.pathname, previousLocation.pathname);

  // Closes the modal in case the url changes, preventing an issue when a redirection happens and the modal keeps opened.
  useEffect(() => {
    if (hasUrlChanged) {
      close();
    }
  }, [close, hasUrlChanged]);

  const {
    config,
    config: { actions, dragHandle },
    setApDialogOpen
  } = widget;

  const widgetTitle = getWidgetTitle(widget);
  return (
    <Dialog title={widgetTitle} onClose={close} className={locals.bottomMargin}>
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

function getWidgetTitle(widget: any) {
  if (widget.config.source === dataSources.EVENTS.type) {
    return <EventsTitle title={widget.title} config={widget.config} />;
  }
  return widget.title || '–';
}
