import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { percetage, bytes, number } from 'in-services/formatters/number';

export const resourceQuotaPercentage = d => (d < 0 ? valueMissingPlaceholder : percetage.detailed(d));
export const resourceQuotaBytes = d => (d < 0 ? valueMissingPlaceholder : bytes.detailed(d));
export const resourceQuotaNumber = d => (d < 0 ? valueMissingPlaceholder : number.detailed(d));
