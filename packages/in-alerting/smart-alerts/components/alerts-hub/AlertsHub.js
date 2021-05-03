/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import getApplicationAlertConfigStats from 'in-alerting/smart-alerts/subscriptions/getApplicationAlertConfigStats';
import getWebsiteAlertConfigStats from 'in-alerting/smart-alerts/subscriptions/getWebsiteAlertConfigStats';
import getLegacyAlertConfigStats from 'in-alerting/smart-alerts/subscriptions/getLegacyAlertConfigStats';
import { teamSettingsAlertingEvents, teamSettingsAlertingAlerts } from 'in-settings/navigation/paths';
import AlertsHubElement from 'in-alerting/smart-alerts/components/alerts-hub/AlertsHubElement';
import { websitesPathFullyQualified } from 'in-websites/navigation/paths';
import { alertsList } from 'in-applications/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { Row, Col } from 'in-new-components/layout/Grid';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/alerts-hub/AlertsHub.mless';

function useAlertStats() {
  const websiteAlertConfigStats = useObservable(getWebsiteAlertConfigStats, []) ?? pendingResult;
  const applicationAlertConfigStats = useObservable(getApplicationAlertConfigStats, []) ?? pendingResult;
  const legacyAlertConfigStats = useObservable(getLegacyAlertConfigStats, []) ?? pendingResult;
  return {
    websites: {
      alerts: websiteAlertConfigStats.data?.websiteAlerts ?? 0,
      websites: websiteAlertConfigStats.data?.websites ?? 0,
      loading: isLoading(websiteAlertConfigStats)
    },
    applications: {
      globalSmartAlerts: applicationAlertConfigStats.data?.globalSmartAlerts ?? 0,
      smartAlerts: applicationAlertConfigStats.data?.smartAlerts ?? 0,
      loading: isLoading(applicationAlertConfigStats)
    },
    infrastructure: {
      alerts: legacyAlertConfigStats.data?.legacyAlerts ?? 0,
      events: legacyAlertConfigStats.data?.customEvents ?? 0,
      loading: isLoading(legacyAlertConfigStats)
    }
  };
}

export default function AlertsHub() {
  const data = useAlertStats();
  return (
    <div className={locals.container}>
      {renderTitle()}
      {renderContent(data)}
    </div>
  );
}

function renderTitle() {
  return (
    <div>
      <h1 className={locals.headline}>Instana {t('in-alerting:smartAlerts.components.alertsHub.title')}</h1>
      <p>{t('in-alerting:smartAlerts.components.alertsHub.introText')}</p>
    </div>
  );
}

function renderContent({ websites, applications, infrastructure }) {
  const content = [
    {
      title: t('in-alerting:smartAlerts.components.alertsHub.websites.title'),
      description: [t('in-alerting:smartAlerts.components.alertsHub.websites.description0')],
      stats: {
        text: t('in-alerting:smartAlerts.components.alertsHub.websites.stats', websites),
        loading: websites.loading
      },
      buttons: [
        {
          text: t('in-alerting:smartAlerts.components.alertsHub.websites.button0'),
          icon: 'lib_website',
          path: websitesPathFullyQualified
        }
      ]
    },
    {
      title: t('in-alerting:smartAlerts.components.alertsHub.applications.title'),
      description: [t('in-alerting:smartAlerts.components.alertsHub.applications.description0')],
      // moreLink: 'https://example.org', TODO: link to application smart alerts docs once available
      stats: {
        text: t('in-alerting:smartAlerts.components.alertsHub.applications.stats', applications),
        loading: applications.loading
      },
      buttons: [
        {
          text: t('in-alerting:smartAlerts.components.alertsHub.applications.button0'),
          icon: 'lib_alerts_alert',
          path: alertsList
        }
      ]
    },
    {
      title: t('in-alerting:smartAlerts.components.alertsHub.infrastructure.title'),
      description: [
        t('in-alerting:smartAlerts.components.alertsHub.infrastructure.description0'),
        t('in-alerting:smartAlerts.components.alertsHub.infrastructure.description1'),
        t('in-alerting:smartAlerts.components.alertsHub.infrastructure.description2')
      ],
      stats: {
        text: t('in-alerting:smartAlerts.components.alertsHub.infrastructure.stats', infrastructure),
        loading: infrastructure.loading
      },
      buttons: [
        {
          text: t('in-alerting:smartAlerts.components.alertsHub.infrastructure.button0'),
          icon: 'lib_events_warning',
          path: teamSettingsAlertingAlerts
        },
        {
          text: t('in-alerting:smartAlerts.components.alertsHub.infrastructure.button1'),
          icon: 'lib_help_error_warning',
          path: teamSettingsAlertingEvents,
          kind: 'info'
        }
      ]
    }
  ];
  return (
    <Row className={locals.mainRow}>
      {content.map((element, i) => (
        <Col key={i} lg={4}>
          <AlertsHubElement
            title={element.title}
            description={element.description}
            moreLink={element.moreLink}
            stats={element.stats}
            footer={
              <>
                {element.buttons.map((b, i) => {
                  const { text, path, ...buttonProps } = b;
                  return (
                    <Button key={i} href$={getModifiedUrlStream(p => (p.pathname = path))} {...buttonProps}>
                      {text}
                    </Button>
                  );
                })}
              </>
            }
          />
        </Col>
      ))}
    </Row>
  );
}
