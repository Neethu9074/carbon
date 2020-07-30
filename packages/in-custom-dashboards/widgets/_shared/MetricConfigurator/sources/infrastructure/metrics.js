import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/FormComponent';
import { entityCountWidgetEnabled } from 'in-services/featureFlags';

export { createForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/form';
export const Form = FormComponent;
export const source = 'INFRASTRUCTURE';
export const label = 'Infrastructure & Platforms Entity Count';
export const enabled = entityCountWidgetEnabled;
