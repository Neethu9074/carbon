import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { timeframe$ } from 'in-stores/timeline';

export function getCurrentViewWithTimelineFocusedAt(moment) {
  return timeframe$.flatMap(({ to, windowSize }) => {
    if (to) {
      to = moment + windowSize / 2;
    } else {
      to = '';
    }
    moment = moment == null ? '' : String(moment);

    return getModifiedUrlStream(params => {
      params.query['timeline.to'] = to;
      params.query['timeline.fm'] = moment;
      params.query['timeline.ws'] = windowSize;
    });
  });
}
