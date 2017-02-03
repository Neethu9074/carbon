import {createLogger} from 'instalog';
import {Map} from 'immutable';

import {getRoles, saveRole} from 'in-services/groundskeeper/roles';
import {openRoleConfig} from 'in-stores/navigation/configuration';
import {generateUniqueShortId} from 'in-services/util/id';
import {emptySet} from 'in-services/fixedImmutables';
import {createStore} from 'in-stores/store';

const logger = createLogger('RolesConfig/stores/roles');

const rolesStore = createStore({
  name: 'configurationView/subview/RoleConfig/stores/roles',
  initialValue: emptySet
});
export const roles$ = rolesStore.observable;

const errorStore = createStore({
  name: 'configurationView/subview/RoleConfig/stores/error',
  initialValue: emptySet
});
export const error$ = errorStore.observable;

export function enable() {
  const result$ = getRoles();

  result$.once(roles => {
    rolesStore.mutateTo(roles);
    errorStore.mutateTo('');
  });

  result$.errors().once(error => {
    logger.error(`Failed to retrieve roles: ${error.message}`, error);
    rolesStore.mutateTo(emptySet);
    errorStore.mutateTo('Failed to retrieve roles.');
  });
}

export function disable() {
  rolesStore.mutateTo(emptySet);
  errorStore.mutateTo('');
}

export function addNewRole() {
  const newRole = Map({
    id: generateUniqueShortId(),
    name: 'New Role',
    implicitViewFilter: '',
    canConfigureServiceMapping: false,
    canConfigureEumApplications: false,
    canConfigureUsers: false,
    canConfigureRoles: false,
    canInstallNewAgents: false,
    canSeeUsageInformation: false,
    canSeeOnPremLicenseInformation: false,
    canConfigureIntegrations: false
  });

  const result$ = saveRole(newRole);
  result$.once(() => {
    openRoleConfig(newRole.get('id'));
    errorStore.mutateTo('');
  });

  result$.errors().once(error => {
    logger.error(`Failed to save new role: ${error.message}`, error);
    errorStore.mutateTo('Failed to save new role.');
  });
}
