/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { mobileAppId as matrixMobileAppId, viewId as matrixViewId } from 'in-mobile-apps/navigation/matrix';
import { dashboardTagFilters as tagFiltersTrackers } from 'in-mobile-apps/tracking/segTracker';
import { mobileAppPath, mobileAppPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import { urlStateDefinition } from 'in-mobile-apps/MobileAppDashboard/MobileAppDashboard';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useTagFilterManipulators } from 'in-mobile-apps/tagFiltersHoc';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getTimeConfig } from 'in-stores/time/config';
import useUrlState from 'in-hooks/useUrlState';

export function useGetMobileAppProps() {
  const location = useLocation();
  const [{ tagFilters: customTagFilters }, setUrl] = useUrlState(urlStateDefinition);

  const setUrlNew = tagFilters =>
    setUrl({
      // We have to pass down the mobile app ID and view name tag filters to the analyze bar. This is necessary
      // so that the analyze bar loads meaningful suggestions. Unfortunately this also means that the analyze
      // bar will eventually to try set these kinds of tag filters. We must forbid setting of these, as
      // otherwise the UI behavior will be super confusing.
      //
      // drop the implicit tag filters
      tagFilters: tagFilters.filter(f => f.name !== 'mobileBeacon.mobileApp.id' && f.name !== 'mobileBeacon.view.name')
    });

  const tagFilterManipulators = useTagFilterManipulators(tagFiltersTrackers, customTagFilters, setUrlNew);
  const props = {
    mobileAppId: getMatrixParameter(location, mobileAppPath, matrixMobileAppId),
    viewId: getMatrixParameter(location, mobileAppPath, matrixViewId),
    viewPath: mobileAppPathFullyQualified,
    timeConfig: getTimeConfig(location),
    ...tagFilterManipulators,
    location
  };

  const implicitTagFilters = (props.implicitTagFilters = [
    {
      name: 'mobileBeacon.mobileApp.id',
      operator: 'EQUALS',
      stringValue: props.mobileAppId
    }
  ]);
  if (props.viewId) {
    implicitTagFilters.push({
      name: 'mobileBeacon.view.name',
      operator: 'EQUALS',
      stringValue: props.viewId
    });
  }

  const tagFilters = (props.tagFilters = customTagFilters.concat(implicitTagFilters));

  return { ...props, tagFilters: tagFilters, location: location };
}
