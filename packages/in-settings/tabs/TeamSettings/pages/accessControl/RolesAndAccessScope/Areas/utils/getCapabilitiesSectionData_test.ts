/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  mockEmptyPermissionsSet,
  mockPermissionsSetWithData,
  mockPermissionsSetWithLimitedAccessEmptyData
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/testData';
import { getCapabilitiesSectionData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getCapabilitiesSectionData';
import { ProductArea } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { t } from 'in-i18n';

jest.mock('in-i18n', () => ({ t: jest.fn() }));

describe('in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/hooks/getCapabilitiesSectionData', () => {
  describe('returns correct data and calls the translation function with correct params for analytics product area', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns correct data and calls the translation function with correct params with an empty permissions set', () => {
      // Given
      const { shouldRenderContent, isDisabled } = getCapabilitiesSectionData({
        area: ProductArea.ANALYTICS,
        permissionsSet: mockEmptyPermissionsSet
      });

      // Then
      expect(shouldRenderContent).toBe(false);
      expect(isDisabled).toBe(false);
      expect(t).toHaveBeenCalledWith('in-settings:productAreas.countOfPermissions', {
        numberOfcapabilitiesUserHas: 0,
        totalNumberOfAreaCapabilities: 1
      });
    });

    it('returns correct data and calls the translation function with correct params with a limited permissions with no access', () => {
      // Given
      const { shouldRenderContent, isDisabled } = getCapabilitiesSectionData({
        area: ProductArea.ANALYTICS,
        permissionsSet: mockPermissionsSetWithLimitedAccessEmptyData
      });

      // Then
      expect(shouldRenderContent).toBe(true);
      expect(isDisabled).toBe(true);
      expect(t).toHaveBeenCalledWith('in-settings:productAreas.no_access');
    });

    it('returns correct data and calls the translation function with correct params with a non-empty permissions set', () => {
      // Given
      const { shouldRenderContent, isDisabled } = getCapabilitiesSectionData({
        area: ProductArea.ANALYTICS,
        permissionsSet: mockPermissionsSetWithData
      });

      // Then
      expect(shouldRenderContent).toBe(true);
      expect(isDisabled).toBe(false);
      expect(t).toHaveBeenCalledWith('in-settings:productAreas.countOfPermissions', {
        numberOfcapabilitiesUserHas: 1,
        totalNumberOfAreaCapabilities: 1
      });
    });
  });

  describe('returns correct data and calls the translation function with correct params for events and alerts area', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns correct data and calls the translation function with correct params with a limited permissions set with no access', () => {
      // Given
      const { shouldRenderContent, isDisabled } = getCapabilitiesSectionData({
        area: ProductArea.EVENT,
        permissionsSet: mockPermissionsSetWithLimitedAccessEmptyData
      });

      // Then
      expect(shouldRenderContent).toBe(false);
      expect(isDisabled).toBe(true);
      expect(t).toHaveBeenCalledWith('in-settings:productAreas.no_access');
    });
  });

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
        totalNumberOfAreaCapabilities: 25
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
        numberOfcapabilitiesUserHas: 11,
        totalNumberOfAreaCapabilities: 25
      });
    });
  });

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
        totalNumberOfAreaCapabilities: 25
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
        numberOfcapabilitiesUserHas: 11,
        totalNumberOfAreaCapabilities: 25
      });
    });
  });
});
