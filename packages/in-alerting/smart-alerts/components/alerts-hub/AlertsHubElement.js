/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import LightCardV2 from 'in-new-components/Card/LightCardV2';
import Stack from 'in-new-components/layout/Stack';
import Message from 'in-new-components/Message';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/alerts-hub/AlertsHubElement.mless';

export default function AlertsHubElement({ title, description, moreLink, stats = {}, footer }) {
  const { text: statsText } = stats;
  return (
    <LightCardV2 title={title}>
      <div className={locals.container}>
        <Stack>
          <div>
            {description.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
            {moreLink && (
              <Link href={moreLink} external>
                {t('in-alerting:smartAlerts.components.alertsHub.readMore')}
              </Link>
            )}
          </div>
          {stats && <Message title={statsText} />}
        </Stack>
        <div className={locals.footer}>{footer}</div>
      </div>
    </LightCardV2>
  );
}

AlertsHubElement.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.arrayOf(PropTypes.string),
  moreLink: PropTypes.string,
  stats: PropTypes.shape({
    text: PropTypes.string,
    loading: PropTypes.bool
  }),
  footer: PropTypes.element
};
