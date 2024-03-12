/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc. 2023
 */

import React, { useEffect, useState } from 'react';

import { PermissionSet, Member } from '@instana/types';

import { getTenantsWithUnits } from 'in-api/account';
import config from 'in-services/config';
import { Trans } from 'in-i18n';

export interface Group {
  id: string;
  members: Member[];
  name: string;
  permissionSet: PermissionSet;
}

export interface CustomDeleteGroupMessageProps {
  group: Group;
  isContributorApplicationIdPresent: boolean;
  apCount: number;
}

const CustomDeleteGroupMessage = ({
  group,
  isContributorApplicationIdPresent,
  apCount
}: CustomDeleteGroupMessageProps) => {
  const [currentTenantWithUnits, setTenantsWithUnits] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const result$ = getTenantsWithUnits();
    result$.once(data => {
      const currentTenantWithUnits = data[config.tenant];
      setLoading(false);
      setTenantsWithUnits(currentTenantWithUnits);
    });
  }, []);

  if (loading) return <Trans i18nKey={'in-settings:tabs.loading'} />;
  return (
    <>
      <div>
        {Array.isArray(currentTenantWithUnits) && currentTenantWithUnits.length > 1 ? (
          <Trans i18nKey="in-settings:tabs.deleteGroupMessage" values={{ groupName: group?.name }} />
        ) : (
          <Trans i18nKey="in-settings:components.confirmRemoveItem" values={{ itemName: group?.name }} />
        )}
      </div>
      {isContributorApplicationIdPresent && (
        <div>
          <Trans i18nKey="in-settings:tabs.thisWillRemoveContributionFilterMessage" values={{ apCount }} />
          {Array.isArray(currentTenantWithUnits) && currentTenantWithUnits.length > 1 && (
            <>
              &nbsp; <Trans i18nKey="in-settings:tabs.thisWillRemoveContributionFilterFromOtherUnits" />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CustomDeleteGroupMessage;
