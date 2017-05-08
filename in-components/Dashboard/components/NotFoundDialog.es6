import React from 'react';

import { getCurrentViewWithTimelineCenteredAt } from 'in-stores/navigation/timeline';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { formatDateTime } from 'in-services/formatters/date';
import { focusedMoment$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import 'in-components/Dashboard/components/NotFoundDialog.less';

const block = 'in-dashboard-not-found-dialog';

export default function NotFoundDialog({ versionsForFocusedMoment, versionsForLive }) {
  if (!versionsForFocusedMoment && !versionsForLive) {
    return <LoadingIndicator type="dark" />;
  }

  const list = mergeVersionLists(versionsForFocusedMoment, versionsForLive).reverse();

  return (
    <div className={block}>
      <h1>
        Dashboard: entity not found
      </h1>

      <p>
        We could not find a version of the entity for the position of the time picker. Below you will find a{' '}
        selection of known versions of this entity. Click on one of the versions below to set the timeline and time{' '}
        picker so that the entity can be inspected.
      </p>

      <VersionList title="Available entity versions" versions={list} />
    </div>
  );
}

function mergeVersionLists(listA, listB) {
  const result = [];
  const alreadyAdded = {};

  if (listA) {
    listA.forEach(add);
  }
  if (listB) {
    listB.forEach(add);
  }

  return result;

  function add(version) {
    const from = version.get('from');
    const to = version.get('to');
    const id = `${from}:${to}`;

    if (!alreadyAdded[id]) {
      alreadyAdded[id] = true;
      result.push({ from, to });
    }
  }
}

const VersionList = connectTo(
  {
    focusedMoment: focusedMoment$
  },
  function VersionList({ title, versions, focusedMoment }) {
    return (
      <div className={`${block}__list-wrapper`}>
        <p className={`${block}__header`}>
          {title}
        </p>

        <ul className={`${block}__list`}>
          {versions.map((version, i) => {
            const from = version.from;
            const to = version.to;
            const prev = versions[i - 1];
            if (focusedMoment > from && (!prev || focusedMoment < prev.from)) {
              return [
                <li className={`${block}__focused-moment`}>
                  <span className={`${block}__key`}>
                    selected moment:
                  </span>
                  <span className={`${block}__value`}>
                    {formatDateTime(focusedMoment)}
                  </span>
                </li>,
                <ListItem key={`${from},${to}`} from={from} to={to} />
              ];
            }
            return <ListItem key={`${from},${to}`} from={from} to={to} />;
          })}
        </ul>
      </div>
    );
  }
);

const ListItem = connectTo(
  props => {
    let time = null;
    let windowSize = 1000 * 60 * 10;
    if (props.to != null) {
      windowSize = props.to - props.from;
      time = props.to - windowSize / 2;
    }
    return {
      link: getCurrentViewWithTimelineCenteredAt(time, windowSize)
    };
  },
  function ListItem({ from, to, link }) {
    return (
      <li className={`${block}__list-item`}>
        <a href={link} className={`${block}__set-time`}>
          <span className={`${block}__key`}>
            from:
          </span>
          <span className={`${block}__value`}>
            {formatDateTime(from)}
          </span>
          <span className={`${block}__key`}>
            to:
          </span>
          <span className={`${block}__value`}>
            {to ? formatDateTime(to) : 'now'}
          </span>
        </a>
      </li>
    );
  }
);
