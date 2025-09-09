/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import ViewSwitcher from 'in-gen-ai-observability/Dashboard/ViewSwitcher';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface GenAiObservabilityLayoutProps {
  children: React.ReactNode;
  timeConfig?: TimeConfig;
}

/**
 * Layout component that wraps all Gen AI Observability pages
 * Ensures ViewSwitcher is included in all pages
 */
export default function GenAiObservabilityLayout({
  children,
  timeConfig: propTimeConfig
}: GenAiObservabilityLayoutProps) {
  const hookTimeConfig = useTimeConfig();
  const timeConfig = propTimeConfig || hookTimeConfig;

  return (
    <>
      <ViewSwitcher timeConfig={timeConfig} />
      {children}
    </>
  );
}
