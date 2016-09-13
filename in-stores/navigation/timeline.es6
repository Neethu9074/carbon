import {navigationParameters$, cloneDeep, toUrl} from 'in-stores/navigation/navigation';

export function getCurrentViewWithTimelineCenteredAt(moment, windowSize = 1000 * 60 * 10) {
  const to = moment + windowSize / 2;
  windowSize = String(windowSize);
  moment = String(moment);
  return navigationParameters$
    .map(cloneDeep)
    .map(params => {
      params.query['timeline.to'] = to;
      params.query['timeline.fm'] = moment;
      params.query['timeline.ws'] = windowSize;
      return params;
    })
    .map(toUrl)
    .distinct();
}
