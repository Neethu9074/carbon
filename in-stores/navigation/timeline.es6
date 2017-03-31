import { getModifiedUrlStream } from 'in-stores/navigation/navigation';

export function getCurrentViewWithTimelineCenteredAt(moment, windowSize = 1000 * 60 * 10) {
  const to = moment == null ? '' : moment + windowSize / 2;
  windowSize = String(windowSize);
  moment = moment == null ? '' : String(moment);
  return getModifiedUrlStream(params => {
    params.query['timeline.to'] = to;
    params.query['timeline.fm'] = moment;
    params.query['timeline.ws'] = windowSize;
  });
}
