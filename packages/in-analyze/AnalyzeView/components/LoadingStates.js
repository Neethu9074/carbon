import theme from 'in-themes';
import React from 'react';

import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import { describeArc } from 'in-new-components/Loading/InfiniteCircle';
import SvgIcon from 'in-components/SvgIcon';

import locals from './LoadingStates.mless';

export default function LoadingStates({ progress, errors }) {
  if (progress.loading === true && !progress.percentage) {
    return <QueryPreparing />;
  } else if (progress.loading && progress.percentage >= 0) {
    return <QueryRunning progress={progress} />;
  } else if (progress.loading === false && errors.length > 0) {
    return <QueryFailed errors={errors} />;
  }
  return null;
}

function QueryPreparing() {
  return (
    <div className={locals.stateWrapper}>
      <div className={locals.spinnerContainer}>
        <LoadingCircle />
      </div>
      <div className={locals.progressText}>Preparing…</div>
      <span className={locals.description}>Instana is processing a large amount of tracing data.</span>
      <div className={locals.infoBlock}>
        <SvgIcon className={locals.icon} type="lib_help_error_info_outline" />
        <span className={locals.textBold}>Please don&#39;t reload - this page will update automatically.</span>
      </div>
    </div>
  );
}

function QueryRunning({ progress }) {
  return (
    <div className={locals.stateWrapper}>
      <div className={locals.bigIconContainer}>
        <SvgIcon size="xl" className={locals.traceIcon} type="lib_application_trace" />
      </div>
      <div className={locals.progressText}>Running query…</div>
      <span className={locals.description}>Instana is processing a large amount of tracing data.</span>
      <div className={locals.loadingBarContainer}>
        <HorizontalIndicator className={locals.horizontalIndicator} progress={progress} rounded />
      </div>
    </div>
  );
}

function QueryFailed({ errors }) {
  const [error] = errors.map(e => {
    const [description, status] = e.message.split(':').reverse();
    return { code: e.code, status: status, description: description };
  });

  switch (error.code) {
    case 'TIMEOUT':
    case 'GATEWAY_TIMEOUT':
      return (
        <div className={locals.stateWrapper}>
          <div className={locals.bigIconContainer}>
            <SvgIcon size="xl" className={locals.warnIcon} type="lib_help_error_error_circle" />
          </div>
          <div className={locals.progressText}>This query has timed out.</div>
          <span className={locals.description}>The query took too long to run and has been cancelled.</span>
          <div className={locals.infoBlock}>
            <SvgIcon className={locals.icon} type="lib_help_error_help_outline" />
            <span>Select a shorter timeframe or issue a more specific query by applying more filters.</span>
          </div>
        </div>
      );
    case 'CLIENT':
    case 'VALIDATION':
      return (
        <div className={locals.stateWrapper}>
          <div className={locals.bigIconContainer}>
            <SvgIcon size="xl" className={locals.warnIcon} type="lib_help_error_error_circle" />
          </div>
          <div className={locals.progressText}>There was an input error.</div>
          <span className={locals.description}>{error.description}</span>
        </div>
      );
    case 'TOO_MANY_REQUESTS':
      return (
        <div className={locals.stateWrapper}>
          <div className={locals.bigIconContainer}>
            <SvgIcon size="xl" className={locals.warnIcon} type="lib_help_error_error_circle" />
          </div>
          <div className={locals.progressText}>Too many requests</div>
          <span className={locals.description}>Our system is currently busy. Please try again later.</span>
        </div>
      );
    case 'SERVER':
    default:
      return (
        <div className={locals.stateWrapper}>
          <div className={locals.bigIconContainer}>
            <SvgIcon
              size="xl"
              className={locals.errorIcon}
              type="lib_help_error_warning"
              style={{ fill: theme.lib.colors.failure }}
            />
          </div>
          <div className={locals.progressText}>Server Error</div>
          <span className={locals.description}>
            An unexpected error occurred. Please try again later or contact support to report the error.
          </span>
        </div>
      );
  }
}

function LoadingCircle({ percentage }) {
  const angle = !percentage ? 270 : 360 * percentage;

  return (
    <div className={locals.loadingSpinnerContainer}>
      <SvgIcon
        className={locals.spinningIcon}
        viewBox="0 0 24 24"
        iconPath={describeArc(12, 12, 10, 1, 0, angle)}
        size="xxxl"
        spinning
      />
      <SvgIcon size="xl" className={locals.traceIcon} type="lib_application_trace" />
    </div>
  );
}
