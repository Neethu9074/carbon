/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import * as sinon from 'sinon';
import { expect } from 'chai';

import { just, timeout } from '@instana/observables';

import { withTimeout } from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeHiddenTagsViewParameterConversion/AnalyzeHiddenTagsViewParameterConversion';
import { pendingResult } from 'in-services/fixedObjects';
import { success } from 'in-services/util/result';
import { error } from 'in-services/util/result';

describe('AnalyzeHiddenTagsViewParameterConversion', () => {
  describe('withTimeout', () => {
    let clock;
    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('Completed before timeout', () => {
      const observable = withTimeout(just(success(true)), 100, () => error(['Timeout']));

      const handler = sinon.stub();
      observable.subscribe(handler);

      expect(handler.calledOnce).to.equal(true);
      expect(handler.getCall(0).args[0].data).to.equal(true);
      expect(handler.getCall(0).args[0].progress.loading).to.equal(false);
    });

    it('Fails due to timeout', () => {
      const observable = withTimeout(
        timeout(1000)
          .flatMap(() => success(true))
          .startWith(pendingResult),
        100,
        () => error(['Timeout'])
      );

      const handler = sinon.stub();
      observable.subscribe(handler);

      expect(handler.calledOnce).to.equal(true);
      expect(handler.getCall(0).args[0].progress.loading).to.equal(true);

      // trigger timeout
      clock.tick(200);

      expect(handler.calledTwice).to.equal(true);
      expect(handler.getCall(1).args[0].progress.loading).to.equal(false);
      expect(handler.getCall(1).args[0].errors).to.deep.equal(['Timeout']);
    });
  });
});
