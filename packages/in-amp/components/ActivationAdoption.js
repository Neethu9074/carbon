/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';

import WeeklyActiveUserChart from 'in-amp/components/WeeklyActiveUserChart';
import ActivationFunnelTile from 'in-amp/components/ActivationFunnelTile';
import TopActiveUsersTable from 'in-amp/components/TopActiveUsersTable';
import ActivationChecklist from 'in-amp/components/ActivationChecklist';
import AdoptionFunnelTile from 'in-amp/components/AdoptionFunnelTile';
import UserSummaryChart from 'in-amp/components/UserSummaryChart';
import { getAccountAsResultObservable } from 'in-amp/api/account';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import { Row, Col } from 'in-components/layout/Grid';
import Funnel from 'in-amp/components/Funnel';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './ActivationAdoption.mless';

/**
 * The Activation & Adoption section in the Account & Billing tab.
 * Renders the Adoption Funnel, the Activation Checklist, the Adoption KPI Sparkcharts and the User Usage metrics.
 */
export default function ActivationAdoption() {
  const accountInfo = useObservable(getAccountAsResultObservable, []);

  return (
    <>
      <Title title={t('in-amp:components.activationAdoption.activationAdoption')} />

      <SubViewHeader>{t('in-amp:components.activationAdoption.activationAdoption')}</SubViewHeader>
      <SectionLine />

      <Row>
        <Col xs={12}>
          <Card title={t('in-amp:components.activationAdoption.customerAdoption')}>
            <div className={locals.funnel}>
              <Funnel
                accountInfo={accountInfo}
                tiles={[
                  {
                    Renderer: ActivationFunnelTile
                  },
                  {
                    Renderer: AdoptionFunnelTile
                  }
                ]}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Row className={locals.lastRow}>
        <Col xs={6}>
          <Card title={t('in-amp:components.activationAdoption.activationChecklist')}>
            <ActivationChecklist accountInfo={accountInfo} />
          </Card>
        </Col>
        <Col xs={6}>
          <Card title={t('in-amp:components.activationAdoption.productAdoption')}>
            {t('in-amp:components.activationAdoption.comingSoon')}
          </Card>
        </Col>
      </Row>

      <SubViewHeader>{t('in-amp:components.activationAdoption.userUsage')}</SubViewHeader>
      <SectionLine />

      <Row>
        <Col xs={4}>
          <Card title={t('in-amp:components.activationAdoption.userSummary')}>
            <UserSummaryChart accountInfo={accountInfo} />
          </Card>
        </Col>
        <Col xs={4}>
          <Card title={t('in-amp:components.activationAdoption.weeklyActiveUser')}>
            <WeeklyActiveUserChart accountInfo={accountInfo} />
          </Card>
        </Col>
        <Col xs={4}>
          <Card title={t('in-amp:components.activationAdoption.lastCalendarWeekTopActiveUsers')}>
            <TopActiveUsersTable accountInfo={accountInfo} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
