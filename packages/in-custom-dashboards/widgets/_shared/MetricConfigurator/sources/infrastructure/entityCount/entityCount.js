/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/entityCount/FormComponent';
import { entityCountWidgetEnabled } from 'in-services/featureFlags';

export { createForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/entityCount/form';
export const Form = FormComponent;
export const source = 'INFRASTRUCTURE';
export const label = t('in-custom-dashboards:widgets.srcInfrastructure.entityCount.infrastructureEntityCount');
export const visible = entityCountWidgetEnabled;
