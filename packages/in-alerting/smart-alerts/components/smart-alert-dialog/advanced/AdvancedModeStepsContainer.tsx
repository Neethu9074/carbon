/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Stack, SvgIcon } from '@instana/components';

import {
  MessageType,
  SmartAlertErrorMessages
} from 'in-alerting/smart-alerts/components/smart-alert-dialog/components/SmartAlertErrorMessages';
import { useScrollToFirstInvalidNavItem } from 'in-alerting/smart-alerts/applications/hooks/useScrollToFirstInvalidNavItem';
import ScrollStep from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ScrollStep';
import SideNav, { NavItem } from 'in-components/SideNav';
import Divider from 'in-components/workspace/Divider';
import Header from 'in-components/workspace/Header';

import locals from './AdvancedModeStepsContainer.mless';

export default function AdvancedModeStepsContainer({
  navItems,
  messages = []
}: {
  navItems: NavItem[];
  messages?: MessageType[];
}) {
  useScrollToFirstInvalidNavItem(navItems);

  return (
    <nav className={locals.container}>
      <div className={locals.scrollWrapper}>
        <div className={locals.content}>
          <Stack gap="large">
            {navItems.map(({ scrollId, title, content }, i) => (
              <Fragment key={scrollId}>
                <ScrollStep id={scrollId}>
                  <Stack gap="normal">
                    <Header>{title}</Header>
                    {content}
                  </Stack>
                </ScrollStep>
                {i + 1 < navItems.length && <Divider />}
              </Fragment>
            ))}
          </Stack>
        </div>
      </div>
      <div className={locals.sideNav}>
        <SideNav navItems={navItems} renderPostIcon={renderIcon} />
      </div>
      <SmartAlertErrorMessages className={locals.errorInfo} messages={messages} />
    </nav>
  );
}

AdvancedModeStepsContainer.propTypes = {
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      scrollId: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      checked: PropTypes.bool,
      valid: PropTypes.bool,
      content: PropTypes.element
    })
  ).isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      level: PropTypes.oneOf(['warning', 'error']),
      message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
      code: PropTypes.string
    })
  )
};

function renderIcon({ valid }: NavItem) {
  if (valid) return null;

  return <SvgIcon className={locals.icon} type="lib_help_error_error_circle" size="xs" />;
}
