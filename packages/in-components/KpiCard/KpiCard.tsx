/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { SvgIcon, Button, Link, ButtonKinds } from '@instana/components';
import { Observable } from '@instana/observables';

import { decimalSeparator, thousandsSeparator } from 'in-services/formatters/number';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import useResizeObserver from 'in-hooks/useResizeObserver';
import Tooltip from 'in-components/Tooltip';

// @ts-ignore
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
  raw?: boolean;
  renderValue?: (value?: any) => ReactNode;
  children?: ReactNode;
  valuesClassName?: string;
  borderless?: boolean;
  color?: string;
  useMaxAvailableHeight?: boolean;
  iconAction?: IconAction;
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
  color,
  useMaxAvailableHeight = true,
  iconAction
}: KpiCardProps) {
  const { ref, width } = useResizeObserver<HTMLDivElement>();

  let content;
  if (raw || renderValue) {
    content = (
      <span className={classNames(locals.minor, valuesClassName)}>{renderValue ? renderValue(value) : value}</span>
    );
  } else if (children) {
    content = <span className={classNames(locals.minor, valuesClassName)}>{children}</span>;
  } else {
    let major = valueMissingPlaceholder;
    let minor = null;

    if (value != null) {
      const match = String(value).match(valueSplitRegExp);
      if (!match) {
        major = value;
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
        [locals.useMaxAvailableHeight]: useMaxAvailableHeight
      })}
    >
      <div className={locals.title} ref={ref}>
        <>{title}</>
        {iconAction && (
          <div
            className={classNames({
              [locals.actionWrapper]: true,
              [locals.showLongVariantOnHover]: width != null && width > 300
            })}
          >
            <Tooltip content={iconAction.text}>
              <Link href$={iconAction.href$}>
                <SvgIcon className={locals.actionIcon} type={iconAction.icon} onClick={iconAction.onClick} />
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
      </div>
      {content}
      {companionValue && <span className={locals.companion}>{companionValue}</span>}
      {actions && <div className={locals.actions}>{actions}</div>}
    </div>
  );
}

KpiCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.any,
  actions: PropTypes.node,
  companionValue: PropTypes.any,
  raw: PropTypes.bool,
  renderValue: PropTypes.func,
  valuesClassName: PropTypes.string,
  borderless: PropTypes.bool,
  color: PropTypes.string,
  useMaxAvailableHeight: PropTypes.bool,
  iconAction: PropTypes.object
};
