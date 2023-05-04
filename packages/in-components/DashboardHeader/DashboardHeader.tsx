/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import { Link, LoadingSkeleton, SvgIcon } from '@instana/components';
import { Observable } from '@instana/observables';

// @ts-expect-error
import UrlShortener from 'in-components/DashboardHeader/UrlShortener/UrlShortener';
import MigratedTenantBanner from 'in-components/MigratedTenantBanner/MigratedTenantBanner';
import TimeSelection from 'in-components/time/TimeSelection/TimeSelection';
import PlayWithHeader from 'in-new-components/Demo/PlayWithHeader';
import { playwithEnabled } from 'in-services/featureFlags';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Title from 'in-components/Title';
import { Result } from 'in-types';
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
  result?: Result<any>;
  icon?: string;
  renderIcon?: (() => JSX.Element) | typeof getSkeletonIcon;
  title: string;
  renderTimeSelection?: (props: any) => JSX.Element;
  label: string | JSX.Element;
  labelForTitle?: string;
  renderMetaInformation?: ((props: any) => JSX.Element) | typeof getSkeletonButton;
  renderButtonLine?: ((props: any) => JSX.Element) | typeof getSkeletonButton;
  renderButtonLineSecondary?: ((props: any) => JSX.Element) | typeof getSkeletonButton;
  renderTopLevelButtonLine?: ((props: any) => JSX.Element) | typeof getSkeletonButton;
  hideUrlShortener?: boolean;
  contextConfigurations?: ContextConfiguration[];
  className?: string;
  withBorderBottom?: boolean;
  headerHref$?: Observable<string>;
  onHeaderClick?: (params: any) => any;
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
    hideUrlShortener,
    withBorderBottom,
    headerHref$,
    onHeaderClick = () => {}
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

  const SyntheticIcon = () => {
    const isSynthetic = result && result.data?.synthetic;
    if (isSynthetic)
      return (
        <Tooltip content={t('in-applications:labelSyntheticEndpoint')}>
          <span className={locals.specialIndicator} />
        </Tooltip>
      );
    else {
      return null;
    }
  };
  const playwithTopClass = playwithEnabled ? locals.playwithEnabled : locals.playwithDisable;
  return (
    <>
      {playwithEnabled ? <PlayWithHeader /> : ''}

      <header
        className={classNames(
          locals.dashboardHeader,
          playwithTopClass,
          locals[theme],
          className,
          withBorderBottom && locals.borderBottom
        )}
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
            <SyntheticIcon />
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
            <div className={locals.secondaryActions}>
              {renderButtonLineSecondary && renderButtonLineSecondary(props)}
            </div>
          </div>
        )}
      </header>
    </>
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
        <Link href$={props.headerHref$} onClick={props.onHeaderClick}>
          <span className={locals.headerLink}>{renderContext(props)}</span>
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
        <span className={locals.context}>{renderContext(props)}</span>
        {shouldRenderDelimiter && <SvgIcon className={locals.contextEndIcon} size="l" type="lib_arrow_expand_right" />}
      </div>
    );
  }
}
