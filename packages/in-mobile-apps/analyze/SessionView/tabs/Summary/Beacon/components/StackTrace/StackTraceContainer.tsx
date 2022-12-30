/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import RawStack, {
  RawStackData
} from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/StackTrace/RawStack';
import ButtonGroup from 'in-components/ButtonGroup';
import { t } from 'in-i18n';

import locals from './StackTraceContainer.mless';

export interface ChildrenProp {
  content: React.ReactNode;
  actions: React.ReactNode;
}

export type StackTraceProp = {
  supportPretty: boolean;
  pretty: boolean;
  onChange: (pretty: boolean) => void;
  data: RawStackData;
  children: (props: ChildrenProp) => React.ReactElement;
};

export default function StackTraceContainer({ data, supportPretty, onChange, pretty, children }: StackTraceProp) {
  return children({
    actions: supportPretty ? (
      <ButtonGroup
        className={locals.buttonGroup}
        buttonPropsList={[
          {
            text: t('in-mobile-apps:sessionView.tabsSumCrashBeacon.stackTraceButtonPrettyStackTrace'),
            key: 'pretty',
            size: 'compact',
            onClick: () => onChange(true)
          },
          {
            text: t('in-mobile-apps:sessionView.tabsSumCrashBeacon.stackTraceButtonRawStackTrace'),
            key: 'raw',
            size: 'compact',
            onClick: () => onChange(false)
          }
        ]}
        activeKey={pretty ? 'pretty' : 'raw'}
      />
    ) : (
      <></>
    ),
    content: <RawStack data={data} />
  });
}
