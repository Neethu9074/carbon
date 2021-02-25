/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { createForm as createOldForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/oldForm';
import {
  createForm as createNewForm,
  migrate as migrateToNewForm
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/form';
import OldFormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/OldFormComponent';
import NewFormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/FormComponent';
import { qb2InCustomDashboardsEnabled } from 'in-services/featureFlags';

export const migrate = qb2InCustomDashboardsEnabled ? migrateToNewForm : null;
export const createForm = qb2InCustomDashboardsEnabled ? createNewForm : createOldForm;
export const Form = qb2InCustomDashboardsEnabled ? NewFormComponent : OldFormComponent;
export const source = 'APPLICATION';
export const label = t('in-custom-dashboards:widgets.srcApp.index.applicationsTracesAndCalls');
export const visible = true;
