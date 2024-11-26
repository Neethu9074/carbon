/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { pageId as matrixPageId, websiteId as matrixWebsiteId } from 'in-websites/navigation/matrix';
import { dashboardTagFilters as tagFiltersTrackers } from 'in-websites/tracking/segTracker';
import { urlStateDefinition } from 'in-websites/WebsiteDashboard/WebsiteDashboard';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useTagFilterManipulators } from 'in-websites/tagFiltersHoc';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { websitePath } from 'in-websites/navigation/paths';
import { getTimeConfig } from 'in-stores/time/config';
import useUrlState from 'in-hooks/useUrlState';

export function useWebsiteData() {
  const location = useLocation();
  const [{ tagFilters: customTagFilters }, setUrl] = useUrlState(urlStateDefinition);

  const setUrlNew = tagFilters =>
    setUrl({
      tagFilters: tagFilters.filter(f => f.name !== 'beacon.website.id' && f.name !== 'beacon.page.name')
    });

  const tagFilterManipulators = useTagFilterManipulators(tagFiltersTrackers, customTagFilters, setUrlNew);
  const props = {
    websiteId: getMatrixParameter(location, websitePath, matrixWebsiteId),
    pageId: getMatrixParameter(location, websitePath, matrixPageId),
    timeConfig: getTimeConfig(location),
    ...tagFilterManipulators
  };

  const implicitTagFilters = (props.implicitTagFilters = [
    {
      name: 'beacon.website.id',
      operator: 'EQUALS',
      stringValue: props.websiteId
    }
  ]);
  if (props.pageId) {
    implicitTagFilters.push({
      name: 'beacon.page.name',
      operator: 'EQUALS',
      stringValue: props.pageId
    });
  }

  const tagFilters = (props.tagFilters = customTagFilters.concat(implicitTagFilters));
  return { ...props, tagFilters: tagFilters, location: location };
}
