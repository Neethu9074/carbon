/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ButtonGroup, Stack } from '@instana/components';

import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { SloTimeWindowTypes } from 'in-service-levels/constants';
import { t } from 'in-i18n';

interface ContextAwareSloWidgetRightHeaderProps {
  actions: React.ReactNode;
  dragHandle: React.ReactNode;
}

export default function ContextAwareSloWidgetRightHeader({
  actions,
  dragHandle
}: ContextAwareSloWidgetRightHeaderProps) {
  const { selectedTimeWindowType, updateSelectedTimeWindowType } = useSloTimeWindowContext();

  return (
    <Stack direction="horizontal" gap="xxsmall">
      {dragHandle}
      {actions}
      <Stack gap="xxsmall">
        <ButtonGroup
          buttonPropsList={[
            {
              key: SloTimeWindowTypes.SELECTED_TIME,
              text: t('in-service-levels:sloDashboard.timeWindowSelection.timeWindow', {
                context: SloTimeWindowTypes.SELECTED_TIME
              }),
              onClick: () => updateSelectedTimeWindowType(SloTimeWindowTypes.SELECTED_TIME)
            },
            {
              key: SloTimeWindowTypes.SLO_TIME_WINDOW,
              text: t('in-service-levels:sloDashboard.timeWindowSelection.timeWindow', {
                context: SloTimeWindowTypes.SLO_TIME_WINDOW
              }),
              onClick: () => updateSelectedTimeWindowType(SloTimeWindowTypes.SLO_TIME_WINDOW)
            }
          ]}
          activeKey={selectedTimeWindowType}
        />
      </Stack>
    </Stack>
  );
}
