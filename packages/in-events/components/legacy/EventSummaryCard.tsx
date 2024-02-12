/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card, Stack, SvgIcon, Typography } from '@instana/components';

import locals from 'in-events/components/legacy/EventSummary.mless';

interface EventSummaryCardProps {
  content: string;
  summaryType: string;
}

export default function EventSummaryCard({ content, summaryType }: EventSummaryCardProps) {
  return (
    <Card className={locals.summaryCard}>
      <Stack direction="horizontal">
        <SvgIcon type={determineIconBasedOnSummaryType(summaryType)} />
        <Typography variant="body-regular">{content}</Typography>
      </Stack>
    </Card>
  );
}

function determineIconBasedOnSummaryType(summaryType: string): string {
  if (summaryType === 'metric') {
    return 'lib_line_chart';
  } else if (summaryType === 'severity') {
    return 'lib_help_error_warning_outline';
  }
  return 'lib_help_error_info_outline';
}
