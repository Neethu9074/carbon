/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { FormatedStackTrace } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/StackTrace/BeaconStackParser';
import RawStack from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/StackTrace/RawStack';
import ButtonGroup from 'in-components/ButtonGroup';
import { t } from 'in-i18n';

import locals from './StackTraceContainer.mless';

export interface ChildrenProp {
  content: React.ReactNode;
  actions: React.ReactNode;
}

export type StackTraceProp = {
  pretty: boolean;
  onChange: (pretty: boolean) => void;
  data: FormatedStackTrace;
  children: (props: ChildrenProp) => React.ReactElement;
};

export default function StackTraceContainer({ data, onChange, pretty, children }: StackTraceProp) {
  return children({
    actions: data.supportPretty ? (
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
