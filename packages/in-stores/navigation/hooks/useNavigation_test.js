/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { renderHook } from '@testing-library/react-hooks';
import { useHistory } from 'react-router';

import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addReset } from 'in-stores/navigation/urlParameterResets';

jest.mock('in-stores/navigation/LocationStateProvider');
jest.mock('react-router');

describe('in-stores/navigation/hooks/useNavigation', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  useHistory.mockReturnValue({ push: mockPush, replace: mockReplace });

  addReset((_prev, next) => {
    if (next?.matrix?.['/resetTestPath']) {
      delete next.matrix['/resetTestPath'];
    }
  });

  beforeEach(() => {
    mockPush.mockClear();
    mockReplace.mockClear();
  });

  describe('returned location', () => {
    it('can be safely manipulated', () => {
      // Given
      const location = {
        matrix: { '/somepath': { foo: 'bar' } },
        pathname: '/somepath',
        query: {}
      };
      useLocation.mockReturnValueOnce(location);

      // When
      const { result } = renderHook(useNavigation);
      const currentLocation = result.current.location;
      currentLocation.matrix['/somepath'].foo = 'baz';
      currentLocation.pathname = '/anotherpath';

      // Then
      expect(location.matrix['/somepath'].foo).not.toEqual('baz');
      expect(location.pathname).not.toEqual('/anotherpath');
    });
  });

  describe('returned navigate function', () => {
    it('applies resets to target location', () => {
      // Given
      const currentLocation = {
        matrix: { '/resetTestPath': { foo: 'bar' } },
        pathname: '/resetTestPath',
        query: {}
      };
      const targetLocation = {
        matrix: { '/resetTestPath': { foo: 'bar' } },
        pathname: '/resetTestPath/someSubPath',
        query: {}
      };
      useLocation.mockReturnValueOnce(currentLocation);

      // When
      const { result } = renderHook(useNavigation);
      const { navigate } = result.current;
      navigate(targetLocation);

      // Then
      expect(mockPush).toHaveBeenCalledWith('/resetTestPath/someSubPath');
    });

    it('retains missing parts of potentialy partial target location', () => {
      // Given
      const currentLocation = {
        matrix: { '/somepath': { foo: 'bar' } },
        pathname: '/somepath',
        query: {}
      };
      const targetLocation = {
        pathname: '/somepath/someSubPath'
      };
      useLocation.mockReturnValueOnce(currentLocation);

      // When
      const { result } = renderHook(useNavigation);
      const { navigate } = result.current;
      navigate(targetLocation);

      // Then
      expect(mockPush).toHaveBeenCalledWith('/somepath;foo=bar/someSubPath');
    });

    it('does not trigger a navigation if current and target location are the same', () => {
      // Given
      const currentLocation = {
        pathname: '/somepath',
        matrix: {},
        query: {}
      };
      const targetLocation = {
        pathname: '/somepath',
        matrix: {},
        query: {}
      };
      useLocation.mockReturnValueOnce(currentLocation);

      // When
      const { result } = renderHook(useNavigation);
      const { navigate } = result.current;
      navigate(targetLocation);

      // Then
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('replaces the history stack if replace is true', () => {
      // Given
      const currentLocation = {
        pathname: '/somepath',
        matrix: {},
        query: {}
      };
      const targetLocation = {
        pathname: '/anotherpath',
        matrix: {},
        query: {}
      };
      useLocation.mockReturnValueOnce(currentLocation);

      // When
      const { result } = renderHook(useNavigation);
      const { navigate } = result.current;
      navigate(targetLocation, true);

      // Then
      expect(mockReplace).toHaveBeenCalledWith('/anotherpath');
      expect(mockPush).not.toHaveBeenCalled();
    });

    it.each([undefined, false])('pushes to the history stack if replace is %s', replace => {
      // Given
      const currentLocation = {
        pathname: '/somepath',
        matrix: {},
        query: {}
      };
      const targetLocation = {
        pathname: '/anotherpath',
        matrix: {},
        query: {}
      };
      useLocation.mockReturnValueOnce(currentLocation);

      // When
      const { result } = renderHook(useNavigation);
      const { navigate } = result.current;
      navigate(targetLocation, replace);

      // Then
      expect(mockReplace).not.toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/anotherpath');
    });
  });

  describe('returned createHref function', () => {
    it('applies resets to target location', () => {
      // Given
      const currentLocation = {
        matrix: { '/resetTestPath': { foo: 'bar' } },
        pathname: '/resetTestPath',
        query: {}
      };
      const targetLocation = {
        matrix: { '/resetTestPath': { foo: 'bar' } },
        pathname: '/resetTestPath/someSubPath',
        query: {}
      };
      useLocation.mockReturnValueOnce(currentLocation);

      // When
      const { result } = renderHook(useNavigation);
      const { createHref } = result.current;
      const href = createHref(targetLocation);

      // Then
      expect(href).not.toContain('foo');
      expect(href).not.toContain('bar');
    });

    it('replaces parameters on pathname correctly', () => {
      // Given
      const params = { bar: 'heureka' };
      const currentLocation = {
        matrix: {},
        pathname: '/foo',
        query: {}
      };
      const targetLocation = {
        matrix: {},
        pathname: '/foo/:bar',
        query: {}
      };
      useLocation.mockReturnValueOnce(currentLocation);

      // When
      const { result } = renderHook(useNavigation);
      const { createHref } = result.current;
      const href = createHref(targetLocation, params);

      // Then
      expect(href).toEqual('/#/foo/heureka');
    });
  });

  describe('returned goToPath function', () => {
    it('applies resets to target location', () => {
      // Given
      const currentLocation = {
        matrix: { '/resetTestPath': { foo: 'bar' } },
        pathname: '/resetTestPath',
        query: {}
      };
      useLocation.mockReturnValueOnce(currentLocation);

      // When
      const { result } = renderHook(useNavigation);
      const { goToPath } = result.current;
      goToPath('/resetTestPath/someSubPath');

      // Then
      expect(mockPush).toHaveBeenCalledWith('/resetTestPath/someSubPath');
    });

    it('does not trigger a navigation if current and target location are the same', () => {
      // Given
      const currentLocation = {
        pathname: '/somepath',
        matrix: {},
        query: {}
      };
      useLocation.mockReturnValueOnce(currentLocation);

      // When
      const { result } = renderHook(useNavigation);
      const { goToPath } = result.current;
      goToPath('/somepath');

      // Then
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('returned createHrefToPath function', () => {
    it('applies resets to target location', () => {
      // Given
      const currentLocation = {
        matrix: { '/resetTestPath': { foo: 'bar' } },
        pathname: '/resetTestPath',
        query: {}
      };
      useLocation.mockReturnValueOnce(currentLocation);

      // When
      const { result } = renderHook(useNavigation);
      const { createHrefToPath } = result.current;
      const actual = createHrefToPath('/resetTestPath/someSubPath');

      // Then
      expect(actual).toEqual('/#/resetTestPath/someSubPath');
    });

    it('removes DFQ if area is changed', () => {
      // Given
      const currentLocation = {
        pathname: '/physical',
        query: {
          q: 'someDummyDFQ'
        }
      };
      useLocation.mockReturnValueOnce(currentLocation);

      // When
      const { result } = renderHook(useNavigation);
      const { createHrefToPath } = result.current;
      const actual = createHrefToPath('/someNonInfraPath');

      // Then
      expect(actual).not.toContain('someDummyDFQ');
    });

    it('replaces parameters on pathname correctly', () => {
      // Given
      const params = { bar: 'heureka' };
      const path = '/foo/:bar';
      const currentLocation = {
        matrix: {},
        pathname: '/foo',
        query: {}
      };
      useLocation.mockReturnValueOnce(currentLocation);

      // When
      const { result } = renderHook(useNavigation);
      const { createHrefToPath } = result.current;
      const href = createHrefToPath(path, params);

      // Then
      expect(href).toEqual('/#/foo/heureka');
    });
  });
});
