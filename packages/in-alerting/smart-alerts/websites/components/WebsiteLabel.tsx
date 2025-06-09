/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { ListSubtitle } from 'in-alerting/smart-alerts/components/list/ListSubtitle';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { Nullish } from 'in-types';

export default function WebsiteLabel({ websiteId }: { websiteId: string }) {
  const websiteLabel: string | Nullish = useObservable(getApplicationLabelObservable, [websiteId]);
  if (!websiteLabel) {
    return null;
  }
  return <ListSubtitle label={websiteLabel} icon="lib_website" />;
}

function getApplicationLabelObservable([id]: [id: string]) {
  if (!id) {
    return null;
  }
  return getWebsite({ id }).map(result => result.data?.label);
}
