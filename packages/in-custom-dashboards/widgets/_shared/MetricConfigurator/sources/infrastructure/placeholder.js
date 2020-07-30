import { entityCountWidgetEnabled } from 'in-services/featureFlags';

export const source = 'INFRASTRUCTURE_PLACEHOLDER';
export const label = 'Infrastructure & Platforms ' + (entityCountWidgetEnabled ? 'Metrics ' : '') + '(coming soon)';
export const disabled = true;
export const enabled = true;
