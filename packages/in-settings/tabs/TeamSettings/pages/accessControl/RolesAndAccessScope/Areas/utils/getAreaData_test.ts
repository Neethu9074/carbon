/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  mockEmptyPermissionsSet,
  mockPermissionsSetWithData,
  mockPermissionsSetWithFullAccessData
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/testData';
import { getAreaData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getAreaData';
import { ProductArea } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { t } from 'in-i18n';

jest.mock('in-i18n', () => ({ t: jest.fn() }));

describe('in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getAreaData', () => {
  describe('returns correct data and calls the translation function with correct params for websites product area', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns correct data and calls the translation function with correct params with an empty permissions set', () => {
      // Given
      const { areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent } = getAreaData({
        area: ProductArea.WEBSITE,
        permissionsSet: mockEmptyPermissionsSet
      });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual([]);
      expect(hasFullAreaAccess).toBe(false);
      expect(shouldRenderContent).toBe(false);
      expect(t).toHaveBeenCalledWith('in-settings:productAreas.permissions', {
        context: undefined,
        quantityOfAreas: 0
      });
    });

    it('returns correct data and calls the translation function with correct params with a limited permissions set', () => {
      // Given
      const { areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent } = getAreaData({
        area: ProductArea.WEBSITE,
        permissionsSet: mockPermissionsSetWithData
      });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual(['11', '12']);
      expect(hasFullAreaAccess).toBe(false);
      expect(shouldRenderContent).toBe(true);
      expect(t).toHaveBeenCalledWith('in-settings:productAreas.permissions', {
        context: 'owner',
        quantityOfAreas: 2
      });
    });

    it('returns correct data and calls the translation function with correct params with a full access permissions set', () => {
      // Given
      const { areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent } = getAreaData({
        area: ProductArea.WEBSITE,
        permissionsSet: mockPermissionsSetWithFullAccessData
      });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual(['11', '12']);
      expect(hasFullAreaAccess).toBe(true);
      expect(shouldRenderContent).toBe(true);

      // undefined is expected here since no value is returned from the translation mock
      expect(t).toHaveBeenNthCalledWith(1, 'in-settings:general.all');
      expect(t).toHaveBeenNthCalledWith(2, 'in-settings:productAreas.permissions', {
        context: 'owner',
        quantityOfAreas: undefined
      });
    });
  });

  describe('returns correct data and calls the translation function with correct params for mobile apps product area', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns correct data and calls the translation function with correct params with an empty permissions set', () => {
      // Given
      const { areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent } = getAreaData({
        area: ProductArea.MOBILE_APP,
        permissionsSet: mockEmptyPermissionsSet
      });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual([]);
      expect(hasFullAreaAccess).toBe(false);
      expect(shouldRenderContent).toBe(false);
      expect(t).toHaveBeenCalledWith('in-settings:productAreas.permissions', {
        context: undefined,
        quantityOfAreas: 0
      });
    });

    it('returns correct data and calls the translation function with correct params with a limited permissions set', () => {
      // Given
      const { areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent } = getAreaData({
        area: ProductArea.MOBILE_APP,
        permissionsSet: mockPermissionsSetWithData
      });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual(['7', '8']);
      expect(hasFullAreaAccess).toBe(false);
      expect(shouldRenderContent).toBe(true);
      expect(t).toHaveBeenCalledWith('in-settings:productAreas.permissions', {
        context: 'owner',
        quantityOfAreas: 2
      });
    });

    it('returns correct data and calls the translation function with correct params with a full access permissions set', () => {
      // Given
      const { areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent } = getAreaData({
        area: ProductArea.MOBILE_APP,
        permissionsSet: mockPermissionsSetWithFullAccessData
      });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual(['7', '8']);
      expect(hasFullAreaAccess).toBe(true);
      expect(shouldRenderContent).toBe(true);

      // undefined is expected here since no value is returned from the translation mock
      expect(t).toHaveBeenNthCalledWith(1, 'in-settings:general.all');
      expect(t).toHaveBeenNthCalledWith(2, 'in-settings:productAreas.permissions', {
        context: 'owner',
        quantityOfAreas: undefined
      });
    });
  });

  describe('returns correct data and calls the translation function with correct params for applications product area', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns correct data and calls the translation function with correct params with an empty permissions set', () => {
      // Given
      const { areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent } = getAreaData({
        area: ProductArea.APPLICATION,
        permissionsSet: mockEmptyPermissionsSet
      });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual([]);
      expect(hasFullAreaAccess).toBe(false);
      expect(shouldRenderContent).toBe(false);
      expect(t).toHaveBeenCalledWith('in-settings:productAreas.permissions', {
        context: undefined,
        quantityOfAreas: 0
      });
    });

    it('returns correct data and calls the translation function with correct params with a limited permissions set', () => {
      // Given
      const { areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent } = getAreaData({
        area: ProductArea.APPLICATION,
        permissionsSet: mockPermissionsSetWithData
      });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual(['1', '2']);
      expect(hasFullAreaAccess).toBe(false);
      expect(shouldRenderContent).toBe(true);
      expect(t).toHaveBeenCalledWith('in-settings:productAreas.permissions', {
        context: 'owner',
        quantityOfAreas: 2
      });
    });

    it('returns correct data and calls the translation function with correct params with a full access permissions set', () => {
      // Given
      const { areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent } = getAreaData({
        area: ProductArea.APPLICATION,
        permissionsSet: mockPermissionsSetWithFullAccessData
      });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual(['1', '2']);
      expect(hasFullAreaAccess).toBe(true);
      expect(shouldRenderContent).toBe(true);

      // undefined is expected here since no value is returned from the translation mock
      expect(t).toHaveBeenNthCalledWith(1, 'in-settings:general.all');
      expect(t).toHaveBeenNthCalledWith(2, 'in-settings:productAreas.permissions', {
        context: 'owner',
        quantityOfAreas: undefined
      });
    });
  });
});
