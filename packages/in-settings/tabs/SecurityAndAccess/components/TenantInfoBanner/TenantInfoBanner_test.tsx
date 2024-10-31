/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import TenantInfoBanner from 'in-settings/tabs/SecurityAndAccess/components/TenantInfoBanner/TenantInfoBanner';
import { useTenantUnitsInfo } from 'in-settings/hooks/useTenantUnitsInfo';
import config from 'in-services/config';
import { Trans, t } from 'in-i18n';

jest.mock('in-i18n', () => ({
  ...jest.requireActual('in-i18n'),
  t: (key: string) => key,
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey
}));
jest.mock('in-settings/hooks/useTenantUnitsInfo', () => ({
  useTenantUnitsInfo: jest.fn()
}));
describe('in-settings/tabs/SecurityAndAccess/components/TenantInfoBanner/TenantInfoBanner', () => {
  it('should show information banner if there are more than one units for the tenant', () => {
    (useTenantUnitsInfo as jest.Mock).mockReturnValue(true);
    const sectionInfo = 'in-settings:tabs.actionLogUnits';

    const { getByText } = render(
      <TenantInfoBanner>
        <Trans i18nKey={sectionInfo} values={{ tenantUnit: config.tenantUnit, tenant: config.tenant }} />
      </TenantInfoBanner>
    );

    expect(getByText(t(sectionInfo))).toBeInTheDocument();
  });

  it('should hide information banner if there are one unit for the tenant', () => {
    (useTenantUnitsInfo as jest.Mock).mockReturnValue(false);
    const sectionInfo = 'in-settings:tabs.apiTokenUnits';
    const { queryByText } = render(
      <TenantInfoBanner>
        <Trans i18nKey={sectionInfo} values={{ tenantUnit: config.tenantUnit, tenant: config.tenant }} />
      </TenantInfoBanner>
    );
    expect(queryByText(t(sectionInfo))).toBeNull();
  });
});
