/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { Button, ButtonKinds, Link, SvgIcon } from '@instana/components';
import { Observable } from '@instana/observables';

import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import { decimalSeparator, thousandsSeparator } from 'in-services/formatters/number';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import useResizeObserver from 'in-hooks/useResizeObserver';
import Tooltip from 'in-components/Tooltip';
import { ResultPrecision } from 'in-types';
import { t } from 'in-i18n';

import locals from './KpiCard.mless';

const valueSplitRegExp = new RegExp(`^([0-9\\${decimalSeparator}\\${thousandsSeparator}]+)(.*)$`);

export interface IconAction {
  text: string;
  icon: string;
  kind?: keyof typeof ButtonKinds;
  href$: Observable<string>;
  onClick?: (e: any) => void;
}

export interface KpiCardProps {
  title: string;
  value?: any;
  actions?: ReactNode;
  companionValue?: ReactNode;
  /* 
  When true, print out the whole value without special formatting
  When false, the numeric value will have a greater font size than the rest, usually the unit
  */
  raw?: boolean;
  renderValue?: (value?: any) => ReactNode;
  children?: ReactNode;
  valuesClassName?: string;
  borderless?: boolean;
  shadowless?: boolean;
  centerLabels?: boolean;
  color?: string;
  useMaxAvailableHeight?: boolean;
  iconAction?: IconAction;
  resultPrecision?: ResultPrecision;
}

export default function KpiCard({
  title,
  value,
  actions,
  companionValue,
  raw = false,
  renderValue,
  children,
  valuesClassName,
  borderless = false,
  shadowless = false,
  centerLabels = false,
  color,
  useMaxAvailableHeight = true,
  iconAction,
  resultPrecision
}: KpiCardProps) {
  const { ref, width } = useResizeObserver<HTMLDivElement>();
  const hasApproximateData = resultPrecision === 'PRECISION_APPROXIMATE';

  let content;
  if (raw || renderValue) {
    let formattedValue;
    if (value === undefined) {
      formattedValue = '';
    } else if (value === null) {
      formattedValue = valueMissingPlaceholder;
    } else {
      formattedValue = renderValue ? renderValue(value) : value.toString();
    }
    content = <span className={classNames(locals.minor, valuesClassName)}>{formattedValue}</span>;
  } else if (children) {
    content = <span className={classNames(locals.minor, valuesClassName)}>{children}</span>;
  } else {
    let major;
    let minor = null;
    if (value === undefined) {
      major = '';
    } else if (value === null) {
      major = valueMissingPlaceholder;
    } else {
      const match = String(value).match(valueSplitRegExp);
      if (!match) {
        major = value.toString();
      } else {
        major = match[1];
        minor = match[2];
      }
    }

    content = (
      <>
        <span className={locals.major} style={{ color: color }}>
          {major}
        </span>
        {minor && <span className={locals.minor}>{minor}</span>}
      </>
    );
  }

  return (
    <div
      className={classNames({
        [locals.wrapper]: true,
        [locals.borderless]: borderless,
        [locals.shadowless]: shadowless,
        [locals.centerValue]: centerLabels,
        [locals.useMaxAvailableHeight]: useMaxAvailableHeight
      })}
    >
      <div
        className={classNames({
          [locals.title]: true,
          [locals.centerTitle]: centerLabels
        })}
        ref={ref}
      >
        <Tooltip content={title} align="bottomLeft">
          <span className={locals.titleText}>{title}</span>
        </Tooltip>
        <div className={locals.flexTooltip}>
          {hasApproximateData && (
            <MultiLineToolTipIcon withMargin lines={[t('in-components:approximateDataIndicator.dataRetention')]} />
          )}
        </div>
        {iconAction && (
          <div
            className={classNames({
              [locals.actionWrapper]: true,
              [locals.showLongVariantOnHover]: width != null && width > 300
            })}
          >
            <Tooltip content={iconAction.text}>
              <Link href$={iconAction.href$} onClick={iconAction.onClick}>
                <SvgIcon className={locals.actionIcon} type={iconAction.icon} />
              </Link>
            </Tooltip>
            <Button
              className={locals.action}
              icon={iconAction.icon}
              href$={iconAction.href$}
              onClick={iconAction.onClick}
              kind={iconAction.kind}
            >
              {iconAction.text}
            </Button>
          </div>
        )}
        {actions && <div className={locals.actions}>{actions}</div>}
      </div>
      {content}
      {companionValue && <span className={locals.companion}>{companionValue}</span>}
    </div>
  );
}
