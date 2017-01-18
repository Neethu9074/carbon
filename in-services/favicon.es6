import Favico from 'favico.js';

import {getColorForMostSevereEvents} from 'in-stores/events';
import {openEventsAtServerTime$} from 'in-stores/events';

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
      const numberOfIncidents = events.incidents.length;
      if (numberOfIncidents > 0) {
        return {
          count: numberOfIncidents,
          color: getColorForMostSevereEvents(events.incidents)
        };
      }

      return noIncidents;
    })
    .distinct((prev, next) => prev.color !== next.color || prev.count !== next.count)
    .subscribe(config => {
      favicon.badge(config.count, {
        bgColor: config.color,
        textColor: '#000000'
      });
    });
}
