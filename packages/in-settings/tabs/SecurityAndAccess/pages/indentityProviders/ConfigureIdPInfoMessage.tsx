/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Message } from '@instana/components';
import { Link } from '@instana/components';

import { t, Trans } from 'in-i18n';

import locals from './ConfigureIdPInfoMessage.mless';

export default function ConfigureIdPInfoMessage() {
  return (
    <>
      <Message withIcon className={locals.message} inline>
        <Trans
          i18nKey="in-settings:tabs.configureIdPCanBeDeletedThroughAPI"
          components={{
            supportLink: (
              //@ts-expect-error required prop children will be filled via i18n translation
              <Link
                external
                href="https://www.ibm.com/docs/en/instana-observability/current?topic=instana-configuring-authentication"
              />
            )
          }}
          values={{ authenticationDocLink: t('in-settings:tabs.configuringAuthenticationLink') }}
        />
      </Message>
    </>
  );
}
