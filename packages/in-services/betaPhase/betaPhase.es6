import { mutateUrl } from 'in-stores/navigation/navigation';
import { settingsStore } from 'in-services/settings';

export function setV2ParamIfUnset() {
  settingsStore.once(settings => {
    mutateUrl(navParams => {
      if (navParams.query.v2 != null) {
        return navParams;
      }
      const v2EnabledUserPreference = settings.v2Enabled != null ? settings.v2Enabled : false;
      navParams.query.v2 = v2EnabledUserPreference;
      return navParams;
    });
  });
}

export function init() {
  setV2ParamIfUnset();
}
