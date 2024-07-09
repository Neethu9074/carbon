/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';

import { Message } from '@instana/components';

import { useTenantUnitsInfo } from 'in-settings/hooks/useTenantUnitsInfo';

import locals from './TenantInfoBanner.mless';

interface TenantInfoBannerProps {
  children: ReactNode;
}

export default function TenantInfoBanner({ children }: TenantInfoBannerProps) {
  const showTenantInfo = useTenantUnitsInfo();

  return showTenantInfo ? (
    <Message className={locals.tenant_info_message} type={'neutral'} inline withIcon>
      {children}
    </Message>
  ) : (
    <></>
  );
}
