/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// eslint-disable-next-line no-restricted-imports
import { SideNavLink } from '@carbon/react';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { t } from 'in-i18n';

import locals from './MoreMenuItem.mless';

export type MenuItemProps = {
  /**
   * Pass id to contained anchor element
   */
  id?: string;

  /**
   * Page target when clicked
   */
  href?: string;

  /**
   * Function called when item is clicked
   */
  onClick?: () => void;

  /**
   * Label of menu item
   */
  label?: string | React.ReactNode;

  /**
   * icon type name
   */
  icon?: string;
};

/**
 * Menu Item in UIShell, that
 *
 * has a special styling for showing an external link "punch-out" icon, and
 * uses a special handling of opening the given link in a separate window.
 *
 * Temporary component, as requested while solis qa testing in July - will be removed for September solis release!!
 */
export const MenuItemWithExternalLink = ({ id, icon, onClick, href, label }: MenuItemProps) => {
  let iconElement = undefined;

  if (icon) {
    iconElement = () => (
      <span className="iconAndIndicator">
        <SvgIcon size="s" type={icon} />
      </span>
    );
  }

  // Get isActive value or observable result
  //const clientLocationOptional = clientLocation ? [clientLocation] : [];
  //const isActiveResult = isActive$ ? isActiveObs : isActive;

  const handleClickOrEnter = (e: React.SyntheticEvent) => {
    // Optional onClick prop
    if (onClick) {
      onClick();
    }
    // UI shell does not support target=_blank natively
    if (href !== null) {
      window.open(href, '_blank', 'noreferrer');
    }
    e.preventDefault();
  };

  // Capture "enter" key interaction on MenuItem
  const handleKeyUp = (e: React.KeyboardEvent<any>) => {
    if (e.key === 'Enter') {
      handleClickOrEnter(e);
    }
  };

  const tabOptions: { tabIndex?: number } = {};
  if (onClick) {
    // Ensure element is tabbable when onClick is defined
    // 0 means sequential navigation (standard behavior)
    tabOptions.tabIndex = 0;
  }

  return (
    <SideNavLink
      id={id}
      className={locals.menuWithExternalLink}
      onClick={handleClickOrEnter}
      onKeyUp={handleKeyUp}
      href={href}
      renderIcon={iconElement}
      {...tabOptions}
    >
      <span>{label}</span>
      <span className="cds--visually-hidden">{t('in-components:accessibility.opensNewTab')}</span>
      <SvgIcon size="xs" type="lib_views_external_link" />
    </SideNavLink>
  );
};
