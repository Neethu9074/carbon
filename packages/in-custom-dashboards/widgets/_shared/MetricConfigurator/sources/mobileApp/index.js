/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/mobileApp/FormComponent';
import { t } from 'in-i18n';

export { createForm, migrate } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/mobileApp/form';

export const Form = FormComponent;
export const source = 'MOBILE_APP';
export const label = t('in-custom-dashboards:widgets.srcMobileApp.index.mobileAppsBeacon');
export const visible = true;
