/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { all } from 'in-hooks/utils/progress';

describe('in-hooks/utils/progress', () => {
  describe('if all progress are loading', () => {
    it('should return a progress that is loading with percentages', () => {
      // Given
      const progressA = { loading: true, percentage: 0 };
      const progressB = { loading: true, percentage: 0 };
      const progressC = { loading: true, percentage: 0 };

      // When
      const progress = all(progressA, progressB, progressC);

      // Then
      expect(progress.loading).toBeTruthy();
      expect(progress).toHaveProperty('percentage');
    });
    it('should return a progress that is loading without percentage (one percentage given)', () => {
      // Given
      const progressA = { loading: true };
      const progressB = { loading: true };
      const progressC = { loading: true, percentage: 0.8 };

      // When
      const progress = all(progressA, progressB, progressC);

      // Then
      expect(progress.loading).toBeTruthy();
      expect(progress).not.toHaveProperty('percentage');
    });
    it('should return a progress that is loading without percentage (no percentage given)', () => {
      // Given
      const progressA = { loading: true };
      const progressB = { loading: true };
      const progressC = { loading: true };

      // When
      const progress = all(progressA, progressB, progressC);

      // Then
      expect(progress.loading).toBeTruthy();
      expect(progress).not.toHaveProperty('percentage');
    });
    it('should return the correct average of all progress percentages', () => {
      // Given
      const progressA = { loading: true, percentage: 0.2 };
      const progressB = { loading: true, percentage: 0.4 };
      const progressC = { loading: true, percentage: 0.6 };

      const progressD = { loading: true, percentage: 0 };
      const progressE = { loading: true, percentage: 0 };
      const progressF = { loading: true, percentage: 0 };

      // When
      const progressABC = all(progressA, progressB, progressC);
      const progressDEF = all(progressD, progressE, progressF);

      // Then
      expect(progressABC.percentage).toEqual(0.4);
      expect(progressDEF.percentage).toEqual(0);
    });
  });
  describe('if all progress are not loading', () => {
    it('should return a progress that is not loading', () => {
      // Given
      const progressA = { loading: false, percentage: 0 };
      const progressB = { loading: false, percentage: 0 };
      const progressC = { loading: false, percentage: 0 };

      // When
      const progress = all(progressA, progressB, progressC);

      // Then
      expect(progress.loading).toBeFalsy();
    });
    it('should return the correct average of all progress percentages', () => {
      // Given
      const progressA = { loading: true, percentage: 1 };
      const progressB = { loading: true, percentage: 1 };
      const progressC = { loading: true, percentage: 1 };

      // When
      const progress = all(progressA, progressB, progressC);

      // Then
      expect(progress.percentage).toEqual(1);
    });
  });
  describe('if one of three progress is loading', () => {
    it('should return a progress that is loading', () => {
      // Given
      const progressA = { loading: false, percentage: 0 };
      const progressB = { loading: true, percentage: 0 };
      const progressC = { loading: false, percentage: 0 };

      // When
      const progress = all(progressA, progressB, progressC);

      // Then
      expect(progress.loading).toBeTruthy();
    });
    it('should return the correct average of all progress percentages', () => {
      // Given
      const progressA = { loading: false, percentage: 1 };
      const progressB = { loading: true, percentage: 0.1 };
      const progressC = { loading: false, percentage: 1 };

      // When
      const progress = all(progressA, progressB, progressC);

      // Then
      expect(progress.percentage).toEqual(0.7);
    });
  });
});
