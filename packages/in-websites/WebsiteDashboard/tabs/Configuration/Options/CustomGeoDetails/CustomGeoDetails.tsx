/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Link, Card, Stack, Button } from '@instana/components';

import Uploader from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/CustomGeoDetails/Uploader';
import HelpParagraph from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/HelpParagraph';
import OptionsRow from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/OptionsRow';
import { t, Trans } from 'in-i18n';

export interface Props {
  apiUrl: string;
  documentationUrl: string;
}

export default function CustomGeoDetails({ apiUrl, documentationUrl }: Props) {
  return (
    <>
      <OptionsRow>
        <Card title={t('in-websites:websiteDashboard.tabs.configuration.customGeoDetails.title')}>
          <HelpParagraph>
            <Trans
              i18nKey="in-websites:websiteDashboard.tabs.configuration.customGeoDetails.help1"
              components={{
                maxmind: (
                  <Link href="https://www.maxmind.com" externalWithIcon>
                    null
                  </Link>
                )
              }}
            />
          </HelpParagraph>

          <HelpParagraph>
            <Trans
              i18nKey="in-websites:websiteDashboard.tabs.configuration.customGeoDetails.help2"
              components={{
                documentation: (
                  <Link href={documentationUrl} externalWithIcon>
                    null
                  </Link>
                )
              }}
            />
          </HelpParagraph>

          <Stack direction="horizontal">
            <Button href={apiUrl} kind="secondary" target="_blank">
              {t('in-websites:websiteDashboard.tabs.configuration.customGeoDetails.download')}
            </Button>
            <Button href={documentationUrl} kind="secondary" target="_blank" icon="lib_views_external_link">
              {t('in-websites:websiteDashboard.tabs.configuration.customGeoDetails.documentation')}
            </Button>
          </Stack>
        </Card>
      </OptionsRow>

      <Uploader apiUrl={apiUrl} documentationUrl={documentationUrl} />
    </>
  );
}
