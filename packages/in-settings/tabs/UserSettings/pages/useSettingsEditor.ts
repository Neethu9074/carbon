/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { debounce } from 'lodash';
import { useState } from 'react';

import { useObservable } from '@instana/hooks';

import { settings$, set as persist } from 'in-services/settings/settings';
import { UiSettings } from 'in-types';

const debouncedPersist = debounce(persist, 500);

export default function useSettingsEditor() {
  const storedSettings = useObservable(settings$, []);
  const [state, setState] = useState<UiSettings>();
  const settings = state ?? storedSettings;

  return [settings, saveSetting];

  function saveSetting(k: string, v: any) {
    const newSettings = {
      ...settings,
      [k]: v
    };
    debouncedPersist(newSettings);
    setState(newSettings);
  }
}
