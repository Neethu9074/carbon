/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card, Stack, SvgIcon } from '@instana/components';

import locals from 'in-events/components/legacy/EventSummary.mless';

interface EventSummaryCardProps {
  summaryType: string | undefined;
  children: React.ReactNode;
}

export default function EventSummaryCard({ summaryType, children }: EventSummaryCardProps) {
  return (
    <Card className={locals.summaryCard}>
      <Stack direction="horizontal">
        <SvgIcon type={determineIconBasedOnSummaryType(summaryType)} />
        {children}
      </Stack>
    </Card>
  );
}

function determineIconBasedOnSummaryType(summaryType: string | undefined): string {
  if (summaryType === 'metric') {
    return 'lib_line_chart';
  } else if (summaryType === 'severity') {
    return 'lib_help_error_warning_outline';
  } else if (summaryType === 'topology') {
    return 'lib_synthetic_location';
  }
  return 'lib_help_error_info_outline';
}
