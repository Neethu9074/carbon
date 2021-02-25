/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { sortedUniq } from 'lodash';
import { t } from 'in-i18n';

export { default as showCase } from 'in-custom-dashboards/widgets/Chart/showCase.png';
export { default as Form } from 'in-custom-dashboards/widgets/Chart/FormComponent';
export { default as Widget } from 'in-custom-dashboards/widgets/Chart/Widget';
export { createForm, migrate } from 'in-custom-dashboards/widgets/Chart/form';
export { demo } from 'in-custom-dashboards/widgets/Chart/demo';
import { emptyArray } from 'in-services/fixedObjects';

export const type = 'chart';
export const label = t('in-custom-dashboards:widgets.index.chartTimeSeries');
export const minimumWidth = 3;
export const minimumHeight = 13;
export const enabled = true;

export const getTrackingMeta = config => ({
  dataSources: sortedUniq(
    config.y1.metrics
      .concat(config.y2?.metrics || emptyArray)
      .map(metric => metric.source)
      .sort()
  )
});
export const trackViews = true;
