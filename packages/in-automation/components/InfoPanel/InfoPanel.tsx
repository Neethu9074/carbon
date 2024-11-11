/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { DashboardButton, SvgIconSizes, Link } from '@instana/components';

import { tryGet, trySet } from 'in-services/localStorage';
import { t } from 'in-i18n';

import locals from './InfoPanel.mless';

interface contentColumn {
  title: string;
  text?: string;
  link?: {
    label: string;
    url?: string;
  };
}

interface infoPanelProps {
  id?: string;
  ariaLabel?: string;
  collapsible?: boolean;
  showLabel?: string;
  hideLabel?: string;
  expanded?: string | boolean;
  content: {
    title?: string;
    columns: contentColumn[];
  };
}

export default function InfoPanel({
  id = 'infoPanel',
  collapsible = true,
  expanded = true,
  content,
  ariaLabel,
  showLabel,
  hideLabel
}: infoPanelProps) {
  const [isExpanded, setIsExpanded] = useState(
    typeof expanded === 'string' ? (tryGet(expanded) ?? 'true') === 'true' : expanded
  );

  const toggleVisibility = () => {
    setIsExpanded((prev: boolean) => {
      if (typeof expanded === 'string') {
        trySet(expanded, !prev ? 'true' : 'false');
      }
      return !prev;
    });
  };

  return (
    <section
      id={id}
      aria-label={ariaLabel ? t(ariaLabel) : t('in-automation:infoPanel.taskGuidance')}
      className={locals.panel}
    >
      <h1 className={locals.contentTitle}>{content.title ?? null}</h1>
      {isExpanded && (
        <div className={locals.contentContainer}>
          {content.columns.map(item => {
            return (
              <div className={locals.columnContainer}>
                <div>
                  <div className={locals.columnTitle}>{item?.title}</div>
                  <div className={locals.columnText}>{item?.text}</div>
                </div>
                <Link
                  className={locals.linkButton}
                  href={item?.link?.url}
                  external
                  linkIconType="lib_arrow_short_right"
                >
                  <span>{item?.link?.label}</span>
                </Link>
              </div>
            );
          })}
        </div>
      )}
      {collapsible && (
        <div id="infoPanelFooter" className={locals.buttonSection}>
          <DashboardButton
            kind="ghost"
            size="sm"
            className={locals.hideButton}
            icon={isExpanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
            iconSize={SvgIconSizes.s}
            onClick={toggleVisibility}
          >
            <span>
              {' '}
              {isExpanded
                ? hideLabel
                  ? t(hideLabel)
                  : t('in-automation:infoPanel.hideTasks')
                : showLabel
                ? t(showLabel)
                : t('in-automation:infoPanel.showTasks')}{' '}
            </span>
          </DashboardButton>
        </div>
      )}
    </section>
  );
}
