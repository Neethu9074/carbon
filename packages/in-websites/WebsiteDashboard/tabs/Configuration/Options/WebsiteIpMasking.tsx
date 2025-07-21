/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useCallback } from 'react';

import { IpMaskingConfiguration, Result } from '@instana/types';
import { Observable } from '@instana/observables';

import { getIpMaskingConfiguration, updateIpMaskingConfiguration } from 'in-websites/api/websites';
import IpMasking from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/IpMasking';

export interface Props {
  websiteId: string;
}

export default function WebsiteIpMasking({ websiteId }: Props) {
  const get = useCallback<(v: void) => Observable<Result<IpMaskingConfiguration>>>(
    () => getIpMaskingConfiguration(websiteId),
    [websiteId]
  );
  const set = useCallback<(config: IpMaskingConfiguration) => Observable<Result<IpMaskingConfiguration>>>(
    config => updateIpMaskingConfiguration(websiteId, config),
    [websiteId]
  );
  return <IpMasking get={get} set={set} />;
}
