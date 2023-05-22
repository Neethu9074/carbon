/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { MobileAppAlertConfig } from '@instana/types';
import { SvgIcon } from '@instana/components';

import { fromBackendModel, isTagFilter } from 'in-components/QueryBuilder/transformation/formModel';

import locals from 'in-alerting/smart-alerts/mobileApp/lists/ScopeColumn.mless';

export default function ScopeColumn({
  config,
  mobileAppLabel
}: {
  config: MobileAppAlertConfig;
  mobileAppLabel: string;
}) {
  const tagFilterExpression = fromBackendModel(config.tagFilterExpression);
  const pages = tagFilterExpression.filter(isTagFilter).filter(filter => {
    return filter.name === 'mobileBeacon.mobileApp.name' && filter.operator !== 'NOT_EQUAL';
  });

  return (
    <div className={locals.filters}>
      {mobileAppLabel && (
        <span
          className={classNames({
            [locals.centered]: true,
            [locals.space]: pages.length === 0,
            [locals.divider]: pages.length > 0
          })}
        >
          <SvgIcon className={locals.filterIcon} type="lib_mobile_app" />
          {mobileAppLabel}
        </span>
      )}
      {pages.map((page, i) => (
        <span className={classNames(locals.centered, locals.space)} key={i}>
          <SvgIcon className={locals.filterIcon} type="lib_mobile_app_page_load" />
          {page.stringValue}
        </span>
      ))}
    </div>
  );
}
