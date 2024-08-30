/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import { Record } from 'immutable';

import { SyntheticTest } from '@instana/types/typeDefinitions';
import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { Col, Row } from 'in-components/layout/Grid/Grid';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

interface Props {
  test: SyntheticTest;
}

const Associations = ({ test }: Props) => {
  const [visibleItems, setVisibleItems] = useState<Record<string, number>>({
    applications: 10,
    websites: 10,
    mobileApps: 10
  });

  const handleLoadMore = (event: React.MouseEvent, entity: string) => {
    event.preventDefault();
    setVisibleItems(prevState => ({
      ...prevState,
      [entity]: prevState[entity] + 10
    }));
  };

  const loadMoreEntities = (entity: string) => {
    const displayLoadMoreButton = () => {
      switch (entity) {
        case 'applications':
          return visibleItems.applications < (test?.applicationLabels?.length ?? 0);
        case 'websites':
          return visibleItems.websites < (test?.websiteLabels?.length ?? 0);
        case 'mobileApps':
          return visibleItems.mobileApps < (test?.mobileAppLabels?.length ?? 0);
        default:
          return false;
      }
    };
    return (
      <div className={locals.center}>
        {displayLoadMoreButton() && (
          <Row className={locals.loadMore}>
            <Button kind="action" onClick={e => handleLoadMore(e, entity)}>
              {t('in-synthetics:dialog.createTest.advancedMode.loadMore')}
            </Button>
          </Row>
        )}
      </div>
    );
  };

  return (
    <ExpandableLightCard
      className={locals.expandableCard}
      title={t('in-synthetics:dashboard.configuration.associations')}
      darkFrame
      useMaxAvailableHeight
      openByDefault
    >
      <Row>
        <LightCard
          className={locals.lastConfigRow}
          title={t('in-synthetics:dashboard.configuration.associatedApplications')}
          darkFrame
          framed
        >
          {test.applicationLabels?.length === 0 || test.applicationLabels === undefined
            ? t('in-synthetics:dashboard.configuration.noApplicationsAssociated')
            : test.applicationLabels.slice(0, visibleItems.applications).map((application, index) => {
                return (
                  <Row
                    key={index}
                    className={classNames({
                      [locals.configRow]: true,
                      [locals.lastRow]: index === test.applicationLabels?.length! - 1
                    })}
                  >
                    <Col xs={12}>{application}</Col>
                  </Row>
                );
              })}
          {loadMoreEntities('applications')}
        </LightCard>
      </Row>
      {syntheticRbacLimitedEnabled && (
        <>
          <Row>
            <LightCard
              className={locals.lastConfigRow}
              title={t('in-synthetics:dashboard.configuration.associatedWebsites')}
              darkFrame
              framed
            >
              {test.websiteLabels?.length === 0 || test.websiteLabels === undefined
                ? t('in-synthetics:dashboard.configuration.noWebsitesAssociated')
                : test.websiteLabels.slice(0, visibleItems.websites).map((website, index) => {
                    return (
                      <Row
                        key={index}
                        className={classNames({
                          [locals.configRow]: true,
                          [locals.lastRow]: index === test.websiteLabels?.length! - 1
                        })}
                      >
                        <Col xs={12}>{website}</Col>
                      </Row>
                    );
                  })}
              {loadMoreEntities('websites')}
            </LightCard>
          </Row>
          <Row>
            <LightCard
              className={locals.lastConfigRow}
              title={t('in-synthetics:dashboard.configuration.associatedMobileApps')}
              darkFrame
              framed
            >
              {test.mobileAppLabels?.length === 0 || test.mobileAppLabels === undefined
                ? t('in-synthetics:dashboard.configuration.noMobileAppAssociated')
                : test.mobileAppLabels.slice(0, visibleItems.mobileApps).map((mobileApp, index) => {
                    return (
                      <Row
                        key={index}
                        className={classNames({
                          [locals.configRow]: true,
                          [locals.lastRow]: index === test.mobileAppLabels?.length! - 1
                        })}
                      >
                        <Col xs={12}>{mobileApp}</Col>
                      </Row>
                    );
                  })}
              {loadMoreEntities('mobileApps')}
            </LightCard>
          </Row>
        </>
      )}
    </ExpandableLightCard>
  );
};

export default Associations;
