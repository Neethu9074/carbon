import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli/FormComponent';
import { sloConfigurationEnabled } from 'in-services/featureFlags';

export { createForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli/form';
export const Form = FormComponent;
export const source = 'SLI';
export const label = 'SLI';
export const enabled = sloConfigurationEnabled;
