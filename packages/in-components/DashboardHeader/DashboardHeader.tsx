/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import { LoadingSkeleton, PreviewPill, SvgIcon } from '@instana/components';
import { Observable } from '@instana/observables';
import { Link } from '@instana/components';

import MigratedTenantBanner from 'in-components/MigratedTenantBanner/MigratedTenantBanner';
import TimeSelection from 'in-components/time/TimeSelection/TimeSelection';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { Nullish, Result } from 'in-types';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './DashboardHeader.mless';

export const themes = {
  light: 'light',
  dark: 'dark',
  default: 'default'
} as const;

interface ContextProps extends ContextConfiguration, DashboardHeaderProps {
  // shouldRenderDelimiter allows to toggle rendering a delimiter between context elements
  // These delimiters are used for a breadcrumb style context in the dashboard header, e.g. Analytics > Applications / Calls
  // Here, the `>` is the rendered delimiter and `Applications / Calls` is the label
  shouldRenderDelimiter: boolean;
}

interface RenderContextIconProps extends ContextProps {
  className: string;
}

export interface ContextConfiguration {
  renderContext: (props: ContextProps) => {};
  renderContextIcon?: (props: RenderContextIconProps) => JSX.Element;
  contextIcon: string;
}

export interface DashboardHeaderProps {
  theme?: keyof typeof themes;
  result?: Result<any> | Nullish;
  icon?: string;
  isBeta?: boolean;
  renderIcon?: () => React.ReactNode;
  title: string;
  renderTimeSelection?: (props: any) => React.ReactNode;
  label: string | React.ReactNode;
  labelForTitle?: string;
  renderMetaInformation?: (props: any) => React.ReactNode;
  renderButtonLine?: (props: any) => React.ReactNode;
  renderButtonLineSecondary?: (props: any) => React.ReactNode;
  renderTopLevelButtonLine?: (props: any) => React.ReactNode;
  contextConfigurations?: ContextConfiguration[];
  className?: string;
  withBorderBottom?: boolean;
  headerHref$?: Observable<string>;
  onHeaderClick?: (params: any) => any;
  liveModeDisabled?: boolean;
  liveModeDisabledTooltip?: string;
  ariaLabel?: string;
}

const isNotLastElement = (index: number, array: any[]) => {
  return index < array.length - 1;
};

export default function DashboardHeader(props: DashboardHeaderProps) {
  const {
    theme = themes.default,
    icon,
    title,
    className,
    contextConfigurations,
    renderTimeSelection,
    result,
    labelForTitle,
    withBorderBottom,
    headerHref$,
    isBeta = false,
    onHeaderClick = () => {},
    liveModeDisabled = false,
    liveModeDisabledTooltip
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
  const isSynthetic = result && result.data?.synthetic;

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
      renderIcon = () => getSkeletonIcon();
    }
  }

  return (
    <section
      className={classNames(locals.dashboardHeader, locals[theme], className, withBorderBottom && locals.borderBottom)}
      aria-label={t('in-components:pageStructure.headerAriaLabel')}
    >
      <MigratedTenantBanner />
      <Title title={title} dynamic={labelForTitle ?? (typeof label === 'string' ? label : null)} />

      <div className={locals.firstLine}>
        <div className={locals.leftContent}>
          {contextConfigurations &&
            contextConfigurations.map((config, i) => (
              <Context
                key={i}
                {...config}
                {...props}
                shouldRenderDelimiter={
                  // Render the delimiter for all context items except the last one
                  // Except the last element is followed by an icon or a label

                  isNotLastElement(i, contextConfigurations) || label != null || icon != null || renderIcon != null
                }
                headerHref$={headerHref$}
                onHeaderClick={onHeaderClick}
              />
            ))}
          {isSynthetic && (
            <Tooltip content={t('in-applications:labelSyntheticEndpoint')}>
              <span className={locals.specialIndicator} />
            </Tooltip>
          )}
          {renderIcon ? (
            <span role="img" aria-label={title} title={title}>
              {renderIcon()}
            </span>
          ) : icon ? (
            <span role="img" aria-label={title}>
              <Tooltip content={title} delay={500}>
                <SvgIcon className={locals.icon} type={icon} size="l" />
              </Tooltip>
            </span>
          ) : null}
          {label &&
            (typeof label === 'string' ? (
              <Tooltip overflowEllipsis content={label} delay={500}>
                <h1 className={locals.label}>{label}</h1>
              </Tooltip>
            ) : (
              <span className={locals.label}>{label}</span>
            ))}
          {renderMetaInformation && renderMetaInformation(props)}
          {isBeta && <PreviewPill />}
        </div>
        <div className={locals.rightContent}>
          {renderTopLevelButtonLine && renderTopLevelButtonLine(props)}
          {renderTimeSelection ? (
            renderTimeSelection(props)
          ) : (
            <TimeSelection
              darkTheme={theme === themes.dark}
              liveModeDisabled={liveModeDisabled}
              liveModeDisabledTooltip={liveModeDisabledTooltip}
            />
          )}
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
    </section>
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

function Context(props: ContextProps) {
  const { renderContext, contextIcon, renderContextIcon, shouldRenderDelimiter } = props;

  if (props.headerHref$ != null) {
    return (
      <div className={locals.contextWrapper}>
        {renderContextIcon ? (
          renderContextIcon({ ...props, className: locals.contextIcon })
        ) : (
          <SvgIcon className={locals.contextIcon} size="l" type={contextIcon} />
        )}
        <Link href={props.headerHref$} onClick={props.onHeaderClick}>
          <h1 className={locals.headerLink}>{renderContext(props)}</h1>
        </Link>
        {shouldRenderDelimiter && <SvgIcon className={locals.contextEndIcon} size="l" type="lib_arrow_expand_right" />}
      </div>
    );
  } else {
    return (
      <div className={locals.contextWrapper}>
        {renderContextIcon ? (
          renderContextIcon({ ...props, className: locals.contextIcon })
        ) : (
          <SvgIcon className={locals.contextIcon} size="l" type={contextIcon} />
        )}
        <h1 className={locals.context}>{renderContext(props)}</h1>
        {shouldRenderDelimiter && <SvgIcon className={locals.contextEndIcon} size="l" type="lib_arrow_expand_right" />}
      </div>
    );
  }
}
