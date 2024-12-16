/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem } from '@instana/components';

import { formatDateTime } from 'in-services/formatters/date';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => {
    return {
      healthy: getRawPayload(props.snapshot.get('id'), 'healthy'),
      timeOfLastHealthReport: getRawPayload(props.snapshot.get('id'), 'timeOfLastHealthReport')
    };
  },
  function HealthcheckResultDescriptionItem({ healthy, timeOfLastHealthReport }) {
    if (healthy == null) {
      return null;
    }

    return (
      <div>
        <DescriptionItem title={t('in-forge:plugins.hadoopYARNNode.hadoopHealthCheckResult')}>
          {healthy ? t('in-forge:plugins.hadoopYARNNode.healthy') : t('in-forge:plugins.hadoopYARNNode.unhealthy')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.hadoopYARNNode.lastHadoopHealthCheck')}>
          {formatDateTime(timeOfLastHealthReport)}
        </DescriptionItem>
      </div>
    );
  }
);
