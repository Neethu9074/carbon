/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha, node */

import proxyquire from 'proxyquire';
import { expect } from 'chai';

const onUsesQB1 = () => 'QB1';
const onUsesQB2 = () => 'QB2';

var inQB1Mode = proxyquire('in-new-components/Alerting/components/WithQB1orQB2', {
  'in-services/featureFlags': {
    isQB2ModeInSmartAlertsEnabled: false
  }
});

var inQB2Mode = proxyquire('in-new-components/Alerting/components/WithQB1orQB2', {
  'in-services/featureFlags': {
    isQB2ModeInSmartAlertsEnabled: true
  }
});

describe('test switchQB1orQB2Helper', () => {
  it('should return QB1 component', () => {
    const queryBuilderType = inQB1Mode.switchQB1orQB2Helper(onUsesQB1, onUsesQB2);
    expect(queryBuilderType).to.equal('QB1');
  });

  it('should return QB2 component', () => {
    const queryBuilderType = inQB2Mode.switchQB1orQB2Helper(onUsesQB1, onUsesQB2);
    expect(queryBuilderType).to.equal('QB2');
  });
});

describe('test switchQB1orQB2Helper - fallback handling', () => {
  it('In QB1 mode it should return QB2 component for QB2 mode config', () => {
    const convertedTagFilterExpression = false;
    const queryBuilderType = inQB1Mode.switchQB1orQB2Helper(onUsesQB1, onUsesQB2, isQB2Config =>
      isQB2Config(convertedTagFilterExpression)
    );
    expect(queryBuilderType).to.equal('QB2');
  });
});
