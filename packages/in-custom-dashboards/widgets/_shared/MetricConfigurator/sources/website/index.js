/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website/FormComponent';
import { t } from 'in-i18n';

export { createForm, migrate } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website/form';

export const Form = FormComponent;
export const source = 'WEBSITE';
export const label = t('in-custom-dashboards:widgets.srcWebSite.index.websitesBeacons');
export const visible = true;
