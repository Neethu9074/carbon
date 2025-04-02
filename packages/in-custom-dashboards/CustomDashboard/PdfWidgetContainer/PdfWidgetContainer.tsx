/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { forwardRef, useState, useEffect } from 'react';
import classNames from 'classnames';

import { Typography } from '@instana/components';

// @ts-expect-error needs ts migration
import { MemoizedWidgetContent } from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/CustomDashboard/PdfWidgetContainer/PdfWidgetContainer.mless';

const widgetCustomHeight = 250;

interface Props {
  widget: {
    id: string;
    title: string;
    width: number;
    height: number;
    x: number;
    y: number;
    type: string;
    config: any;
  };
  setIsReadyToExport: (value: boolean) => {};
}

const PdfWidgetContainer = forwardRef(({ widget, setIsReadyToExport }: Props, ref: any) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const widgetsWithoutMinWidth = ['pie', 'timeZones', 'bigNumber', 'applicationHealth'];
  const hasMinWidth = !widgetsWithoutMinWidth.includes(widget?.type);
  const isWidgetType = (type: string) => widget?.type === type;

  useEffect(() => {
    const checkLoadingStatus = () => {
      const reference = ref.current;
      const loadingSelectors = ['carbonSkeleton', 'loading-indicator', 'cds--skeleton'];
      if (reference) {
        const isLoading = loadingSelectors.some(selector => reference.querySelectorAll(`.${selector}`).length > 0);
        if (!isLoading && !hasLoaded) {
          clearInterval(interval);
          setIsReadyToExport(true);
          setHasLoaded(true);
        }
      }
    };

    const interval = setInterval(checkLoadingStatus, 200);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div
      ref={ref}
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
            <Typography variant="body-02">
              {t('in-custom-dashboards:customDashboard.customDashboard.widgetNotAvailableToBeExported')}
            </Typography>
          </div>
        ) : (
          <MemoizedWidgetContent widget={widget} customHeight={widgetCustomHeight} shouldRenderOutsideViewport />
        )}
      </div>
    </div>
  );
});

PdfWidgetContainer.displayName = 'PdfWidgetContainer';

export default PdfWidgetContainer;
