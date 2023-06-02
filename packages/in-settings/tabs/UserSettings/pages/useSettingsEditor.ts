/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import { debounce } from 'lodash';
import { useState } from 'react';

import { settings$, set as persist } from 'in-services/settings/settings';

const debouncedPersist = debounce(persist, 500);

export default function useSettingsEditor() {
  const storedSettings = useObservable(settings$, []);
  const [state, setState] = useState();
  const settings = state ?? storedSettings;

  return [settings, saveSetting];

  function saveSetting(k, v) {
    const newSettings = {
      ...settings,
      [k]: v
    };
    debouncedPersist(newSettings);
    setState(newSettings);
  }
}
