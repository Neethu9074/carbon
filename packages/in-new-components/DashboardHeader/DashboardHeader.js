/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { LoadingSkeleton } from '@instana/components';
import { SvgIcon } from '@instana/components';

import UrlShortener from 'in-new-components/DashboardHeader/UrlShortener/UrlShortener';
import TimeSelection from 'in-new-components/time/TimeSelection/TimeSelection';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Title from 'in-components/Title';

import locals from './DashboardHeader.mless';

export const themes = {
  light: 'light',
  dark: 'dark',
  default: 'default'
};

export default function DashboardHeader(props) {
  const {
    theme = themes.default,
    icon,
    title,
    className,
    contextConfigurations,
    renderTimeSelection,
    result,
    labelForTitle,
    hideUrlShortener,
    withBorderBottom
  } = props;
  let {
    label,
    renderIcon,
    renderMetaInformation,
    renderButtonLine,
    renderButtonLineSecondary,
    renderTopLevelButtonLine
  } = props;

  const isLoading = result && result.data == null;

  if (isLoading) {
    label = getSkeletonLabel();

    if (renderButtonLine || renderButtonLineSecondary) {
      renderButtonLine = getSkeletonButton;
      renderButtonLineSecondary = getSkeletonButton;
    }
    if (renderMetaInformation) {
      renderMetaInformation = getSkeletonButton;
    }
    if (renderTopLevelButtonLine) {
      renderTopLevelButtonLine = getSkeletonButton;
    }
    if (!icon || renderIcon) {
      renderIcon = getSkeletonIcon;
    }
  }
  return (
    <header
      className={classNames(locals.dashboardHeader, locals[theme], className, withBorderBottom && locals.borderBottom)}
    >
      <Title title={title} dynamic={labelForTitle ?? (typeof label === 'string' ? label : null)} />
      <div className={locals.firstLine}>
        <div className={locals.leftContent}>
          {contextConfigurations &&
            contextConfigurations.map((config, i) => (
              <Context
                key={i}
                {...config}
                {...props}
                renderLastIconDelimiter={i < contextConfigurations.length - 1 || label || icon || renderIcon}
              />
            ))}
          {renderIcon ? renderIcon() : icon ? <SvgIcon className={locals.icon} type={icon} size="l" /> : null}
          {typeof label === 'string' ? (
            <Tooltip content={label} delay={500}>
              <span className={locals.label}>{label}</span>
            </Tooltip>
          ) : (
            <span className={locals.label}>{label}</span>
          )}
          {renderMetaInformation && renderMetaInformation(props)}
        </div>
        <div className={locals.rightContent}>
          {!hideUrlShortener && <UrlShortener darkTheme={theme === themes.dark} />}
          {renderTopLevelButtonLine && renderTopLevelButtonLine(props)}
          {renderTimeSelection ? renderTimeSelection(props) : <TimeSelection darkTheme={theme === themes.dark} />}
        </div>
      </div>
      {(renderButtonLine || renderButtonLineSecondary) && (
        <div
          className={classNames({
            [locals.buttonLine]: true,
            [locals.withSecondary]: renderButtonLineSecondary
          })}
        >
          <div className={locals.primaryActions}>{renderButtonLine && renderButtonLine(props)}</div>
          <div className={locals.secondaryActions}>{renderButtonLineSecondary && renderButtonLineSecondary(props)}</div>
        </div>
      )}
    </header>
  );
}

function getSkeletonButton() {
  return <LoadingSkeleton className={locals.buttonSkeleton} />;
}

function getSkeletonLabel() {
  return <LoadingSkeleton className={locals.labelSkeleton} />;
}

function getSkeletonIcon() {
  return <LoadingSkeleton className={locals.iconSkeleton} />;
}

function Context(props) {
  const { renderContext, contextIcon, renderContextIcon, renderLastIconDelimiter } = props;

  return (
    <div className={locals.contextWrapper}>
      {renderContextIcon ? (
        renderContextIcon({ ...props, className: locals.contextIcon })
      ) : (
        <SvgIcon className={locals.contextIcon} size="l" type={contextIcon} />
      )}
      <span className={locals.context}>{renderContext(props)}</span>
      {renderLastIconDelimiter && <SvgIcon className={locals.contextEndIcon} size="l" type="lib_arrow_expand_right" />}
    </div>
  );
}

DashboardHeader.propTypes = {
  theme: PropTypes.oneOf(Object.values(themes)),
  result: PropTypes.any,
  icon: PropTypes.string,
  renderIcon: PropTypes.func,
  title: PropTypes.string,
  renderTimeSelection: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  labelForTitle: PropTypes.string,
  renderMetaInformation: PropTypes.func,
  renderButtonLine: PropTypes.func,
  renderButtonLineSecondary: PropTypes.func,
  renderTopLevelButtonLine: PropTypes.func,
  hideUrlShortener: PropTypes.bool,
  contextConfigurations: PropTypes.arrayOf(
    PropTypes.shape({
      renderContext: PropTypes.func.isRequired,
      renderContextIcon: PropTypes.func,
      contextIcon: PropTypes.string
    })
  ),
  className: PropTypes.string,
  withBorderBottom: PropTypes.bool
};
