/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { find } from 'lodash';

import { RawStackData } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/StackTrace/RawStack';
import { MobileAppMonitoringBeacon } from 'in-types';

export interface StackTraceType {
  threads: Array<StackTraceThreadDesc>;
  binaryImages: Array<BinaryImageDesc>;
  header: Array<HeaderDesc>;
}

export interface StackTraceThreadDesc {
  state?: 'attributed';
  st: Array<StackTraceThreadFrameDesc>;
}

export type StackTraceThreadFrameType = 'user' | 'system' | 'other';

export interface StackTraceThreadFrameDesc {
  n?: string; // name
  a?: string; // address
  f?: string; // function
  o?: string; // offset
  t?: string; // translated function
}

export interface BinaryImageDesc {
  a1?: string; // addressBegin
  a2?: string; // addressEnd
  n?: string; // name
  id?: string; // id
  p?: string; // path
  a?: string; // architecture
}

export interface HeaderDesc {
  k: string; // key
  v?: string; // value
}

export type FormatedStackTrace = {
  supportPretty: boolean;
} & RawStackData;

function isIOS(beacon: MobileAppMonitoringBeacon) {
  return beacon.platform?.toLowerCase() === 'ios';
}

function isAndroid(beacon: MobileAppMonitoringBeacon) {
  return beacon.platform?.toLowerCase() === 'android';
}

function isPrettySupported(beacon: MobileAppMonitoringBeacon) {
  return isIOS(beacon);
}

function formatStackTraceJsonAsText(stacktrace: StackTraceType): string {
  const SEPERATOR = '\n';
  if (!stacktrace) {
    return '';
  }

  const buffArr: Array<string> = [];
  for (const h of stacktrace.header ?? []) {
    buffArr.push(`${h.k}: ${h.v ?? ''}`);
  }
  buffArr.push(SEPERATOR);

  for (const [idx, t] of (stacktrace.threads ?? []).entries()) {
    const isCrashed = t.state === 'attributed';
    buffArr.push(`Thread ${idx}${isCrashed ? ' Crashed' : ''}:`);
    for (const [frameIdx, frame] of (t.st ?? []).entries()) {
      buffArr.push(`${frameIdx} ${frame.n} ${frame.a} ${frame.t || frame.f}${frame.o ? ' + ' + frame.o : ''}`);
    }
    buffArr.push(SEPERATOR);
  }

  buffArr.push('Binary Images:');
  for (const bi of stacktrace.binaryImages ?? []) {
    buffArr.push(`0x${bi.a1 ?? '         '} -  ${bi.n} <${bi.id}>`);
  }

  return buffArr.join(SEPERATOR);
}

function formatStackTraceJson(
  beacon: MobileAppMonitoringBeacon,
  pretty: boolean,
  isUserImageFunc: (item: BinaryImageDesc) => boolean
): FormatedStackTrace {
  if (!beacon.stackTrace) {
    return {
      format: 'raw',
      stack: beacon.stackTrace,
      supportPretty: false
    };
  }

  try {
    const stacktrace = JSON.parse(beacon.stackTrace) as StackTraceType;
    if (!stacktrace?.threads?.length || !pretty) {
      return {
        format: 'raw',
        stack: formatStackTraceJsonAsText(stacktrace),
        supportPretty: !!stacktrace?.threads?.length
      };
    }
    const userImageSet = new Set(
      stacktrace.binaryImages.filter(item => item && isUserImageFunc(item)).map(item => item.n?.toLowerCase())
    );
    const crashedThread = find(stacktrace.threads, { state: 'attributed' });
    return {
      format: 'stack-json',
      stack: crashedThread ?? stacktrace.threads[0],
      supportPretty: true,
      analyzeFrame: frame => {
        if (!frame.n || frame.f?.startsWith('<')) {
          return 'other';
        }
        return userImageSet.has(frame.n.toLowerCase()) ? 'user' : 'system';
      }
    };
  } catch (error) {
    return {
      format: 'raw',
      stack: beacon.stackTrace,
      supportPretty: false
    };
  }
}

function formatStackTraceIOS(beacon: MobileAppMonitoringBeacon, pretty: boolean): FormatedStackTrace {
  // Application bundles usually resides in private/var folder on iOS, so we use this to check if it is a user image
  // see also https://www.theiphonewiki.com/wiki//private/var
  return formatStackTraceJson(beacon, pretty, item => !!item.p?.toLowerCase().startsWith('/private/var'));
}

export function formatStackTrace(beacon: MobileAppMonitoringBeacon, pretty: boolean): FormatedStackTrace {
  if (isIOS(beacon)) {
    return formatStackTraceIOS(beacon, pretty);
  }

  return {
    format: isAndroid(beacon) ? 'stack-java' : 'raw',
    stack: beacon.stackTrace,
    supportPretty: isPrettySupported(beacon)
  };
}
