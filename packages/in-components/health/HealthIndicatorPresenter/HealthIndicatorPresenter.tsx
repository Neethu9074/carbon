/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { LegacyRef, RefObject } from 'react';
import classNames from 'classnames';

import { IconButton, SvgIcon, SvgIconSizes } from '@instana/components';
import { themes } from '@instana/design-tokens';

import { getDesignLibraryColorBySeverity, getDesignLibrarySeverityIcon } from 'in-stores/events';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './HealthIndicatorPresenter.mless';

interface Props {
  openIssues: number;
  maxSeverity: number;
  active: boolean;
  refSetter?: LegacyRef<HTMLAnchorElement>;
  onClick?: () => void;
  tooltipLabel?: string;
  size?: 'regular' | 'xs' | 'l' | undefined;
  /**
   * When set, it won't embed it in a tooltip or button
   */
  iconOnly?: boolean;
  /**
   * Optional value for specifying the size of the icon - default value is 'xs'
   */
  iconOnlySize?: keyof typeof SvgIconSizes;
}

export default function HealthIndicatorPresenter({
  openIssues,
  maxSeverity,
  active,
  refSetter,
  onClick,
  tooltipLabel: explanation,
  // Define the IconButton size you want to use
  // 32px, 40px, 48px Button Size
  // 16px, 24px, 28px Icon size
  size = 'xs',
  iconOnly = false,
  iconOnlySize = 'xs'
}: Props) {
  const tooltipLabel = explanation ?? getTooltipLabel(openIssues, maxSeverity);

  // Green status!
  if (openIssues === 0) {
    return (
      <>
        {iconOnly ? (
          <div className={locals.okayIcon}>
            <SvgIcon type="lib_uncheck" color={themes.default.ids.color.option.green[500]} size={iconOnlySize} />
          </div>
        ) : (
          <Tooltip content={tooltipLabel} delay={500}>
            <IconButton
              type="lib_uncheck"
              color={themes.default.ids.color.option.green[500]}
              iconSize={size}
              className={classNames({
                [locals.okayIcon]: true
              })}
            />
          </Tooltip>
        )}
      </>
    );
  }

  // Warnings or Error status
  const color = active ? '#031F29' : getDesignLibraryColorBySeverity(maxSeverity);
  const type = getDesignLibrarySeverityIcon(maxSeverity);

  const statusContents = (
    <>
      {iconOnly ? (
        <div
          className={classNames({
            [locals.icon]: true,
            [locals.iconWarning]: !(maxSeverity > 5) && maxSeverity !== 0
          })}
        >
          <SvgIcon type={type} size={iconOnlySize} color={color} />
        </div>
      ) : (
        <Tooltip content={tooltipLabel} delay={500}>
          <IconButton
            type={type}
            color={color}
            iconSize={size}
            className={classNames({
              [locals.icon]: true,
              [locals.iconWarning]: !(maxSeverity > 5) && maxSeverity !== 0
            })}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (onClick) {
                onClick();
              }
            }}
          />
        </Tooltip>
      )}
    </>
  );

  // If no refSetter is passed we dont we can simply render the status icon as is
  // because there is no overlay to render.  Allows for more usability of this component
  if (refSetter) {
    return <div ref={refSetter as unknown as RefObject<HTMLDivElement>}>{statusContents}</div>;
  } else {
    return statusContents;
  }
}

function getTooltipLabel(openIssues: number, maxSeverity: number): string {
  if (openIssues === 0) {
    return t('in-components:health.noIssues');
  }

  if (maxSeverity > 5) {
    return t('in-components:health.labelCritical');
  }

  return t('in-components:health.labelWarning');
}
