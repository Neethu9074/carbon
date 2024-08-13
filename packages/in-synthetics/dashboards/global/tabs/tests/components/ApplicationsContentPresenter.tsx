/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { ButtonGroup, Card, Li, Link, Stack, SvgIcon, Ul } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { t } from '@instana/i18n-react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { useLinkToApplicationDashboard } from 'in-applications/navigation/paths';
import { useGenerateLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { syntheticMultiWebMobileEnabled } from 'in-services/featureFlags';
import { useGenerateLinkToWebsite } from 'in-websites/navigation/paths';
import Overlay from 'in-components/overlays/Overlay/Overlay';
import { TestResultListItem } from 'in-types';

import locals from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions.mless';

interface Props {
  item?: TestResultListItem;
  applicationIds: string[];
  applicationLabels: string[];
  shouldDisplayLink: boolean | undefined;
}

const ApplicationsContentPresenter = ({ item, applicationIds, applicationLabels, shouldDisplayLink }: Props) => {
  const websiteLabels = item?.testResultCommonProperties.testCommonProperties?.getWebsiteLabels || [];
  const mobileAppsLabels = item?.testResultCommonProperties.testCommonProperties?.mobileApplicationLabels || [];
  const numberOfAssociations: number = syntheticMultiWebMobileEnabled
    ? applicationLabels.length + websiteLabels.length + mobileAppsLabels.length
    : applicationLabels.length;

  if (numberOfAssociations !== 0) {
    return (
      <Overlay
        props={{ item, applicationIds, applicationLabels, shouldDisplayLink, numberOfAssociations }}
        content={Content}
        align="auto"
      >
        {({ toggle }) => (
          <HorizontalFlexWrapper>
            <SvgIcon type={'lib_application_invert'} />
            <div onClick={toggle}>
              <span className={locals.labelApp}>
                {numberOfAssociations === 1
                  ? t('in-synthetics:dashboard.testList.multiAppDialog.singleAppHeader', {
                      number: numberOfAssociations
                    })
                  : t('in-synthetics:dashboard.testList.multiAppDialog.multiAppHeader', {
                      number: numberOfAssociations
                    })}
              </span>
            </div>
          </HorizontalFlexWrapper>
        )}
      </Overlay>
    );
  }

  return (
    <div>
      <span className={locals.label}>{''}</span>
    </div>
  );
};

interface ContentProps {
  item: TestResultListItem | undefined;
  applicationIds: string[];
  applicationLabels: string[];
  shouldDisplayLink?: boolean;
  close: () => void;
  numberOfAssociations: number;
}

const constructAssociationsMap = (associationLabels: string[], associationIds: string[]) => {
  if (associationLabels.length !== associationIds.length) {
    return null;
  }

  const map = new Map();
  for (let i = 0; i < associationLabels.length; i++) {
    map.set(associationLabels[i], associationIds[i]);
  }
  return map;
};

const Content = (props: ContentProps) => {
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
  const getLinkToWebsiteDashboard = useGenerateLinkToWebsite();
  const getLinkToMobileAppDashboard = useGenerateLinkToMobileApp();
  const { item, applicationIds, applicationLabels, close, shouldDisplayLink = true, numberOfAssociations } = props;
  const appsMap = constructAssociationsMap(applicationLabels, applicationIds);

  // New feature
  const websiteLabels = item?.testResultCommonProperties.testCommonProperties?.getWebsiteLabels || [];
  const websiteIds = item?.testResultCommonProperties.testCommonProperties?.websiteIds || [];
  const mobileAppsLabels = item?.testResultCommonProperties.testCommonProperties?.mobileApplicationLabels || [];
  const mobileAppsIds = item?.testResultCommonProperties.testCommonProperties?.mobileApplicationIds || [];
  const websiteMap = constructAssociationsMap(websiteLabels, websiteIds);
  const mobileAppsMap = constructAssociationsMap(mobileAppsLabels, mobileAppsIds);

  const filterLabels = ['Applications', 'Websites', 'Mobile Apps'];
  const [activeLabel, setActiveLabel] = useState(filterLabels[0]);
  const filterLabelsReferences = [
    t('in-synthetics:dashboard.testList.multiAppDialog.filterLabel'),
    t('in-synthetics:dashboard.testList.multiWebDialog.filterLabel'),
    t('in-synthetics:dashboard.testList.multiMobileDialog.filterLabel')
  ];

  const renderFilteredList = () => {
    if (activeLabel === 'Applications') {
      return (
        <Ul className={locals.associationsList}>
          {applicationLabels.length === 0 ? (
            <Li className={locals.issue}>
              <span className={locals.label}>
                {t('in-synthetics:dashboard.testList.multiAppDialog.noApplicationsAssociated')}
              </span>
            </Li>
          ) : (
            applicationLabels.map(label => {
              const applicationId = appsMap?.get(label);
              return (
                <Li key={generateUniqueShortId()} className={locals.issue}>
                  {shouldDisplayLink ? (
                    <Link ellipsis inline href={getLinkToApplicationDashboard({ applicationId })}>
                      <span className={locals.label}>{label}</span>
                    </Link>
                  ) : (
                    <span className={locals.label}>{label}</span>
                  )}
                </Li>
              );
            })
          )}
        </Ul>
      );
    }
    if (activeLabel === 'Websites') {
      return (
        <Ul className={locals.associationsList}>
          {websiteLabels.length === 0 ? (
            <Li className={locals.issue}>
              <span className={locals.label}>
                {t('in-synthetics:dashboard.testList.multiWebDialog.noWebsitesAssociated')}
              </span>
            </Li>
          ) : (
            websiteLabels.map(label => {
              const websiteId = websiteMap?.get(label);
              return (
                <Li key={generateUniqueShortId()} className={locals.issue}>
                  <Link inline ellipsis href={getLinkToWebsiteDashboard(websiteId)}>
                    <span className={locals.label}>{label}</span>
                  </Link>
                </Li>
              );
            })
          )}
        </Ul>
      );
    }
    if (activeLabel === 'Mobile Apps') {
      return (
        <Ul className={locals.associationsList}>
          {mobileAppsLabels.length === 0 ? (
            <Li className={locals.issue}>
              <span className={locals.label}>
                {t('in-synthetics:dashboard.testList.multiMobileDialog.noMobileAppsAssociated')}
              </span>
            </Li>
          ) : (
            mobileAppsLabels.map(label => {
              const mobileAppId = mobileAppsMap?.get(label);
              return (
                <Li key={generateUniqueShortId()} className={locals.issue}>
                  <Link inline ellipsis href={getLinkToMobileAppDashboard(mobileAppId)}>
                    <span className={locals.label}>{label}</span>
                  </Link>
                </Li>
              );
            })
          )}
        </Ul>
      );
    }
    return null;
  };

  const getCardTitle = (): string => {
    if (numberOfAssociations === 1)
      return t('in-synthetics:dashboard.testList.popDialog.singleAssociationTitle', { number: numberOfAssociations });

    return t('in-synthetics:dashboard.testList.popDialog.associationsTitle', { number: numberOfAssociations });
  };

  if (syntheticMultiWebMobileEnabled) {
    return (
      <Card
        title={getCardTitle()}
        rightHeaderContent={<SvgIcon type="lib_openclose_cancel" size="s" onClick={close} />}
        isScrollable
      >
        <Stack>
          <ButtonGroup
            buttonPropsList={filterLabels.map((label, index) => ({
              text: filterLabelsReferences[index],
              key: label,
              onClick: () => setActiveLabel(label)
            }))}
            activeKey={activeLabel}
          />
          {renderFilteredList()}
        </Stack>
      </Card>
    );
  }

  return (
    <section>
      <h1 className={locals.overlayHeader}>
        <div className={locals.title}>
          {applicationLabels.length === 1
            ? t('in-synthetics:dashboard.testList.multiAppDialog.singleAppSpan', {
                number: applicationLabels?.length
              })
            : t('in-synthetics:dashboard.testList.multiAppDialog.multiAppSpan', {
                number: applicationLabels?.length
              })}
        </div>
        <SvgIcon type="lib_openclose_cancel" size="l" onClick={close} />
      </h1>
      <ol className={locals.issues}>
        {applicationLabels?.map(applicationLabel => {
          const applicationId = appsMap?.get(applicationLabel);
          return (
            <li key={generateUniqueShortId()} className={locals.issue}>
              {shouldDisplayLink ? (
                <Link href={getLinkToApplicationDashboard({ applicationId })}>
                  <span className={locals.label}>{applicationLabel}</span>
                </Link>
              ) : (
                <span className={locals.label}>{applicationLabel}</span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default ApplicationsContentPresenter;
