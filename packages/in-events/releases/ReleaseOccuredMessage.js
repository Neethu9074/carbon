import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import { removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { setTimeConfig, urlQueryKeys } from 'in-stores/time/config';
import { compose, setPropTypes, pure } from 'recompose';
import Button from 'in-new-components/Button/Button';
import { interval } from 'reactive-observables';
import connectTo from 'in-hoc/connectTo';

import locals from './ReleaseOccuredMessage.mless';

export default compose(
  setPropTypes({
    release: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      start: PropTypes.number.isRequired
    }).isRequired
  }),
  connectTo({
    windowSize: navigationParameters$
      .map(location => get(location, ['query', urlQueryKeys.windowSize], null))
      .distinct()
  })
)(ReleaseOccurredMessage);

function ReleaseOccurredMessage({ release, windowSize }) {
  return (
    <div className={locals.container}>
      <h1 className={locals.title}>A release has occurred recently</h1>
      <div className={locals.content}>
        <p>Release: {release.name}</p>
        <p>
          {formatDateTime(release.start)} (<MinutesCount start={release.start} /> ago)
        </p>
      </div>
      <nav className={locals.controls}>
        <Button
          className={locals.btnLeft}
          href$={getModifiedUrlStream(params => {
            const to = release.start + windowSize / 2;
            setTimeConfig(params, { to, windowSize });
          })}
          kind="action"
          onClick={() => removeMessage(release.id)}
        >
          Go to release
        </Button>
        <Button
          href$={getModifiedUrlStream(params => {
            setTimeConfig(params, { autoRefresh: true });
          })}
          kind="action"
          onClick={() => removeMessage(release.id)}
        >
          Follow releases live
        </Button>
      </nav>
    </div>
  );
}

const MinutesCount = connectTo(({ start }) => ({
  rangeInMinutes: interval(1000).map(() => fromNowAccurately(start))
}))(
  pure(function MinutesCount({ rangeInMinutes }) {
    return <Fragment>{rangeInMinutes}</Fragment>;
  })
);
