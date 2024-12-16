/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DashboardButton } from '@instana/components';

import locals from 'in-plg/pages/WelcomePage/quickLinks/QuickLinks.mless';

interface QuickLinkButtonProps {
  icon: string;
  iconDescription?: string;
  buttonName: string;
  href?: string;
  onClick?: () => void;
}

export const QuickLinkButton = ({ icon, iconDescription, buttonName, href, onClick }: QuickLinkButtonProps) => {
  return (
    <DashboardButton
      className={locals.buttonWithSeparator}
      size="md"
      kind="ghost"
      iconSize="xs"
      icon={icon}
      href={href}
      onClick={onClick}
      ariaLabel={buttonName}
      iconDescription={iconDescription ?? icon}
    >
      {buttonName}
    </DashboardButton>
  );
};
