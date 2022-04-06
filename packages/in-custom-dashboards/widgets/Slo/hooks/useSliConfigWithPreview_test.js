/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import useSliConfigWithPreview from 'in-custom-dashboards/widgets/Slo/hooks/useSliConfigWithPreview';
import useSliConfiguration from 'in-custom-dashboards/widgets/Slo/hooks/useSliConfiguration';
import { days } from 'in-services/time';

jest.mock('in-custom-dashboards/widgets/Slo/hooks/useSliConfiguration', () => ({
  __esModule: true,
  default: jest.fn(() => [])
}));

describe('in-custom-dashboards/widgets/Slo/hooks/useSliConfigWithPreview', () => {
  beforeEach(jest.clearAllMocks);

  it('returns pending and no data if useSliConfiguration returns a pending status', () => {
    const status = 'pending';
    const sliConfig = undefined;
    const errors = [];
    const progress = { loading: true };

    useSliConfiguration.mockReturnValueOnce([sliConfig, status, errors, progress]);

    const actual = useSliConfigWithPreview('someId');

    expect(actual).toEqual([undefined, 'pending', [], progress]);
  });
  it('returns rejected and errors if useSliConfiguration returns a rejected status', () => {
    const status = 'rejected';
    const sliConfig = undefined;
    const errors = [{ code: 42, message: 'the answer' }];
    const progress = { loading: false };

    useSliConfiguration.mockReturnValueOnce([sliConfig, status, errors, progress]);

    const actual = useSliConfigWithPreview('someId');

    expect(actual).toEqual([undefined, 'rejected', [{ code: 42, message: 'the answer' }], progress]);
  });
  describe('If status is resolved', () => {
    const sliConfig = {
      sliName: 'someSliName',
      initialEvaluationTimestamp: days.toMillis(10)
    };
    const progress = { loading: false };

    it('isPreview is false returns sliConfiguration unchanged', () => {
      useSliConfiguration.mockReturnValueOnce([sliConfig, 'resolved', [], progress]);

      const isPreview = false;

      const actual = useSliConfigWithPreview('someId', {}, isPreview);

      expect(actual).toEqual([
        { sliName: 'someSliName', initialEvaluationTimestamp: days.toMillis(10) },
        'resolved',
        [],
        { loading: false }
      ]);
    });
    describe('If isPreview is true', () => {
      const isPreview = true;
      it('returns sliConfiguration unchanged if initialEvaluationTimestamp is seven days before timeConfig.to ', () => {
        useSliConfiguration.mockReturnValueOnce([sliConfig, 'resolved', [], progress]);

        const to = days.toMillis(18);

        const actual = useSliConfigWithPreview('someId', { to }, isPreview);

        expect(actual).toEqual([
          { sliName: 'someSliName', initialEvaluationTimestamp: days.toMillis(10) },
          'resolved',
          [],
          { loading: false }
        ]);
      });
      it('returns sliConfiguration with overwritten initialEvaluationTimestamp if the original is less then seven days before timeConfig.to', () => {
        useSliConfiguration.mockReturnValueOnce([sliConfig, 'resolved', [], progress]);

        const to = days.toMillis(11);

        const actual = useSliConfigWithPreview('someId', { to }, isPreview);

        expect(actual).toEqual([
          { sliName: 'someSliName', initialEvaluationTimestamp: days.toMillis(4) },
          'resolved',
          [],
          { loading: false }
        ]);
      });
    });
  });
});
