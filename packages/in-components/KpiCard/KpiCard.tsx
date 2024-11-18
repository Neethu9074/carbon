/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import {
  Link,
  SvgIcon,
  Card,
  Button,
  ButtonKinds,
  IconButton,
  HeadingElement,
  HeadingVariant
} from '@instana/components';
import { Observable } from '@instana/observables';

import { decimalSeparator, thousandsSeparator } from 'in-services/formatters/number';
import { carbonButtonEnabled, carbonTooltipEnabled } from 'in-services/featureFlags';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import WidgetCardHeader from 'in-components/WidgetCardHeader/WidgetCardHeader';
import useResizeObserver from 'in-hooks/useResizeObserver';
import Tooltip from 'in-components/Tooltip';
import { ResultPrecision } from 'in-types';

import locals from './KpiCard.mless';

const valueSplitRegExp = new RegExp(`^(-?[0-9\\${decimalSeparator}\\${thousandsSeparator}]+)(.*)$`);

export interface IconAction {
  text: string;
  icon: string;
  kind?: keyof typeof ButtonKinds;
  href$?: Observable<string>;
  href?: string;
  onClick?: (e: any) => void;
}

export interface KpiCardProps {
  title: string;
  value?: any;
  actions?: ReactNode;
  companionValue?: ReactNode;
  headingVariant?: HeadingVariant;
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
  isInModal?: boolean;
  tooltipContent?: React.ReactNode;
  majorClass?: string;
  minorClass?: string;
  disableHeaderTooltip?: boolean;
  bigNumbers?: boolean;
  icon?: string;
  iconClassName?: string;
  extraInfo?: string;
  noTooltipOnTitle?: boolean;
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
  isInModal,
  color,
  useMaxAvailableHeight = true,
  iconAction,
  resultPrecision,
  tooltipContent,
  majorClass,
  minorClass,
  disableHeaderTooltip = false,
  bigNumbers,
  icon,
  iconClassName,
  extraInfo,
  noTooltipOnTitle,
  headingVariant = 'heading-2'
}: KpiCardProps) {
  const { ref, width } = useResizeObserver<HTMLDivElement>();
  const hasApproximateData = resultPrecision === 'PRECISION_APPROXIMATE';

  let formattedValue;
  if (value === undefined) {
    formattedValue = '';
  } else if (value === null) {
    formattedValue = valueMissingPlaceholder;
  } else {
    formattedValue = renderValue?.(value) ?? value.toString();
  }

  let content;
  let major = value;
  if (raw) {
    content = (
      <span className={classNames(locals.minor, valuesClassName, { [locals.bigMinor]: bigNumbers })}>
        {formattedValue}
      </span>
    );
  } else if (children) {
    content = (
      <span className={classNames(locals.minor, valuesClassName, { [locals.bigMinor]: bigNumbers })}>{children}</span>
    );
  } else {
    let minor = null;
    if (value === undefined || value === null) {
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
        <span
          className={classNames(locals.major, majorClass, { [locals.bigMajor]: bigNumbers })}
          style={{ color: color }}
          title={major}
        >
          {major}
        </span>
        {minor && (
          <span className={classNames(locals.minor, minorClass, { [locals.bigMinor]: bigNumbers })}>{minor}</span>
        )}
      </>
    );
  }

  content = (
    <>
      {content}
      {companionValue && <span className={locals.companion}>{companionValue}</span>}
    </>
  );

  return (
    <Card
      className={classNames({
        [locals.wrapper]: true,
        [locals.borderless]: borderless,
        [locals.shadowless]: shadowless || isInModal,
        [locals.centerValue]: centerLabels,
        [locals.modal]: isInModal,
        [locals.hasInfo]: !!extraInfo
      })}
      bodyClassName={locals.kpibody}
      headerClassName={locals.kpiheader}
      useMaxAvailableHeight={useMaxAvailableHeight}
    >
      <div
        className={classNames({
          [locals.header]: true,
          [locals.hidden]: isInModal,
          [locals.centerTitle]: centerLabels
        })}
        ref={ref}
      >
        {!noTooltipOnTitle ? (
          <Tooltip content={title} align={carbonTooltipEnabled ? 'auto' : 'bottomLeft'} overflowEllipsis>
            <div className={locals.titleContainer}>
              {disableHeaderTooltip ? (
                <HeadingElement variant={headingVariant} className={locals.titleText}>
                  {title}
                </HeadingElement>
              ) : (
                <>
                  {icon && <SvgIcon type={icon} className={iconClassName} />}
                  <HeadingElement variant={headingVariant} className={locals.titleText}>
                    {title}
                  </HeadingElement>
                </>
              )}
            </div>
          </Tooltip>
        ) : (
          <div className={locals.titleContainer}>
            {disableHeaderTooltip ? (
              <HeadingElement variant={headingVariant} className={locals.titleText}>
                {title}
              </HeadingElement>
            ) : (
              <>
                {icon && <SvgIcon type={icon} className={iconClassName} />}
                <HeadingElement variant={headingVariant} className={locals.titleText}>
                  {title}
                </HeadingElement>
              </>
            )}
          </div>
        )}

        <div className={locals.flexTooltip}>
          <WidgetCardHeader renderApproximateDataTooltip={hasApproximateData} extraInfoTooltip={extraInfo} />
        </div>
        {iconAction &&
          (carbonButtonEnabled ? (
            <IconButton
              iconDescription={iconAction.text}
              href$={iconAction.href$}
              href={iconAction.href}
              kind={iconAction.kind}
              type={iconAction.icon}
              onClick={iconAction.onClick}
              isWrapperedByTooltip
            />
          ) : (
            <div
              className={classNames({
                [locals.actionWrapper]: true,
                [locals.showLongVariantOnHover]: width != null && width > 300
              })}
            >
              <Tooltip content={iconAction.text} overwriteBlock>
                <Link
                  href={iconAction.href$ ?? iconAction.href}
                  aria-label={iconAction.text}
                  onClick={iconAction.onClick}
                >
                  <SvgIcon className={locals.actionIcon} type={iconAction.icon} />
                </Link>
              </Tooltip>
              <Button
                className={locals.action}
                icon={iconAction.icon}
                href$={iconAction.href$}
                href={iconAction.href}
                onClick={iconAction.onClick}
                kind={iconAction.kind}
              >
                {iconAction.text}
              </Button>
            </div>
          ))}
        {actions && <div className={locals.actions}>{actions}</div>}
      </div>
      {tooltipContent ? (
        <Tooltip content={tooltipContent} align="rightBottom" overflowEllipsis>
          <span className={locals.contentText}>{content}</span>
        </Tooltip>
      ) : (
        <span className={locals.contentText}> {content}</span>
      )}
    </Card>
  );
}
