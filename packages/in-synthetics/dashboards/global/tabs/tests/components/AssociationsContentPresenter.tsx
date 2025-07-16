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
import { useGenerateLinkToWebsite } from 'in-websites/navigation/paths';
import Overlay from 'in-components/overlays/Overlay/Overlay';

import locals from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions.mless';

interface Props {
  applicationIds: string[];
  applicationLabels: string[];
  websiteIds: string[];
  websiteLabels: string[];
  mobileAppIds: string[];
  mobileAppLabels: string[];
  applicationIdsCanBeLinked: string[];
  websiteIdsCanBeLinked: string[];
  mobileAppIdsCanBeLinked: string[];
}

const AssociationsContentPresenter = ({
  applicationIds,
  applicationLabels,
  websiteIds,
  websiteLabels,
  mobileAppIds,
  mobileAppLabels,
  applicationIdsCanBeLinked,
  websiteIdsCanBeLinked,
  mobileAppIdsCanBeLinked
}: Props) => {
  const numberOfAssociations: number = applicationLabels.length + websiteLabels.length + mobileAppLabels.length;

  if (numberOfAssociations !== 0) {
    return (
      <Overlay
        props={{
          applicationIds,
          applicationLabels,
          websiteIds,
          websiteLabels,
          mobileAppIds,
          mobileAppLabels,
          numberOfAssociations,
          applicationIdsCanBeLinked,
          websiteIdsCanBeLinked,
          mobileAppIdsCanBeLinked
        }}
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
      <span data-testid="noAssociations" className={locals.label}>
        {''}
      </span>
    </div>
  );
};

interface ContentProps {
  applicationIds: string[];
  applicationLabels: string[];
  websiteIds: string[];
  websiteLabels: string[];
  mobileAppIds: string[];
  mobileAppLabels: string[];
  close: () => void;
  numberOfAssociations: number;
  applicationIdsCanBeLinked: string[];
  websiteIdsCanBeLinked: string[];
  mobileAppIdsCanBeLinked: string[];
}

export const constructAssociationsMap = (associationLabels: string[], associationIds: string[]) => {
  if (associationLabels.length !== associationIds.length) {
    return null;
  }

  const map = new Map<string, string>();
  for (let i = 0; i < associationLabels.length; i++) {
    map.set(associationLabels[i], associationIds[i]);
  }
  return map;
};

const Content = (props: ContentProps) => {
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
  const getLinkToWebsiteDashboard = useGenerateLinkToWebsite();
  const getLinkToMobileAppDashboard = useGenerateLinkToMobileApp();
  const {
    applicationIds,
    applicationLabels,
    websiteIds,
    websiteLabels,
    mobileAppIds,
    mobileAppLabels,
    close,
    numberOfAssociations,
    applicationIdsCanBeLinked,
    websiteIdsCanBeLinked,
    mobileAppIdsCanBeLinked
  } = props;
  const appsMap = constructAssociationsMap(applicationLabels, applicationIds);
  const websiteMap = constructAssociationsMap(websiteLabels, websiteIds);
  const mobileAppsMap = constructAssociationsMap(mobileAppLabels, mobileAppIds);

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
              const applicationId = appsMap?.get(label)!;
              return (
                <Li key={generateUniqueShortId()} className={locals.issue}>
                  {applicationIdsCanBeLinked.includes(applicationId) ? (
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
              const websiteId = websiteMap?.get(label)!;
              return (
                <Li key={generateUniqueShortId()} className={locals.issue}>
                  {websiteIdsCanBeLinked.includes(websiteId) ? (
                    <Link inline ellipsis href={getLinkToWebsiteDashboard(websiteId)}>
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
    if (activeLabel === 'Mobile Apps') {
      return (
        <Ul className={locals.associationsList}>
          {mobileAppLabels.length === 0 ? (
            <Li className={locals.issue}>
              <span className={locals.label}>
                {t('in-synthetics:dashboard.testList.multiMobileDialog.noMobileAppsAssociated')}
              </span>
            </Li>
          ) : (
            mobileAppLabels.map(label => {
              const mobileAppId = mobileAppsMap?.get(label)!;
              return (
                <Li key={generateUniqueShortId()} className={locals.issue}>
                  {mobileAppIdsCanBeLinked.includes(mobileAppId) ? (
                    <Link inline ellipsis href={getLinkToMobileAppDashboard(mobileAppId)}>
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
    return null;
  };

  const getCardTitle = (): string => {
    if (numberOfAssociations === 1)
      return t('in-synthetics:dashboard.testList.popDialog.singleAssociationTitle', { number: numberOfAssociations });

    return t('in-synthetics:dashboard.testList.popDialog.associationsTitle', { number: numberOfAssociations });
  };

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
};

export default AssociationsContentPresenter;
