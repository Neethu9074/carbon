/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import EntityIndicator from 'in-analyze/components/EntityIndicator';
import { entityTypes } from 'in-analyze/applicationFilter';
import { isNotBlank } from 'in-services/util/string';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './GroupingInfo.mless';

export default function GroupingInfo({ group, disableGrouping }) {
  if (!group || Object.keys(group).length === 0) {
    return null;
  }

  let groupedBy = null;
  let groupedByEntity = null;

  if (group && isNotBlank(group.groupbyTag)) {
    // website monitoring
    groupedBy = group.groupbyTag;

    if (isNotBlank(group.groupbyTagSecondLevelKey)) {
      groupedBy = `${groupedBy}.${group.groupbyTagSecondLevelKey}`;
    }
  } else if (group && isNotBlank(group.name)) {
    // analyze calls/traces
    groupedBy = group.name;
    groupedByEntity = group.entity ? group.entity : null;

    if (isNotBlank(group.value)) {
      groupedBy = `${groupedBy}.${group.value}`;
    }
  }

  return (
    <div className={locals.wrapper}>
      <span className={locals.label}>{t('in-analyze:components.groupingInfo.groupedBy')}</span>

      {(groupedByEntity === entityTypes.SOURCE || groupedByEntity === entityTypes.DESTINATION) && (
        <EntityIndicator groupedByEntity={groupedByEntity} />
      )}
      {isNotBlank(groupedBy) && (
        <Fragment>
          <span className={locals.grouping}>{groupedBy}</span>

          <Tooltip content={t('in-analyze:components.groupingInfo.removeGrouping')} align="bottomMiddle">
            <SvgIcon
              className={locals.removeGrouping}
              aria-label={t('in-analyze:groupingInfo.removeGrouping')}
              type="lib_openclose_circle_outline"
              onClick={disableGrouping}
              size="s"
            />
          </Tooltip>
        </Fragment>
      )}
    </div>
  );
}
