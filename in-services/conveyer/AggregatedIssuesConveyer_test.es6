/* eslint-env mocha */
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';
import RoEmitter from 'roemitter';

const oneDayConfig = {analysisWindow: 'D1'};

describe('conveyer.AggregatedIssuesConveyer', () => {

  let AggregatedIssuesConveyer;
  let conveyer;
  let onNext;
  let connection;

  beforeEach(() => {
    onNext = sinon.stub();

    connection = {
      emitter: new RoEmitter(),
      send: sinon.stub(),
      subscribe: sinon.stub(),
      unsubscribe: sinon.stub(),
      __esModule: true
    };
    AggregatedIssuesConveyer = proxyquire('./AggregatedIssuesConveyer', {
      '../connection/subscriptionAwareConnection': connection
    });
  });

  it('should calculate unique id', () => {
    expect(AggregatedIssuesConveyer.getUniqueId(oneDayConfig))
      .to.equal('issueAggregation,D1');
  });

  it('should subscribe via WebSocket connection', () => {
    conveyer = new AggregatedIssuesConveyer(oneDayConfig);
    conveyer.start(onNext);

    expect(connection.subscribe).to.have.callCount(1);
    expect(connection.subscribe.getCall(0).args[0]).to.equal(conveyer.id);
    expect(connection.subscribe.getCall(0).args[1]).to.deep.equal({
      id: conveyer.id,
      event: 'subscribe',
      type: 'aggregated_issues',
      analysisWindow: oneDayConfig.analysisWindow
    });
  });

  it('should send initial data', () => {
    conveyer = new AggregatedIssuesConveyer(oneDayConfig);
    conveyer.start(onNext);

    emitData({
      id: conveyer.id,
      data: [
        {
          'entity': {
            'host': 'h1',
            'pluginId': 'p1',
            'steadyId': 's1'
          },
          'diminishedSeverity': 1,
          'severity': 5,
          'problemEndTime': 1447679602935,
          'analysisWindow': 86400000
        }
      ]
    });

    expect(onNext).to.have.callCount(1);
    const aggregates = onNext.getCall(0).args[0];
    expect(aggregates.length).to.equal(1);
    expect(aggregates[0].entity.get('id')).to.equal('p1#h1#s1');
  });

  it('should update existing aggregates', () => {
    conveyer = new AggregatedIssuesConveyer(oneDayConfig);
    conveyer.start(onNext);

    emitData({
      id: conveyer.id,
      data: [
        {
          'entity': {
            'host': 'h1',
            'pluginId': 'p1',
            'steadyId': 's1'
          },
          'diminishedSeverity': 1,
          'severity': 5,
          'problemEndTime': 1447679602935,
          'analysisWindow': 86400000
        }
      ]
    });

    emitData({
      id: conveyer.id,
      data: [
        {
          'entity': {
            'host': 'h1',
            'pluginId': 'p1',
            'steadyId': 's1'
          },
          'diminishedSeverity': 10,
          'severity': 10,
          'problemEndTime': null,
          'analysisWindow': 86400000
        }
      ]
    });

    expect(onNext).to.have.callCount(2);
    const aggregates = onNext.getCall(1).args[0];
    expect(aggregates.length).to.equal(1);
    expect(aggregates[0].entity.get('id')).to.equal('p1#h1#s1');
    expect(aggregates[0].severity).to.equal(10);
  });

  it('should remove aggregates with severity 0', () => {
    conveyer = new AggregatedIssuesConveyer(oneDayConfig);
    conveyer.start(onNext);

    emitData({
      id: conveyer.id,
      data: [
        {
          'entity': {
            'host': 'h1',
            'pluginId': 'p1',
            'steadyId': 's1'
          },
          'diminishedSeverity': 1,
          'severity': 5,
          'problemEndTime': 1447679602935,
          'analysisWindow': 86400000
        }
      ]
    });

    emitData({
      id: conveyer.id,
      data: [
        {
          'entity': {
            'host': 'h1',
            'pluginId': 'p1',
            'steadyId': 's1'
          },
          'diminishedSeverity': 0,
          'severity': 10,
          'problemEndTime': null,
          'analysisWindow': 86400000
        }
      ]
    });

    expect(onNext).to.have.callCount(2);
    const aggregates = onNext.getCall(1).args[0];
    expect(aggregates.length).to.equal(0);
  });

  it('should add new aggregates', () => {
    conveyer = new AggregatedIssuesConveyer(oneDayConfig);
    conveyer.start(onNext);

    emitData({
      id: conveyer.id,
      data: [
        {
          'entity': {
            'host': 'h1',
            'pluginId': 'p1',
            'steadyId': 's1'
          },
          'diminishedSeverity': 1,
          'severity': 5,
          'problemEndTime': 1447679602935,
          'analysisWindow': 86400000
        }
      ]
    });

    emitData({
      id: conveyer.id,
      data: [
        {
          'entity': {
            'host': 'h2',
            'pluginId': 'p2',
            'steadyId': 's2'
          },
          'diminishedSeverity': 10,
          'severity': 6,
          'problemEndTime': null,
          'analysisWindow': 86400000
        }
      ]
    });

    expect(onNext).to.have.callCount(2);
    const aggregates = onNext.getCall(1).args[0];
    expect(aggregates.length).to.equal(2);
  });

  function emitData(msg) {
    connection.emitter.emit('message', msg);
  }
});
