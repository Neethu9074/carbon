import Favico from 'favico.js';

import { openEventsAtServerTime$ } from 'in-stores/events';
import { theme } from 'in-services/theme';

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
          color: maxSeverity > 0 ? theme.health[maxSeverity] : theme.health[theme.health.length - 1],
          textColor: maxSeverity > 6 ? '#ffffff' : '#000000'
        };
      }

      return noIncidents;
    })
    .distinct(
      (prev, next) => prev.color !== next.color || prev.count !== next.count || prev.textColor !== next.textColor
    )
    .subscribe(config => {
      favicon.badge(config.count, {
        bgColor: config.color,
        textColor: config.textColor
      });
    });
}
