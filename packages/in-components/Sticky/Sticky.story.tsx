/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Sticky from 'in-components/Sticky';

const headerLevel1 = <div style={{ height: `60px`, background: '#AA3939' }}>Header Level 1</div>;

const headerLevel2 = <div style={{ height: `60px`, background: '#AA6C39' }}>Header Level 2</div>;

export default {
  title: 'Sticky'
};

export function SingleHeader() {
  return <Sticky header={headerLevel1}>{dummyContent}</Sticky>;
}

export function DoubleHeader() {
  return (
    <Sticky header={headerLevel1}>
      <Sticky header={headerLevel2}>{dummyContent}</Sticky>
    </Sticky>
  );
}

export function DoubleHeaderIndention() {
  return (
    <Sticky header={headerLevel1}>
      <div style={{ marginLeft: '120px' }}>
        <Sticky header={headerLevel2}>{dummyContent}</Sticky>
      </div>
    </Sticky>
  );
}

const dummyContent = (
  <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo dolorem delectus ducimus! Officia beatae pariatur,
      quia dicta, corporis iste nihil accusamus saepe repellat dolores consequatur sit eum maxime voluptas sequi.
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo dolorem delectus ducimus! Officia beatae pariatur,
      quia dicta, corporis iste nihil accusamus saepe repellat dolores consequatur sit eum maxime voluptas sequi.
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo dolorem delectus ducimus! Officia beatae pariatur,
      quia dicta, corporis iste nihil accusamus saepe repellat dolores consequatur sit eum maxime voluptas sequi.
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo dolorem delectus ducimus! Officia beatae pariatur,
      quia dicta, corporis iste nihil accusamus saepe repellat dolores consequatur sit eum maxime voluptas sequi.
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo dolorem delectus ducimus! Officia beatae pariatur,
      quia dicta, corporis iste nihil accusamus saepe repellat dolores consequatur sit eum maxime voluptas sequi.
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo dolorem delectus ducimus! Officia beatae pariatur,
      quia dicta, corporis iste nihil accusamus saepe repellat dolores consequatur sit eum maxime voluptas sequi.
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo dolorem delectus ducimus! Officia beatae pariatur,
      quia dicta, corporis iste nihil accusamus saepe repellat dolores consequatur sit eum maxime voluptas sequi.
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo dolorem delectus ducimus! Officia beatae pariatur,
      quia dicta, corporis iste nihil accusamus saepe repellat dolores consequatur sit eum maxime voluptas sequi.
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo dolorem delectus ducimus! Officia beatae pariatur,
      quia dicta, corporis iste nihil accusamus saepe repellat dolores consequatur sit eum maxime voluptas sequi.
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo dolorem delectus ducimus! Officia beatae pariatur,
      quia dicta, corporis iste nihil accusamus saepe repellat dolores consequatur sit eum maxime voluptas sequi.
    </p>
  </div>
);
