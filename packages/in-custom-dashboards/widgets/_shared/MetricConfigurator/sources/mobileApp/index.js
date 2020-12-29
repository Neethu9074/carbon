import { createForm as createOldForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/mobileApp/oldForm';
import {
  createForm as createNewForm,
  migrate as migrateToNewForm
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/mobileApp/form';
import OldFormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/mobileApp/OldFormComponent';
import NewFormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/mobileApp/FormComponent';
import { qb2InCustomDashboardsEnabled } from 'in-services/featureFlags';

export const migrate = qb2InCustomDashboardsEnabled ? migrateToNewForm : null;
export const createForm = qb2InCustomDashboardsEnabled ? createNewForm : createOldForm;
export const Form = qb2InCustomDashboardsEnabled ? NewFormComponent : OldFormComponent;
export const source = 'MOBILE_APP';
export const label = 'Mobile Apps (Beacons)';
export const visible = true;
