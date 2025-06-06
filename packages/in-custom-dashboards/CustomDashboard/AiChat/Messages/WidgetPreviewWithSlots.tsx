/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button, Layer, Stack } from '@instana/carbon';
import { LoadingSkeleton } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import { CreateWidgetResponse, FinalConfig } from 'in-custom-dashboards/CustomDashboard/AiChat/types';
// @ts-expect-error not yet ts migrated
import widgets from 'in-custom-dashboards/widgets';
import { promptGetWidgetJson } from 'in-custom-dashboards/api';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import { Widget } from 'in-types';

export function WidgetPreviewWithSlots({
  slots,
  onAddPromptedWidget
}: {
  slots: FinalConfig;
  onAddPromptedWidget: (widget: Widget) => void;
}) {
  const result: Result<CreateWidgetResponse> =
    useObservable(() => promptGetWidgetJson(slots), [slots]) ?? pendingResult;

  if (isLoading(result)) {
    return <LoadingSkeleton />;
  }
  // just for catching and errors: skip rendering if no data available
  if (!result.data) return null;

  const { type, config, title } = result.data.widgetConfig;
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
            <Button onClick={() => onAddPromptedWidget(result.data?.widgetConfig!)}>Go for it!</Button>
          </Stack>
        </Layer>
      )}
    </>
  );
}
