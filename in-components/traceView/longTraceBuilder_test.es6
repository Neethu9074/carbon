/* eslint-env mocha */

import {expect} from 'chai';

import sampleData from 'in-components/traceView/longTraceBuilderSampleData.json';
import {transform} from 'in-components/traceView/longTraceBuilder';

describe('in-components/traceView/longStackTraceBuilder', () => {
  let traceInput;

  beforeEach(() => {
    traceInput = JSON.parse(JSON.stringify(sampleData));
  });

  it('must correctly read sample data', () => {
    expect(traceInput.traceId).to.equal('2097887366255533505');
  });

  it('must retain the root element', () => {
    expect(transform(traceInput).spanId).equal('2097887366255533505');
    expect(transform(traceInput).type).equal('span');
  });

  it('must add stack trace elements into tree', () => {
    const root = transform(traceInput);
    const firstLevel = root.children[0];
    expect(firstLevel.type).to.equal('stackTraceElement');
    expect(firstLevel.stackTraceElementId).to.equal('org.apache.catalina.core.ApplicationFilterChain#doFilter:207');
    expect(firstLevel.stackTrace).to.deep.equal({
      'c': 'org.apache.catalina.core.ApplicationFilterChain',
      'm': 'doFilter',
      'n': 207
    });

    const secondLevel = firstLevel.children[0];
    expect(secondLevel.type).to.equal('stackTraceElement');
    expect(secondLevel.stackTraceElementId).to.equal('sun.reflect.GeneratedMethodAccessor62#invoke');
    expect(secondLevel.stackTrace).to.deep.equal({
      'c': 'sun.reflect.GeneratedMethodAccessor62',
      'm': 'invoke'
    });

    const thirdLevel1 = secondLevel.children[0];
    expect(thirdLevel1.type).to.equal('stackTraceElement');
    expect(thirdLevel1.stackTraceElementId).to.equal('com.instanademo.LogisticsController#shop:78');
    expect(thirdLevel1.stackTrace).to.deep.equal({
      'c': 'com.instanademo.LogisticsController',
      'm': 'shop',
      'n': 78
    });

    const thirdLevel2 = secondLevel.children[1];
    expect(thirdLevel2.type).to.equal('stackTraceElement');
    expect(thirdLevel2.stackTraceElementId).to.equal('com.instanademo.LogisticsController#shop:83');
    expect(thirdLevel2.stackTrace).to.deep.equal({
      'c': 'com.instanademo.LogisticsController',
      'm': 'shop',
      'n': 83
    });
  });
});
