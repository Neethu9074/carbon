import { createLogger } from 'instalog';
import Favico from 'favico.js';

import { openEventsAtServerTime$ } from 'in-stores/events';
import { getColorBySeverity } from 'in-stores/events';
import { seconds } from 'in-services/time';

const logger = createLogger('favicon');

const noIncidents = {
  count: 0,
  color: null
};

export function init() {
  const favicon = new Favico({
    animation: 'none',
    textColor: '#000000'
  });

  openEventsAtServerTime$
    .map(events => {
      const numberOfIncidents = events ? events.get('incidentCount') : 0;
      if (numberOfIncidents > 0) {
        const maxSeverity = events.get('maxIncidentSeverity');
        return {
          count: numberOfIncidents,
          color: maxSeverity > 0 ? getColorBySeverity(maxSeverity) : getColorBySeverity(0),
          textColor: maxSeverity > 6 ? '#ffffff' : '#000000'
        };
      }

      return noIncidents;
    })
    .distinct(
      (prev, next) => prev.color !== next.color || prev.count !== next.count || prev.textColor !== next.textColor
    )
    // Browsers may throttle down favicon updates. It might happen though, that we execute a whole bunch of favicon
    // updates in a very small amount of time. In these cases, favico.js will queue up the favicon change requests
    // and execute them at a later time. This queue is bounded to at most 100 items. When the queue is full, an
    // error is thrown.
    //
    // Therefore we apply two strategies:
    //
    // 1. Throttle down favicon updates.
    // 2. Protect against these synchronous exceptions
    .throttle(seconds.toMillis(5))
    .subscribe(config => {
      try {
        favicon.badge(config.count, {
          bgColor: config.color,
          textColor: config.textColor
        });
      } catch (e) {
        logger.info('Failed to set favicon', e);
      }
    });
}
