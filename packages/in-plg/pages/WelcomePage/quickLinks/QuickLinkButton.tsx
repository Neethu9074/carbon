/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonButton } from '@instana/components';

import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';

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
    <CarbonButton
      className={locals.buttonWithSeparator}
      size="md"
      kind="ghost"
      href={href}
      renderIcon={() => <IconForButton icon={icon} iconSize="xs" />}
      onClick={onClick}
      aria-label={buttonName}
      iconDescription={iconDescription ?? icon}
    >
      {buttonName}
    </CarbonButton>
  );
};
