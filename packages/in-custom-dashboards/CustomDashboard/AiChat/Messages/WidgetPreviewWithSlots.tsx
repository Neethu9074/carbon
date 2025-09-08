/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button, Layer, Stack } from '@instana/carbon';
import { LoadingSkeleton } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Widget } from '@instana/types';

// @ts-expect-error not yet ts migrated
import widgets from 'in-custom-dashboards/widgets';
import { FinalConfig } from 'in-custom-dashboards/CustomDashboard/AiChat/types';
import { promptGetWidgetJson } from 'in-custom-dashboards/api';

export function WidgetPreviewWithSlots({
  slots,
  onAddPromptedWidget
}: {
  slots: FinalConfig;
  onAddPromptedWidget: (widget: Widget) => void;
}) {
  const widgetResponse = useObservable(() => promptGetWidgetJson(slots), [slots]);

  if (!widgetResponse) {
    return <LoadingSkeleton />;
  }

  // Skip rendering if no data available
  if (!widgetResponse.widgetConfig) return null;

  const { type, config, title } = widgetResponse.widgetConfig;
  const widgetPreview = widgets[type];

  // TODO: handle conditional return better.
  return (
    <>
      {widgetPreview && config && title && (
        <Layer>
          <Stack gap={4} orientation="vertical">
            <span>This is a preview of the widget:</span>
            <widgetPreview.Widget title={title || '–'} config={config} isPreview />
            <span>Do you want me to paste this onto the dashboard?</span>
            <Button onClick={() => onAddPromptedWidget(widgetResponse.widgetConfig!)}>Go for it!</Button>
          </Stack>
        </Layer>
      )}
    </>
  );
}

// Made with Bob
