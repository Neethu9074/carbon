import {createLogger} from 'instalog';

import {getRoles} from 'in-services/groundskeeper/roles';
import {emptySet} from 'in-services/fixedImmutables';
import {createStore} from 'in-stores/store';

const logger = createLogger('RoleConfig/stores/roles');

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

  result$.once(roles => rolesStore.mutateTo(roles));

  result$.errors().once(error => {
    logger.error(`Failed to retrieve roles: ${error.message}`, error);
    rolesStore.mutateTo(emptySet);
    errorStore.mutateTo('Failed to retrieve roles.');
  });
}

export function disable() {
  rolesStore.mutateTo(emptySet);
}
