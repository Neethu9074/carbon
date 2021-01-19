/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/entityCount/FormComponent';
import { entityCountWidgetEnabled } from 'in-services/featureFlags';

export { createForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/entityCount/form';
export const Form = FormComponent;
export const source = 'INFRASTRUCTURE';
export const label = 'Infrastructure & Platforms Entity Count';
export const visible = entityCountWidgetEnabled;
