/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import { t } from 'in-i18n';

import locals from './TagFilterConfigurationWrapper.mless';

export default function TagFilterConfigurationWrapper({ quickFilterBar, tagFilterList, isEmpty = false, disabled }) {
  return (
    <div
      className={classNames({
        [locals.wrapper]: true,
        [locals.disabled]: disabled
      })}
    >
      <div className={locals.bar}>{quickFilterBar}</div>
      <div className={locals.list}>
        {!isEmpty && tagFilterList}
        {isEmpty && (
          <div className={locals.empty}>
            {t('in-analyze:analyzeView.components.tagFilterConfiguration.noFiltersDefined')}
          </div>
        )}
      </div>
    </div>
  );
}
