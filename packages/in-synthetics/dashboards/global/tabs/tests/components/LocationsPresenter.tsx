/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { LocationStatus, TestResultListItem } from '@instana/types';
import { Card, Li, Stack, SvgIcon, Ul } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter/HealthIndicatorPresenter';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import Overlay from 'in-components/overlays/Overlay/Overlay';
import { t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions.mless';

interface Props {
  item: TestResultListItem;
}

const LocationsPresenter = ({ item }: Props) => {
  const locationStatusList: LocationStatus[] =
    item?.testResultCommonProperties?.testCommonProperties?.locationStatusList ?? [];
  const totalLocations = locationStatusList.length;

  if (totalLocations === 0) {
    return (
      <span data-test="no-locations-span" className={locals.locationsLabel}>
        {''}
      </span>
    );
  }

  const getLocationsColumnText = (): string => {
    if (totalLocations === 1) {
      return t('in-synthetics:dashboard.testList.locationsColumn.singleLocation', { number: totalLocations });
    }
    return t('in-synthetics:dashboard.testList.locationsColumn.multipleLocations', { number: totalLocations });
  };

  return (
    <Overlay
      props={{
        locationStatusList
      }}
      content={Content}
      align="auto"
    >
      {({ toggle }) => (
        <HorizontalFlexWrapper>
          <SvgIcon type={'lib_synthetic_location'} />
          <div onClick={toggle}>
            <span data-test="locations-col-text" className={locals.labelApp}>
              {getLocationsColumnText()}
            </span>
          </div>
        </HorizontalFlexWrapper>
      )}
    </Overlay>
  );
};

interface ContentProps {
  locationStatusList: LocationStatus[];
  close: () => void;
}
const Content = (props: ContentProps) => {
  const { locationStatusList, close } = props;

  const getRunsInLocationsText = (totalLocations: number) => {
    if (totalLocations === 1) {
      return t('in-synthetics:dashboard.testList.locationsColumn.singleRun', { number: totalLocations });
    }
    return t('in-synthetics:dashboard.testList.locationsColumn.multipleRun', { number: totalLocations });
  };

  const getContentBySeverity = (location: LocationStatus) => {
    const severity = location.successRate == 1 ? 0 : 5;
    const totalRuns = location.totalTestRuns;
    if (severity === 0) {
      return (
        <>
          <span data-test="no-issues-span" className={locals.locationsLabel}>
            {t('in-synthetics:dashboard.testList.locationsColumn.noIssues')}
          </span>
          <HealthIndicatorPresenter
            openIssues={severity}
            maxSeverity={severity}
            active={false}
            iconOnly
            iconOnlySize="s"
          />
        </>
      );
    } else {
      if (totalRuns !== 0) {
        return (
          <>
            <span data-test="warning-span" className={locals.locationsLabel}>
              {t('in-synthetics:dashboard.testList.locationsColumn.warning')}
            </span>
            <HealthIndicatorPresenter
              openIssues={severity}
              maxSeverity={severity}
              iconOnly
              active={false}
              iconOnlySize="s"
            />
          </>
        );
      } else {
        return (
          <span data-test="no-health-span" className={locals.locationsLabel}>
            {t('in-synthetics:dashboard.testList.na')}
          </span>
        );
      }
    }
  };

  return (
    <Card
      title={getRunsInLocationsText(locationStatusList.length)}
      rightHeaderContent={<SvgIcon type="lib_openclose_cancel" size="s" onClick={close} />}
      isScrollable
    >
      <Stack>
        <Ul className={locals.associationsList}>
          {locationStatusList.map((location: LocationStatus) => {
            return (
              <Li key={generateUniqueShortId()} className={locals.issue}>
                <div className={locals.locationItemsLeft}>
                  <SvgIcon type={'lib_synthetic_location'} />
                  {/* TODO: Need the dynamic link if available */}
                  <span data-test="location-display-label" className={locals.locationsLabel}>
                    {location.locationDisplayLabel}
                  </span>
                </div>
                <div className={locals.locationItemsRight}>{getContentBySeverity(location)}</div>
              </Li>
            );
          })}
        </Ul>
      </Stack>
    </Card>
  );
};

export default LocationsPresenter;
