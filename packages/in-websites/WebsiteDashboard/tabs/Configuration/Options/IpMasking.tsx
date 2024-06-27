/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { FormEvent, useState } from 'react';

import { Card, Stack, Button } from '@instana/components';
import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Select } from '@instana/components';

import SaveIndicator from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/SaveIndicator';
import HelpParagraph from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/HelpParagraph';
import { IpMaskingConfiguration, IpMasking, Result } from 'in-types';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

const ipMaskingOptions: IpMasking[] = ['DEFAULT', 'STRICT', 'REMOVE_ALL_DETAILS'];

export interface Props {
  get: (v: void) => Observable<Result<IpMaskingConfiguration>>;
  set: (config: IpMaskingConfiguration) => Observable<Result<IpMaskingConfiguration>>;
}

interface State {
  readonly value?: IpMasking;
  readonly isSaving: boolean;
  readonly saveId?: string;
  readonly saveError?: Result<unknown>;
}

const initialState: State = {
  isSaving: false
};

export default function IpMaskingOptions({ get, set }: Props) {
  const result: Result<IpMaskingConfiguration> = useObservable(() => get(), [get]) ?? pendingResult;
  const [state, setState] = useState<State>(initialState);
  const disabled = result.data == null || state.isSaving;
  const value = state.value ?? result.data?.ipMasking ?? ipMaskingOptions[0];

  return (
    <form onSubmit={onSubmit}>
      <Card title={t('in-websites:websiteDashboard.tabs.configuration.ipMasking.title')}>
        <HelpParagraph>{t('in-websites:websiteDashboard.tabs.configuration.ipMasking.help')}</HelpParagraph>

        <Stack direction="horizontal" align="center">
          <Select
            value={value}
            onChange={e =>
              setState({
                ...state,
                value: e.target.value as IpMasking
              })
            }
            disabled={disabled}
          >
            {ipMaskingOptions.map(ipMasking => (
              <option value={ipMasking} key={ipMasking}>
                {t('in-websites:websiteDashboard.tabs.configuration.ipMasking.option', { context: ipMasking })}
              </option>
            ))}
          </Select>

          <Button type="submit" kind="create" disabled={disabled}>
            {t('forms.actions.save')}
          </Button>
          <SaveIndicator id={state.saveId} />
        </Stack>
      </Card>
    </form>
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState({
      ...state,
      isSaving: true,
      saveError: undefined,
      saveId: undefined
    });

    set({ ipMasking: value })
      .filter(result => !result.progress.loading)
      .once(result => {
        if (result.errors.length > 0) {
          setState({
            ...state,
            isSaving: false,
            saveId: undefined,
            saveError: result
          });
        } else {
          setState({
            ...state,
            saveId: String(Date.now()),
            saveError: undefined,
            isSaving: false
          });
        }
      });
  }
}
