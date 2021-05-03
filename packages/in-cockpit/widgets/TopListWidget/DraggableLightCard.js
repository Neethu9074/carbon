/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Link, Card } from '@instana/components';
import { SvgIcon } from '@instana/components';

import locals from './DraggableLightCard.mless';

export default function DraggableLightCard(props) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card
      {...props}
      title={props.label}
      className={isHovering ? locals.cardWithStrongShadow : undefined}
      headerClassName={locals.header}
      bodyClassName={locals.content}
      rightHeaderContent={
        <>
          {props.rightHeaderContent}
          <div className={locals.dragHandleIcon} {...props.dragAndDropConfig}>
            <SvgIcon
              type="lib_actions_reorder"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            />
          </div>
        </>
      }
    >
      {props.children}

      {props.fullListViewLinkTitle && props.fullListView$ ? (
        <Link className={locals.link} href$={props.fullListView$}>
          {props.fullListViewLinkTitle}
        </Link>
      ) : (
        <div className={locals.link} />
      )}
    </Card>
  );
}
