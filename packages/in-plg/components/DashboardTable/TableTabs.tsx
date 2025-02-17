/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { Children } from 'react';

import { CarbonTabs, CarbonTabList, CarbonTabPanels } from '@instana/components';
import { t } from '@instana/i18n-react';

import { TableTabsProps } from 'in-plg/components/DashboardTable/types';

export const TableTabs: React.FC<TableTabsProps> = ({
  className,
  children,
  selectedIndex = -1,
  activation,
  panels
}) => {
  // @ts-expect-error We need to extract children props which might not exist if we don't send the correct children from Tabs.
  const childrenProps = Children.toArray(children).map(child => child?.props);
  const foundIndex = selectedIndex !== -1 ? selectedIndex : childrenProps.findIndex(c => c.isActive);

  const onChange = ({ selectedIndex: newIndex }: { selectedIndex: number }) => {
    const { href, onClick } = childrenProps[newIndex];
    if (onClick) {
      onClick();
    }

    if (href) {
      window.location.href = href;
    }
  };
  return (
    <CarbonTabs selectedIndex={foundIndex} onChange={onChange}>
      <CarbonTabList
        activation={activation}
        className={className}
        aria-label={t('in-plg:welcomepage.ariaLabel.tabs')}
        contained
      >
        {children}
      </CarbonTabList>
      <CarbonTabPanels>{panels}</CarbonTabPanels>
    </CarbonTabs>
  );
};
