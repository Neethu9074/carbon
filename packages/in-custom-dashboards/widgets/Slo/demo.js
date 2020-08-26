import { ApName, SloTarget, SliConfigId, ApBoundaryScope } from 'in-custom-dashboards/widgets/Slo/form';
import { boundaryScopes } from 'in-applications/constants';

export const demo = {
  [SliConfigId]: '',
  [ApName]: 'robot shop > checkout',
  [SloTarget]: 0.995,
  [ApBoundaryScope]: boundaryScopes.inbound
};
