/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import FunnelTile from 'in-amp/components/FunnelTile';
import { t } from 'in-i18n';

import locals from './AdoptionFunnelTile.mless';

/**
 * The adoption tile of the funnel.
 * Renders a set of KPI labels.
 * @param {number} position The position the tile is in the funnel, from the left.
 * @param {object} accountInfo The retrieved account information, including the adoption data.
 */
export default function AdoptionFunnelTile({ position, accountInfo }) {
  return (
    <FunnelTile
      title={t('in-amp:components.activationAdoption.adoption')}
      backgroundColor="rgba(145, 195, 220, 0.6)"
      position={position}
    >
      <AdoptionFunnelTileContent kpis={accountInfo?.data?.adoption} />
    </FunnelTile>
  );
}

/**
 * The content of the adoption tile.
 * @param {object} kpis The KPI values to be rendered
 */
function AdoptionFunnelTileContent({ kpis = {} }) {
  return (
    <div>
      <div>
        <strong>{t('in-amp:components.activationAdoption.adoptionKPIs.applicationPerspective')}</strong>
        <div className={locals.kpiRow}>
          <KpiLabel
            kpiValue={kpis.numOfApplicationPerspectives}
            title={t('in-amp:components.activationAdoption.adoptionKPIs.numOfApplicationPerspectives')}
          />
          <KpiLabel
            kpiValue={kpis.numOfReportingApplicationPerspectives}
            title={t('in-amp:components.activationAdoption.adoptionKPIs.numOfReportingApplicationPerspectives')}
          />
        </div>
      </div>
      <div>
        <strong>{t('in-amp:components.activationAdoption.adoptionKPIs.eum')}</strong>
        <div className={locals.kpiRow}>
          <KpiLabel
            kpiValue={kpis.numOfWebsites}
            title={t('in-amp:components.activationAdoption.adoptionKPIs.numOfWebsites')}
          />
        </div>
      </div>
      <div>
        <strong>{t('in-amp:components.activationAdoption.adoptionKPIs.alerting')}</strong>
        <div className={locals.kpiRow}>
          <KpiLabel
            kpiValue={kpis.numOfAlertChannels}
            title={t('in-amp:components.activationAdoption.adoptionKPIs.numOfAlertChannels')}
          />
          <KpiLabel
            kpiValue={kpis.numOfAlerts}
            title={t('in-amp:components.activationAdoption.adoptionKPIs.numOfAlerts')}
          />
          <KpiLabel
            kpiValue={kpis.numOfActiveAlerts}
            title={t('in-amp:components.activationAdoption.adoptionKPIs.numOfActiveAlerts')}
          />
        </div>
      </div>
      <div>
        <strong>{t('in-amp:components.activationAdoption.adoptionKPIs.pipelineFeedback')}</strong>
        <div className={locals.kpiRow}>
          <KpiLabel
            kpiValue={kpis.numOfReleases}
            title={t('in-amp:components.activationAdoption.adoptionKPIs.numOfReleases')}
          />
        </div>
      </div>
      <div>
        <strong>{t('in-amp:components.activationAdoption.adoptionKPIs.customDashboards')}</strong>
        <div className={locals.kpiRow}>
          <KpiLabel
            kpiValue={kpis.numOfCustomDashboards}
            title={t('in-amp:components.activationAdoption.adoptionKPIs.numOfCustomDashboards')}
          />
        </div>
      </div>
      <div>
        <strong>{t('in-amp:components.activationAdoption.adoptionKPIs.mobileEum')}</strong>
        <div className={locals.kpiRow}>
          <KpiLabel
            kpiValue={kpis.numOfMobileApps}
            title={t('in-amp:components.activationAdoption.adoptionKPIs.numOfMobileApps')}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a colored label box with the title and value of a KPI
 * @param {number} kpiValues The value of the to-be-rendered KPI.
 * @param {string} title The title of the to-be-rendered KPI.
 */
function KpiLabel({ kpiValue, title }) {
  return (
    <div className={getLabelColorClass(kpiValue)}>
      <div className={locals.kpiTitle}>{title}</div>
      {parseValue(kpiValue)}
    </div>
  );
}

/**
 * Checks if the given value exists, and if not, replaces it with a placeholder.
 * @param {number} kpiValue The value of the KPI.
 */
function parseValue(kpiValue) {
  return kpiValue ?? '---';
}

/**
 * Retrieves a different class depending on whether the value of a KPI exists.
 * @param {number} kpiValue The value of the KPI.
 * @returns The class to be applied.
 */
function getLabelColorClass(kpiValue) {
  return kpiValue != null && kpiValue > 0 ? locals.kpiActive : locals.kpiInactive;
}
