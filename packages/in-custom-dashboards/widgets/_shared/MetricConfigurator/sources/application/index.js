import { createForm as createOldForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/oldForm';
import { createForm as createNewForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/form';
import OldFormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/OldFormComponent';
import NewFormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/FormComponent';
import { qb2InCustomDashboardsEnabled } from 'in-services/featureFlags';

export const createForm = qb2InCustomDashboardsEnabled ? createNewForm : createOldForm;
export const Form = qb2InCustomDashboardsEnabled ? NewFormComponent : OldFormComponent;
export const source = 'APPLICATION';
export const label = 'Applications (Traces and Calls)';
export const visible = true;
