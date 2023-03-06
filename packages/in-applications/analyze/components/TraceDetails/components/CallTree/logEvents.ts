/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { LogEvent } from 'in-types';

interface Log {
  errorCount: number;
  label?: string;
  start: number;
  batchCount: number;
}

/**
 * Converts the new format of logs events to the old span based format, used by the
 * existing implementation of trace call tree.
 */
export function convertLogEventsToLogs(logEvents?: LogEvent[]): Log[] {
  return (
    logEvents?.reduce<Log[]>((accumulator, newValue) => {
      const newLog = mapLogEvenToLog(newValue);
      const existingLog = accumulator.find(event => event.start === newLog.start);
      if (existingLog != null) {
        if (newLog.errorCount > existingLog.errorCount) {
          existingLog.label = newLog.label;
        }
        existingLog.batchCount += newLog.batchCount;
      } else {
        accumulator.push(newLog);
      }
      return accumulator;
    }, []) ?? []
  );
}

function mapLogEvenToLog(logEvent: LogEvent): Log {
  return {
    errorCount: logEvent.level === 'ERROR' ? 1 : 0,
    label: logEvent.message,
    start: logEvent.timestamp,
    batchCount: logEvent.batchCount
  };
}
