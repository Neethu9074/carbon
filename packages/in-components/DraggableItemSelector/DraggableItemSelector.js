/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useState } from 'react';
import classNames from 'classnames';
import rpt from 'prop-types';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';

import SlideInView, { ListHeader } from 'in-components/SlideInView/SlideInView';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './DraggableItemSelector.mless';

export default function DraggableItemSelector(props) {
  const { items, Content, disabled, onSwap, onRemove, SlideInContent, slideInContentTitle } = props;
  const [showSlideInContent, onShowSlideInContentChange] = useState(false);

  return (
    <SlideInView
      staticContent={
        <form
          className={classNames({
            [locals.overlay]: true,
            [locals.fullHeight]: showSlideInContent
          })}
        >
          <DragDropContext
            onDragEnd={e => {
              if (e.destination && onSwap) {
                onSwap(e.source.index, e.destination.index);
              }
            }}
          >
            <Droppable droppableId="tag-selection">
              {provided => (
                <div ref={provided.innerRef}>
                  {items.map((item, i) => (
                    <Draggable key={i} draggableId={String(i)} index={i}>
                      {provided => (
                        <div className={locals.item} ref={provided.innerRef} {...provided.draggableProps}>
                          {onSwap ? (
                            <Tooltip content={t('in-components:draggableItemSelector.tooltipReorderMetrics')}>
                              <div className={locals.dragHandle} {...provided.dragHandleProps}>
                                <SvgIcon type="lib_menu" size="xs" />
                              </div>
                            </Tooltip>
                          ) : (
                            <div className={locals.dragHandle} {...provided.dragHandleProps} />
                          )}

                          <Content item={item} {...props} i={i} />

                          <SvgIcon
                            className={locals.removeButton}
                            type="lib_actions_delete"
                            onClick={() => onRemove(item, i)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className={locals.addButtonWrapper}>
            <Button
              kind="action"
              icon="lib_openclose_add_circle_outline"
              onClick={() => onShowSlideInContentChange(!showSlideInContent)}
              disabled={disabled}
            >
              {slideInContentTitle}
            </Button>
          </div>
        </form>
      }
      HeaderComponent={ListHeader}
      slideTransitionDurationMillis={250}
      onAfterSlideOut={() => {}}
      slideInContent={<SlideInContent {...props} onShowSlideInContentChange={onShowSlideInContentChange} />}
      slideInContentTitle={slideInContentTitle}
      showSlideInContent={showSlideInContent}
      onShowSlideInContentChange={onShowSlideInContentChange}
    />
  );
}

DraggableItemSelector.propTypes = {
  SlideInContent: rpt.elementType.isRequired,
  slideInContentTitle: rpt.string.isRequired,
  Content: rpt.elementType.isRequired,
  onRemove: rpt.func.isRequired,
  items: rpt.array.isRequired,
  onSwap: rpt.func,
  disabled: rpt.bool
};
