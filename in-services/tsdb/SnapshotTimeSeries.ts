import {List} from 'immutable';
import {Timestamp, Snapshot} from './types';
import TimeSeries from './TimeSeries';

export default class SnapshotTimeSeries extends TimeSeries<List<Snapshot>> {

}
