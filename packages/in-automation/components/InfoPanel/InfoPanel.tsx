/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { Link, CarbonButton } from '@instana/components';

// eslint-disable-next-line no-restricted-imports
import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { tryGet, trySet } from 'in-services/localStorage';
import { t } from 'in-i18n';

import locals from './InfoPanel.mless';

interface linkSpec {
  label: string;
  url?: string;
  trackKey?: string;
  trackCustom?: object;
}

interface contentColumn {
  title: string;
  text?: string;
  link?: linkSpec;
}

interface infoPanelProps {
  id?: string;
  ariaLabel?: string;
  collapsible?: boolean;
  showLabel?: string;
  hideLabel?: string;
  expanded?: string | boolean;
  stickyTitle?: boolean;
  content: {
    title?: string;
    columns: contentColumn[];
  };
}

export default function InfoPanel({
  id = 'infoPanel',
  collapsible = true,
  expanded = true,
  stickyTitle = false,
  content,
  ariaLabel,
  showLabel,
  hideLabel
}: infoPanelProps) {
  const [isExpanded, setIsExpanded] = useState(
    typeof expanded === 'string' ? (tryGet(expanded) ?? 'true') === 'true' : expanded
  );
  const { trackCta } = useSegmentTracking();

  function onLinkClick(param: linkSpec | undefined) {
    return function () {
      if (param?.trackKey) {
        trackCta(param.trackKey, param?.trackCustom ?? {});
      }
    };
  }

  const toggleVisibility = () => {
    setIsExpanded((prev: boolean) => {
      if (typeof expanded === 'string') {
        trySet(expanded, !prev ? 'true' : 'false');
      }
      return !prev;
    });
  };

  const showTitle = stickyTitle || isExpanded;

  return (
    <section
      id={id}
      aria-label={ariaLabel ? t(ariaLabel) : t('in-automation:infoPanel.taskGuidance')}
      className={classNames({
        [locals.panel]: showTitle,
        [locals.panelEmpty]: !showTitle
      })}
    >
      {showTitle && <h1 className={locals.contentTitle}>{content.title ?? null}</h1>}
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
                  onClick={onLinkClick(item?.link)}
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
          <CarbonButton
            kind="ghost"
            size="sm"
            className={locals.hideButton}
            renderIcon={() => (
              <IconForButton icon={isExpanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} iconSize="s" />
            )}
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
          </CarbonButton>
        </div>
      )}
    </section>
  );
}
