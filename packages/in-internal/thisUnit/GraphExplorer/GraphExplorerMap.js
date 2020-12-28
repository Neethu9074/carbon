import classNames from 'classnames';
import React from 'react';

import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { Row, Col } from 'in-new-components/layout/Grid';
import { getSnapshot } from 'in-stores/snapshot';
import { getSingular } from 'in-sdk/pluginName';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from './GraphExplorer.mless';

export default function GraphExplorer({ connected, onClick }) {
  return (
    <div className={locals.map}>
      <Row>
        <Col xs={4}>
          <ul className={locals.incomingList}>
            {connected.incoming.map(incoming => (
              <li className={locals.listItem} key={incoming.id}>
                <Entry isIn {...incoming} onClick={onClick} />
              </li>
            ))}
          </ul>
        </Col>
        <Col xs={4}>
          <div className={locals.flexWrapper}>
            <Entry id={connected.selectedSnapshotId} />
          </div>
        </Col>
        <Col xs={4}>
          <ul className={locals.outgoingList}>
            {connected.outgoing.map(outgoing => (
              <li className={locals.listItem} key={outgoing.id}>
                <Entry isOut {...outgoing} onClick={onClick} />
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </div>
  );
}

const Entry = connectTo(
  props => ({ snapshot: getSnapshot(props.id) }),
  function Entry({ id, isIn, isOut, relation, snapshot, onClick }) {
    return (
      <Tooltip themeStyle="light" content={snapshot && getSingular(snapshot.get('plugin'))} align="bottomMiddle">
        <div
          className={classNames({
            [locals.entry]: true,
            [locals.outEntry]: isOut
          })}
          onClick={() => onClick(id)}
        >
          <EntityLink snapshot={snapshot} label={snapshot ? getLabel(snapshot) : id} />
          {relation && <span className={locals.relation}>{relation.substr(0, 2)}</span>}

          {isIn && <SvgIcon className={locals.inIcon} type="lib_arrow_right" size="s" />}
          {isOut && <SvgIcon className={locals.outIcon} type="lib_arrow_right" size="s" />}
        </div>
      </Tooltip>
    );
  }
);
