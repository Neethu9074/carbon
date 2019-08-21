import { isRbacEnabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';

export const ACCESS_APPLICATIONS = 'ACCESS_APPLICATIONS';
export const ACCESS_KUBERNETES = 'ACCESS_KUBERNETES';
export const ACCESS_WEBSITES = 'ACCESS_WEBSITES';

const permissions = window.instana.permissions;

export const hasRestrictedAccess = isRbacEnabled && role.restrictedAccess;

function hasPermission(permission) {
  return !hasRestrictedAccess || permissions.indexOf(permission) > -1;
}

export const hasApplicationsAccess = hasPermission(ACCESS_APPLICATIONS);
export const hasKubernetesAccess = hasPermission(ACCESS_KUBERNETES);
export const hasWebsitesAccess = hasPermission(ACCESS_WEBSITES);
export const hasAnalyzeAccess = hasApplicationsAccess || hasWebsitesAccess;

export const productAreaPermissions = getProductAreaPermissions();

function getProductAreaPermissions() {
  return [
    { value: ACCESS_WEBSITES, label: 'Websites' },
    { value: ACCESS_APPLICATIONS, label: 'Applications' },
    { value: ACCESS_KUBERNETES, label: 'Kubernetes' }
  ];
}
