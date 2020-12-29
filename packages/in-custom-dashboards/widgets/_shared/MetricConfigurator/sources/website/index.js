import { createForm as createOldForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website/oldForm';
import {
  createForm as createNewForm,
  migrate as migrateToNewForm
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website/form';
import OldFormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website/OldFormComponent';
import NewFormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website/FormComponent';
import { qb2InCustomDashboardsEnabled } from 'in-services/featureFlags';

export const migrate = qb2InCustomDashboardsEnabled ? migrateToNewForm : null;
export const createForm = qb2InCustomDashboardsEnabled ? createNewForm : createOldForm;
export const Form = qb2InCustomDashboardsEnabled ? NewFormComponent : OldFormComponent;
export const source = 'WEBSITE';
export const label = 'Websites (Beacons)';
export const visible = true;
