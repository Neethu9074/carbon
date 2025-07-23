/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useCallback } from 'react';

import { IpMaskingConfiguration, Result } from '@instana/types';
import { Observable } from '@instana/observables';

import { getIpMaskingConfiguration, updateIpMaskingConfiguration } from 'in-mobile-apps/api/config';
import IpMasking from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/IpMasking';

export interface Props {
  mobileAppId: string;
}

export default function MobileAppIpMasking({ mobileAppId }: Props) {
  const get = useCallback<(v: void) => Observable<Result<IpMaskingConfiguration>>>(
    () => getIpMaskingConfiguration(mobileAppId),
    [mobileAppId]
  );
  const set = useCallback<(config: IpMaskingConfiguration) => Observable<Result<IpMaskingConfiguration>>>(
    config => updateIpMaskingConfiguration(mobileAppId, config),
    [mobileAppId]
  );
  return <IpMasking get={get} set={set} />;
}
