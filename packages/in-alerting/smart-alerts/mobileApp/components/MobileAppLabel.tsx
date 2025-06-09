/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { ListSubtitle } from 'in-alerting/smart-alerts/components/list/ListSubtitle';
import getMobileApp from 'in-mobile-apps/subscriptions/getMobileApp';
import { Nullish } from 'in-types';

export default function MobileAppLabel({ mobileAppID }: { mobileAppID: string }) {
  const mobileAppLabel: string | Nullish = useObservable(getApplicationLabelObservable, [mobileAppID]);
  if (!mobileAppLabel) {
    return null;
  }
  return <ListSubtitle label={mobileAppLabel} icon="lib_mobile_app" />;
}

function getApplicationLabelObservable([id]: [id: string]) {
  if (!id) {
    return null;
  }
  return getMobileApp({ id }).map(result => result.data?.label);
}
