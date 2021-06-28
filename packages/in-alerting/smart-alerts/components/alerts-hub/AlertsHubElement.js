/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Card, Link } from '@instana/components';
import { Message } from '@instana/components';
import { Stack } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/alerts-hub/AlertsHubElement.mless';

export default function AlertsHubElement({ title, description, moreLink, stats = {}, footer }) {
  const { text: statsText } = stats;
  return (
    <Card title={title}>
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
    </Card>
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
