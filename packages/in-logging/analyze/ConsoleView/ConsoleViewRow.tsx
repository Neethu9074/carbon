/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { formatDateTime } from '@instana/format-date';
import { LogItem } from '@instana/types';

import { getLogMessageWithParams, LINE_HEIGHT, useAbsoluteUrlToItem } from 'in-logging/analyze/ConsoleView/utils';
import { getLogLevelColor } from 'in-logging/analyze/AnalyzeView/components/Charts/constants';
import { HighlightedText } from 'in-logging/analyze/ConsoleView/HighlightedText';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getLogLevel } from 'in-logging/analyze/AnalyzeView/logLevel';

import locals from 'in-logging/analyze/ConsoleView/ConsoleView.mless';

interface ConsoleViewRowProps {
  index: number;
  style: React.CSSProperties;
  logs: LogItem[];
  searchValue: string;
}

export function ConsoleViewRow({ index, style, logs, searchValue }: ConsoleViewRowProps) {
  const { goToPath } = useNavigation();

  const log = logs[index];
  const logLevel = getLogLevel(log.tags);
  const path = useAbsoluteUrlToItem(log.itemId);
  const triggerConsoleNavigation = () => goToPath(path.hash);

  const logMessage = getLogMessageWithParams(log);

  return (
    <div
      style={{
        ...style,
        overflow: 'hidden'
      }}
      onClick={() => {
        triggerConsoleNavigation();
      }}
      data-testid="logConsoleRow"
    >
      <div className={locals.logLine} style={{ lineHeight: `${LINE_HEIGHT}px` }}>
        <span>{formatDateTime(log.timestamp)}</span>
        <div className={locals.level} style={{ background: getLogLevelColor(logLevel) }} data-testid="logConsoleLevel">
          <span>{logLevel}</span>
        </div>
        <div className={locals.textContainer} data-testid="logConsoleMesage">
          <HighlightedText text={logMessage} keyword={searchValue} />
        </div>
      </div>
    </div>
  );
}
