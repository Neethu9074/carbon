/* eslint-env mocha */
import { create } from 'reactive-observables';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

describe('in-stores/eventsInTimeframe', () => {
  let timeConfig$;
  let query$;
  let mod;
  let eventsInTimeframeFromBackend$;

  let dataSubscription;
  let dataCallback;
  let eventsSubscription;
  let eventsCallback;

  beforeEach(() => {
    eventsInTimeframeFromBackend$ = create();
    timeConfig$ = create();
    query$ = create();
    mod = proxyquire('in-stores/eventsInTimeframe/eventsInTimeframe', {
      'in-subscription/eventsInTimeframe': {
        default: () => eventsInTimeframeFromBackend$
      },
      'in-stores/time/config': {
        timeConfig$
      },
      'in-stores/search/query': {
        query$
      },
      'in-stores/events': {
        getEvent: () => create()
      }
    });

    mod.init(true);

    dataCallback = sinon.stub();
    dataSubscription = mod.data$.subscribe(dataCallback);

    eventsCallback = sinon.stub();
    eventsSubscription = mod.eventsInTimeframe$.subscribe(eventsCallback);
  });

  afterEach(() => {
    dataSubscription.dispose();
    eventsSubscription.dispose();
  });

  it('should send empty data on initial state', () => {
    expect(dataCallback).to.have.callCount(1);
    expect(dataCallback.getCall(0).args[0]).to.deep.equal({});

    expect(eventsCallback).to.have.callCount(1);
    expect(eventsCallback.getCall(0).args[0].issues).to.have.length(0);
    expect(eventsCallback.getCall(0).args[0].changes).to.have.length(0);
    expect(eventsCallback.getCall(0).args[0].incidents).to.have.length(0);
  });

  it('should add all events on first fire', () => {
    eventsInTimeframeFromBackend$.emit([
      { id: '1', type: 'issue' },
      { id: '2', type: 'incident' },
      { id: '3', type: 'change' }
    ]);
    timeConfig$.emit(true);
    query$.emit(true);

    expect(dataCallback).to.have.callCount(2);
    expect(dataCallback.getCall(1).args[0].get('1').rawEvent.type).to.equal('issue');
    expect(dataCallback.getCall(1).args[0].get('2').rawEvent.type).to.equal('incident');
    expect(dataCallback.getCall(1).args[0].get('3').rawEvent.type).to.equal('change');
  });

  it('should remove events that were not send anymore', () => {
    eventsInTimeframeFromBackend$.emit([
      { id: '1', type: 'issue' },
      { id: '2', type: 'incident' },
      { id: '3', type: 'change' }
    ]);
    timeConfig$.emit(true);
    query$.emit(true);

    eventsInTimeframeFromBackend$.emit([{ id: '2', type: 'incident' }]);

    expect(dataCallback).to.have.callCount(3);
    expect(dataCallback.getCall(1).args[0].get('1')).to.equal(undefined);
    expect(dataCallback.getCall(1).args[0].get('2').rawEvent.type).to.equal('incident');
    expect(dataCallback.getCall(1).args[0].get('3')).to.equal(undefined);
  });

  it('should remove events that were not send anymore and add new ones', () => {
    eventsInTimeframeFromBackend$.emit([
      { id: '1', type: 'issue' },
      { id: '2', type: 'incident' },
      { id: '3', type: 'change' }
    ]);
    timeConfig$.emit(true);
    query$.emit(true);
    eventsInTimeframeFromBackend$.emit([{ id: '2', type: 'incident' }, { id: '5', type: 'incident' }]);

    expect(dataCallback).to.have.callCount(3);
    expect(dataCallback.getCall(1).args[0].get('1')).to.equal(undefined);
    expect(dataCallback.getCall(1).args[0].get('2').rawEvent.type).to.equal('incident');
    expect(dataCallback.getCall(1).args[0].get('3')).to.equal(undefined);
    expect(dataCallback.getCall(1).args[0].get('5').rawEvent.type).to.equal('incident');
  });

  it('should change events which changed', () => {
    eventsInTimeframeFromBackend$.emit([
      { id: '1', type: 'issue' },
      { id: '2', type: 'incident' },
      { id: '3', type: 'change' }
    ]);
    timeConfig$.emit(true);
    query$.emit(true);

    expect(dataCallback.getCall(0).args[0].get('1').rawEvent.type).to.equal('issue');
    expect(dataCallback.getCall(0).args[0].get('2').rawEvent.type).to.equal('incident');
    expect(dataCallback.getCall(0).args[0].get('3').rawEvent.type).to.equal('change');

    eventsInTimeframeFromBackend$.emit([{ id: '1', type: 'incident' }, { id: '2', type: 'change' }]);

    expect(dataCallback).to.have.callCount(3);
    expect(dataCallback.getCall(1).args[0].get('1').rawEvent.type).to.equal('incident');
    expect(dataCallback.getCall(1).args[0].get('2').rawEvent.type).to.equal('change');
  });
});
