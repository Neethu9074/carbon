/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useState } from 'react';
import classNames from 'classnames';
import rpt from 'prop-types';
import { t } from 'in-i18n';

import SlideInView, { ListHeader } from 'in-new-components/SlideInView/SlideInView';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

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
              if (e.destination) {
                onSwap(e.source.index, e.destination.index);
              }
            }}
          >
            <Droppable droppableId="tag-selection">
              {provided => (
                <div ref={provided.innerRef}>
                  {items.map((item, i) => (
                    <Draggable key={i} draggableId={i} index={i}>
                      {provided => (
                        <div className={locals.item} ref={provided.innerRef} {...provided.draggableProps}>
                          <Tooltip content={t('in-new-components:draggableItemSelector.tooltipReorderMetrics')}>
                            <div className={locals.dragHandle} {...provided.dragHandleProps}>
                              <SvgIcon type="lib_menu" size="xs" />
                            </div>
                          </Tooltip>

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
  onSwap: rpt.func.isRequired,
  items: rpt.array.isRequired,
  disabled: rpt.bool
};
