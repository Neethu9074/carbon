/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import RawStack, {
  RawStackFormatterType
} from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/RawStack';
import ButtonGroup from 'in-components/ButtonGroup';
import { t } from 'in-i18n';

import locals from './StackTrace.mless';

export type StackTraceFormatter = RawStackFormatterType;

export interface ChildrenProp {
  content: React.ReactNode;
  actions: React.ReactNode;
}

export interface StackTraceProp {
  formatter: RawStackFormatterType;
  stackTrace?: string;
  children: (props: ChildrenProp) => React.ReactElement;
}

export default function StackTrace({ stackTrace, formatter, children }: StackTraceProp) {
  const [showRawStackTrace, setShowRawStackTrace] = useState(false);

  return children({
    actions: (
      <ButtonGroup
        className={locals.buttonGroup}
        buttonPropsList={[
          {
            text: t('in-mobile-apps:sessionView.tabsSumCrashBeacon.stackTraceButtonPrettyStackTrace'),
            key: 'pretty',
            size: 'compact',
            onClick: () => setShowRawStackTrace(false)
          },
          {
            text: t('in-mobile-apps:sessionView.tabsSumCrashBeacon.stackTraceButtonRawStackTrace'),
            key: 'raw',
            size: 'compact',
            onClick: () => setShowRawStackTrace(true)
          }
        ]}
        activeKey={showRawStackTrace ? 'raw' : 'pretty'}
      />
    ),
    content: <RawStack formatter={showRawStackTrace ? 'raw' : formatter} stack={stackTrace} />
  });
}
