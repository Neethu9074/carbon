/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import { find } from 'lodash';
import React from 'react';

import { Typography } from '@instana/components';

// @ts-expect-error needs ts migration
import { MemoizedWidgetContent } from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import { useCustomDashboardContext } from 'in-custom-dashboards/CustomDashboard/CustomDashboardContext';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/CustomDashboard/DownloadPdf/components/PdfWidgetContainer/PdfWidgetContainer.mless';

const widgetCustomHeight = 250;

interface Props {
  widgetId: string;
}

/**
 * This component is used to export the widgets to be printed in the pdf.
 * This is needed, because some widgets needs some adjustments to fit better in the pdf.
 * This is only concerning to the custom dashboards area.
 */
export default function PdfWidgetContainer({ widgetId }: Readonly<Props>) {
  const { widgets } = useCustomDashboardContext();
  const widget = find(widgets, eachWidget => widgetId === eachWidget.id);
  const widgetsWithoutMinWidth = ['pie', 'timeZones', 'bigNumber', 'applicationHealth'];
  const hasMinWidth = !widgetsWithoutMinWidth.includes(widget?.type ?? '');
  const isWidgetType = (type: string) => widget?.type === type;

  return (
    <div
      data-testid="pdf-widget-container"
      className={classNames({
        [locals.container]: true,
        [locals.slo]: isWidgetType('slo') || isWidgetType('slo2'),
        [locals.apdex]: isWidgetType('apdex'),
        [locals.timeseries]: isWidgetType('chart'),
        [locals.histogram]: isWidgetType('histogram'),
        [locals.markdown]: isWidgetType('markdown')
      })}
    >
      <div
        className={classNames({
          [locals.content]: hasMinWidth,
          [locals.height]: isWidgetType('slo') || isWidgetType('slo2') || isWidgetType('apdex')
        })}
      >
        {isWidgetType('iframe') ? (
          <div className={locals.iframe}>
            <Typography variant="body-02">{t('in-components:downloadPdf.widgetNotAvailableToBeExported')}</Typography>
          </div>
        ) : (
          <MemoizedWidgetContent widget={widget} customHeight={widgetCustomHeight} shouldRenderOutsideViewport />
        )}
      </div>
    </div>
  );
}
