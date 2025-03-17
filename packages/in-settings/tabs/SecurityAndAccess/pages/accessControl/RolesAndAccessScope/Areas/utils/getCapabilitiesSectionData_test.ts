/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  mockEmptyPermissionsSet,
  mockPermissionsSetWithData
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/testData';
import { getCapabilitiesSectionData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getCapabilitiesSectionData';
import { ProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { t } from 'in-i18n';

jest.mock('in-i18n', () => ({ t: jest.fn() }));

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/hooks/getCapabilitiesSectionData', () => {
  describe('returns correct data and calls the translation function with correct params for global product area', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns correct data and calls the translation function with correct params with an empty permissions set', () => {
      // Given
      const { shouldRenderContent } = getCapabilitiesSectionData({
        area: ProductArea.GLOBAL,
        permissionsSet: mockEmptyPermissionsSet
      });

      // Then
      expect(shouldRenderContent).toBe(false);
      expect(t).toHaveBeenCalledWith('in-settings:productAreas.countOfPermissions', {
        numberOfcapabilitiesUserHas: 0,
        totalNumberOfAreaCapabilities: 28
      });
    });

    it('returns correct data and calls the translation function with correct params with a non-empty permissions set', () => {
      // Given
      const { shouldRenderContent } = getCapabilitiesSectionData({
        area: ProductArea.GLOBAL,
        permissionsSet: mockPermissionsSetWithData
      });

      // Then
      expect(shouldRenderContent).toBe(true);
      expect(t).toHaveBeenCalledWith('in-settings:productAreas.countOfPermissions', {
        numberOfcapabilitiesUserHas: 15,
        totalNumberOfAreaCapabilities: 28
      });
    });
  });
});
