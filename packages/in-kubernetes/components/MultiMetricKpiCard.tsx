/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { Link, SvgIcon, Card, Button, ButtonKinds } from '@instana/components';
import { Observable } from '@instana/observables';

import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import { decimalSeparator, thousandsSeparator } from 'in-services/formatters/number';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import useResizeObserver from 'in-hooks/useResizeObserver';
import Tooltip from 'in-components/Tooltip';
import { ResultPrecision } from 'in-types';
import { t } from 'in-i18n';

import local from 'in-kubernetes/components/MultiMetricKpiCard.mless';
import locals from 'in-components/KpiCard/KpiCard.mless';

const valueSplitRegExp = new RegExp(`^([0-9\\${decimalSeparator}\\${thousandsSeparator}]+)(.*)$`);

export interface KpiCardIconAction {
  text: string;
  icon: string;
  kind?: keyof typeof ButtonKinds;
  href$?: Observable<string>;
  href?: string;
  onClick?: (e: any) => void;
}

export interface MultiMetricKpiCardProps {
  title: string;
  value?: Array<any>;
  actions?: ReactNode;
  companionValue?: ReactNode;
  /*
  When true, print out the whole value without special formatting
  When false, the numeric value will have a greater font size than the rest, usually the minor
  */
  timeshift?: number;
  raw?: boolean;
  renderValue?: (value?: any) => ReactNode;
  children?: ReactNode;
  valuesClassName?: string;
  borderless?: boolean;
  shadowless?: boolean;
  centerLabels?: boolean;
  color?: string;
  useMaxAvailableHeight?: boolean;
  iconAction?: KpiCardIconAction;
  resultPrecision?: ResultPrecision;
}

export default function MultiMetricKpiCard({
  title,
  value,
  actions,
  companionValue,
  raw = false,
  timeshift,
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
}: MultiMetricKpiCardProps) {
  const { ref, width } = useResizeObserver<HTMLDivElement>();
  const hasApproximateData = resultPrecision === 'PRECISION_APPROXIMATE';

  let resource;
  let percentage;
  if (value) {
    resource = value[0];
    percentage = value[1];
  }
  let formattedValue;
  if (resource === undefined) {
    formattedValue = '';
  } else if (resource === null) {
    formattedValue = valueMissingPlaceholder;
  } else {
    formattedValue = renderValue?.(resource) ?? resource.toString();
  }

  let content;
  if (raw) {
    if (percentage !== null) {
      let splitFormattedValueUnit = formattedValue.split(' ');
      let val;
      let unit;
      let hasUnitAndVal = splitFormattedValueUnit.length > 1;
      let percentageNumber = percentage.replace('%', '').replace(',', '.');
      let percentageOfCapLabel = timeshift !== 0 ? '%)' : '% of cap.)';
      if (hasUnitAndVal) {
        val = splitFormattedValueUnit[0];
        unit = splitFormattedValueUnit[1];
        content = (
          <span className={classNames(local.minor, valuesClassName)}>
            {val} <span className={classNames(local.unit, valuesClassName)}>{unit} </span>
            <span className={classNames(local.capacity_font, valuesClassName)}>
              {'(' + Number(percentageNumber).toFixed(1) + percentageOfCapLabel}
            </span>
          </span>
        );
      } else {
        content = (
          <span className={classNames(local.minor, valuesClassName)}>
            {formattedValue}{' '}
            <span className={classNames(local.capacity_font, valuesClassName)}>
              {'(' + Number(percentageNumber).toFixed(1) + percentageOfCapLabel}
            </span>
          </span>
        );
      }
    } else {
      content = <span className={classNames(locals.minor, valuesClassName)}>{formattedValue}</span>;
    }
  } else if (children) {
    content = <span className={classNames(locals.minor, valuesClassName)}>{children}</span>;
  } else {
    let major;
    let minor = null;
    if (major === undefined || major === null) {
      major = formattedValue;
    } else {
      const match = String(formattedValue).match(valueSplitRegExp);
      if (!match) {
        major = formattedValue;
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
    <Card
      className={classNames({
        [locals.wrapper]: true,
        [locals.borderless]: borderless,
        [locals.shadowless]: shadowless,
        [locals.centerValue]: centerLabels
      })}
      bodyClassName={locals.kpibody}
      headerClassName={locals.kpiheader}
      useMaxAvailableHeight={useMaxAvailableHeight}
    >
      <div
        className={classNames({
          [locals.title]: true,
          [locals.header]: true,
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
              <Link href={iconAction.href$} onClick={iconAction.onClick}>
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
      <div className={locals.contentText}>
        {content}
        {companionValue && <span className={locals.companion}>{companionValue}</span>}
      </div>
    </Card>
  );
}
