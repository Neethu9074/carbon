/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { FunctionComponent } from 'react';

import { Link, Message } from '@instana/components';

import { Trans } from 'in-i18n';

import locals from './LegacyAppdataEventInfoMessage.mless';

interface Props {
  migrated?: boolean;
  saved?: boolean;
  disallowed?: boolean;
  deleted?: boolean;
}

export const smartAlertMigrationUrl =
  'https://www.ibm.com/docs/en/obi/current?topic=applications-smart-alerts' +
  '#how-to-migrate-a-custom-event-on-application-service-or-endpoint-metrics-to-smart-alerts';

export const SmartAlertMigrationDocs = (
  <Link href={smartAlertMigrationUrl} external>
    &nbsp;
  </Link>
);

/** Temporary wrapper to achieve the new design of the Message component, before
 * it is available in our design system:
 *
 * It achieves a better, more contrast-ful color scheme, with dark text,
 * adds a gap before the link (to documentation)
 *
 * Later, this can be just removed and will not be longer needed.*/
export const MessageContentModernDesign: FunctionComponent = ({ children }) => {
  return <div className={locals.modern}>{children}</div>;
};

export default function LegacyAppdataEventInfoMessage({ migrated, saved, disallowed, deleted }: Props) {
  return (
    <Message type={!deleted && !migrated && saved && !disallowed ? 'warning' : 'neutral'} withIcon small>
      <MessageContentModernDesign>
        <TransContent migrated={migrated} saved={saved} disallowed={disallowed} deleted={deleted} />
      </MessageContentModernDesign>
    </Message>
  );
}

function TransContent({ migrated, saved, disallowed, deleted }: Props) {
  if (deleted) {
    return <Trans i18nKey="in-settings:tabs.deletedEventMessage" />;
  }

  if (migrated) {
    return (
      <Trans
        i18nKey="in-settings:tabs.migratedEventMessage"
        components={{
          documentationLink: SmartAlertMigrationDocs
        }}
      />
    );
  }
  if (saved) {
    if (disallowed) {
      return (
        <Trans
          i18nKey="in-settings:tabs.disallowedEventMessage"
          components={{
            documentationLink: SmartAlertMigrationDocs
          }}
        />
      );
    }

    return (
      <Trans
        i18nKey="in-settings:tabs.deprecatedEventMessage"
        components={{
          documentationLink: SmartAlertMigrationDocs
        }}
      />
    );
  }
  return (
    <Trans
      i18nKey="in-settings:tabs.deprecatedEventSelectedMessage"
      components={{
        documentationLink: SmartAlertMigrationDocs
      }}
    />
  );
}
