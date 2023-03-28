/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Stack, SvgIcon } from '@instana/components';

import { useScrollToFirstInvalidNavItem } from 'in-components/StepsContainer/useScrollToFirstInvalidNavItem';
import MessageStack, { MessageType } from 'in-components/MessageStack/MessageStack';
import ScrollStep from 'in-components/StepsContainer/ScrollStep';
import SideNav, { NavItem } from 'in-components/SideNav';
import Divider from 'in-components/workspace/Divider';
import Header from 'in-components/workspace/Header';
import Tooltip from 'in-components/Tooltip';
import theme from 'in-themes';

import locals from './StepsContainer.mless';

interface StepsContainerProps {
  navItems: NavItem[];
  messages?: MessageType[];
  noHeader?: boolean;
  noDivider?: boolean;
}

export default function StepsContainer({ navItems, noHeader, noDivider, messages = [] }: StepsContainerProps) {
  useScrollToFirstInvalidNavItem(navItems);

  return (
    <nav className={locals.container}>
      <div className={locals.scrollWrapper}>
        <div className={locals.content}>
          <Stack gap="large">
            {navItems.map(({ scrollId, title, content, titleToolTipText }, i) => (
              <Fragment key={scrollId}>
                <ScrollStep id={scrollId}>
                  <Stack gap="normal">
                    {!noHeader && (
                      <Header>
                        <Stack gap="xxsmall" direction="horizontal">
                          {title}
                          {titleToolTipText && (
                            <Tooltip align="bottomMiddle" content={titleToolTipText}>
                              <SvgIcon
                                className={locals.helpicon}
                                type="lib_help_error_error_outline"
                                color={theme.lib.colors.N600Light}
                              />
                            </Tooltip>
                          )}
                        </Stack>
                      </Header>
                    )}
                    {content}
                  </Stack>
                </ScrollStep>
                {!noDivider && i + 1 < navItems.length && <Divider />}
              </Fragment>
            ))}
          </Stack>
        </div>
      </div>
      <div className={locals.sideNav}>
        <SideNav
          navItems={navItems}
          renderPostIcon={({ valid }) => {
            if (valid) return null;
            return <SvgIcon className={locals.icon} type="lib_help_error_error_circle" size="xs" />;
          }}
        />
      </div>
      <MessageStack className={locals.errorInfo} messages={messages} />
    </nav>
  );
}
