/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, ChangeEvent, FormEvent } from 'react';

import { Card, Stack, Link, Button, FileInputButton} from '@instana/components';
import { Form } from '@instana/carbon';

import { put } from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/CustomGeoDetails/apiCall';
import SaveIndicator from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/SaveIndicator';
import HelpParagraph from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/HelpParagraph';
import OptionsRow from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/OptionsRow';
import SaveError from 'in-components/form/SaveError';
import { TechnicalHttpApiError } from 'in-types';
import { t, Trans } from 'in-i18n';

export interface Props {
  apiUrl: string;
  documentationUrl: string;
}

interface State {
  csvContent?: string;
  loading: boolean;
  saveId?: string;
  errorMessage?: string;
}

export default function Uploader({ apiUrl, documentationUrl }: Props) {
  const [state, setState] = useState<State>({ loading: false });

  return (
    <OptionsRow>
      <Form onSubmit={onSubmit}>
        <Card title={t('in-websites:websiteDashboard.tabs.configuration.customGeoDetails.uploader.title')}>
          <HelpParagraph>
            <Trans
              i18nKey="in-websites:websiteDashboard.tabs.configuration.customGeoDetails.uploader.help"
              components={{
                documentation: (
                  <Link href={documentationUrl} externalWithIcon>
                    null
                  </Link>
                )
              }}
            />
          </HelpParagraph>

          <Stack direction="horizontal" align="start">
            <FileInputButton
              accept="text/csv,.csv"
              onChange={onChange}
              disabled={state.loading}
              aria-label={t('in-websites:websiteDashboard.tabs.configuration.customGeoDetails.uploader.title')}
            />
            <Button
              type="submit"
              kind="create"
              disabled={state.loading || state.csvContent == null}
              data-testid="geo-save-button"
            >
              {t('forms.actions.save')}
            </Button>
            <SaveIndicator id={state.saveId} />
            {state.errorMessage && <SaveError>{state.errorMessage}</SaveError>}
          </Stack>
        </Card>
      </Form>
    </OptionsRow>
  );

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      setState({
        loading: false
      });
      return;
    }

    setState({
      loading: true
    });

    try {
      const text = await e.target.files[0].text();
      setState({
        loading: false,
        csvContent: text
      });
    } catch (e) {
      setState({
        loading: false,
        errorMessage: t(
          'in-websites:websiteDashboard.tabs.configuration.customGeoDetails.uploader.failureToReadFileContent',
          {
            error: (e as any).message ?? 'Unknown error'
          }
        )
      });
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setState({
      csvContent: state.csvContent,
      loading: true
    });

    let response: Response;
    try {
      response = await put(apiUrl, state.csvContent!);
    } catch (e) {
      setState({
        loading: false,
        csvContent: state.csvContent,
        errorMessage: t(
          'in-websites:websiteDashboard.tabs.configuration.customGeoDetails.uploader.failureToCallApiForTechnicalReason',
          {
            error: (e as any).message ?? 'Unknown error'
          }
        )
      });
      return;
    }

    if (response.ok) {
      setState({
        loading: false,
        saveId: String(Date.now()),
        csvContent: state.csvContent
      });
      return;
    }

    try {
      const body: TechnicalHttpApiError = await response.json();
      setState({
        loading: false,
        csvContent: state.csvContent,
        errorMessage: t(
          'in-websites:websiteDashboard.tabs.configuration.customGeoDetails.uploader.failureToCallApiForStatusCodeReason',
          {
            error: body.errors.join(';')
          }
        )
      });
    } catch (e) {
      setState({
        loading: false,
        csvContent: state.csvContent,
        errorMessage: t(
          'in-websites:websiteDashboard.tabs.configuration.customGeoDetails.uploader.failureToCallApiForStatusCodeReason',
          {
            error: (e as any).message ?? 'Unknown error'
          }
        )
      });
    }
  }
}
