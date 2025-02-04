/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SvgIconSizes, KeyValue } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { t } from '@instana/i18n-react';

import PodMetrics from 'in-kubernetes/Dashboards/CronJob/JobItem/PodMetrics';
import HealthDot from 'in-kubernetes/Dashboards/CronJob/JobItem/HealthDot';
import { formatDuration } from 'in-services/formatters/date';

export const labelColumnDefinitions = [
  {
    id: 'health',
    width: '1.7rem',
    // @ts-expect-error
    getContent: function Content({ item }) {
      const statusToColour = {
        Completed: themes.default.ids.color.option.green['500'],
        Running: themes.default.ids.color.option.green['500'],
        Failed: themes.default.ids.color.option.red['500'],
        Unknown: themes.default.ids.color.option.neutral['400']
      };
      // @ts-expect-error
      return <HealthDot color={statusToColour[item?.status || statusToColour.Unknown]} iconSize={SvgIconSizes.xxs} />;
    }
  },
  {
    id: 'name',
    // @ts-expect-error
    getContent({ item }) {
      return <KeyValue label={t('in-kubernetes:dashboards.name')} value={item.label} accentuated />;
    }
  }
];

export const columnDefinitions = [
  {
    id: 'status',
    width: '10rem',
    // @ts-expect-error
    getContent({ job }) {
      // @ts-expect-error
      return <KeyValue label={t('in-kubernetes:dashboards.status')} value={job.status} theme="blue" accentuated />;
    }
  },
  {
    id: 'age',
    width: '10rem',
    // @ts-expect-error
    getContent({ job }) {
      return (
        // @ts-expect-error
        <KeyValue label={t('in-kubernetes:dashboards.age')} value={formatDuration(job?.age)} theme="blue" accentuated />
      );
    }
  },
  {
    id: 'pending',
    width: '10rem',
    // @ts-expect-error
    getContent({ job }) {
      return <PodMetrics snapshotId={job.id} metric="status.failed" label={t('in-kubernetes:pod.pending')} />;
    }
  },
  {
    id: 'active',
    width: '10rem',
    // @ts-expect-error
    getContent({ job }) {
      return <PodMetrics snapshotId={job.id} metric="status.active" label={t('in-kubernetes:pod.active')} />;
    }
  },
  {
    id: 'complete',
    width: '10rem',
    // @ts-expect-error
    getContent({ job }) {
      return <PodMetrics snapshotId={job.id} metric="status.succeeded" label={t('in-kubernetes:pod.completed')} />;
    }
  }
];
