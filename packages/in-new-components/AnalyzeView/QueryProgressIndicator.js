/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { HorizontalIndicator } from '@instana/components';
import { SvgIcon } from '@instana/components';

import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable/NoDataAvailable';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './QueryProgressIndicator.mless';

const height = 189;
const iconSize = 'xl';

// "errors" - optional, to display error messages
// "items" - optional, to display no data available message, if empty
export default function QueryProgressIndicator({ progress, errors, items }) {
  if (progress.loading === true) {
    const message =
      progress.percentage >= 0
        ? t('in-components:analyzeView.queryProgress.runningQuery')
        : t('in-components:analyzeView.queryProgress.preparing');
    return <QueryProgress progress={progress} message={message} />;
  }
  if (progress.loading === false) {
    if (errors?.length > 0) {
      return <QueryFailed errors={errors} />;
    }
    if (items?.length === 0) {
      return <NoDataAvailable className={locals.noData} height={height} />;
    }
  }
  return null;
}

function QueryProgress({ progress, message }) {
  return (
    <div className={locals.stateWrapper}>
      <div className={locals.bigIconContainer}>
        <LoadingIndicator height={height} size={iconSize} />
      </div>
      <div className={locals.progressText}>{message}</div>
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
            <SvgIcon size={iconSize} className={locals.warnIcon} type="lib_help_error_error_circle" />
          </div>
          <div className={locals.progressText}>
            {error.description?.includes('The query would take too long to run.')
              ? t('in-components:analyzeView.queryProgress.timeoutEstimated')
              : t('in-components:analyzeView.queryProgress.timeout')}
          </div>
          <div className={locals.infoBlock}>
            <SvgIcon className={locals.icon} type="lib_help_error_help_outline" />
            <span>{t('in-components:analyzeView.queryProgress.timeoutInfo')}</span>
          </div>
        </div>
      );
    case 'CLIENT':
    case 'VALIDATION':
      return (
        <div className={locals.stateWrapper}>
          <div className={locals.bigIconContainer}>
            <SvgIcon size={iconSize} className={locals.warnIcon} type="lib_help_error_error_circle" />
          </div>
          <div className={locals.progressText}>{t('in-components:analyzeView.queryProgress.inputError')}</div>
          <span className={locals.description}>{error.description}</span>
        </div>
      );
    case 'TOO_MANY_REQUESTS':
      return (
        <div className={locals.stateWrapper}>
          <div className={locals.bigIconContainer}>
            <SvgIcon size={iconSize} className={locals.warnIcon} type="lib_help_error_error_circle" />
          </div>
          <div className={locals.progressText}>{t('in-components:analyzeView.queryProgress.tooManyRequests')}</div>
          <span className={locals.description}>{t('in-components:analyzeView.queryProgress.tooManyRequestsInfo')}</span>
        </div>
      );
    case 'SERVER':
    default:
      return (
        <div className={locals.stateWrapper}>
          <div className={locals.bigIconContainer}>
            <SvgIcon
              size={iconSize}
              className={locals.errorIcon}
              type="lib_help_error_warning"
              style={{ fill: theme.lib.colors.failure }}
            />
          </div>
          <div className={locals.progressText}>{t('in-components:analyzeView.queryProgress.serverError')}</div>
          <span className={locals.description}>{t('in-components:analyzeView.queryProgress.serverErrorInfo')}</span>
        </div>
      );
  }
}
