/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  createForm as createNewForm,
  migrate as migrateToNewForm
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website/form';
import { createForm as createOldForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website/oldForm';
import OldFormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website/OldFormComponent';
import NewFormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website/FormComponent';
import { qb2InCustomDashboardsEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export const migrate = qb2InCustomDashboardsEnabled ? migrateToNewForm : null;
export const createForm = qb2InCustomDashboardsEnabled ? createNewForm : createOldForm;
export const Form = qb2InCustomDashboardsEnabled ? NewFormComponent : OldFormComponent;
export const source = 'WEBSITE';
export const label = t('in-custom-dashboards:widgets.srcWebSite.index.websitesBeacons');
export const visible = true;
