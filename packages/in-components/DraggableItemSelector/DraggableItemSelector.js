/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter, PointerSensor, useSensor } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import React, { useState } from 'react';
import classNames from 'classnames';
import rpt from 'prop-types';

import { SvgIcon, Button } from '@instana/components';

import useDuringTransition from 'in-components/DraggableItemSelector/useDuringTransition';
import SlideInView, { ListHeader } from 'in-components/SlideInView/SlideInView';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './DraggableItemSelector.mless';

function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={locals.item}
      style={{
        transform: CSS.Transform.toString(transform),
        position: 'relative',
        zIndex: isDragging ? 1000 : 'auto',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      {...attributes}
      {...listeners}
    >
      {children(isDragging)}
    </div>
  );
}

export default function DraggableItemSelector(props) {
  const {
    items,
    Content,
    disabled,
    onSwap,
    onRemove,
    SlideInContent,
    slideInContentTitle,
    /*
      Added to support a special case on MetricConfigurator component.
      The content rendered in the SlideView component is not re-calculated and some elements get off the viewport.
    */
    shouldTriggerWindowResize,
    className
  } = props;
  const [showSlideInContent, onShowSlideInContentChange] = useState(false);

  // SlideInView and useDuringTransition need to be in sync
  const slideTransitionDurationMillis = 250;
  const duringTransition = useDuringTransition(showSlideInContent, slideTransitionDurationMillis);
  const sensors = [useSensor(PointerSensor, { activationConstraint: { distance: 5 } })];

  return (
    <SlideInView
      staticContent={
        <form
          className={classNames({
            [locals.overlay]: true,
            [locals.fullHeight]: showSlideInContent,
            [className]: true
          })}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (over && onSwap) {
                onSwap(active.id, over.id);
              }
            }}
          >
            <SortableContext items={items.map((_, i) => String(i))} strategy={verticalListSortingStrategy}>
              {items.map((item, index) => (
                <SortableItem key={String(index)} id={String(index)}>
                  {isDragging => (
                    <>
                      {onSwap ? (
                        <Tooltip
                          content={isDragging ? '' : t('in-components:draggableItemSelector.tooltipReorderMetrics')}
                        >
                          <div className={locals.dragHandle}>
                            <SvgIcon type="lib_menu" size="xs" />
                          </div>
                        </Tooltip>
                      ) : (
                        <div className={locals.dragHandle} />
                      )}

                      <Content item={item} {...props} i={index} />

                      <SvgIcon
                        className={locals.removeButton}
                        type="lib_actions_delete"
                        onClick={() => onRemove(item, index)}
                      />
                    </>
                  )}
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
          <div className={locals.addButtonWrapper}>
            <Button
              kind="action"
              icon="lib_openclose_add_circle_outline"
              onClick={() => onShowSlideInContentChange(!showSlideInContent)}
              disabled={disabled}
              size="compact"
            >
              {slideInContentTitle}
            </Button>
          </div>
        </form>
      }
      HeaderComponent={ListHeader}
      slideTransitionDurationMillis={slideTransitionDurationMillis}
      slideInContent={
        <SlideInContent
          {...props}
          onShowSlideInContentChange={onShowSlideInContentChange}
          disabled={duringTransition}
        />
      }
      slideInContentTitle={slideInContentTitle}
      showSlideInContent={showSlideInContent}
      onShowSlideInContentChange={onShowSlideInContentChange}
      shouldTriggerWindowResize={shouldTriggerWindowResize}
    />
  );
}

DraggableItemSelector.propTypes = {
  SlideInContent: rpt.elementType.isRequired,
  slideInContentTitle: rpt.string.isRequired,
  shouldTriggerWindowResize: rpt.bool,
  Content: rpt.elementType.isRequired,
  onRemove: rpt.func.isRequired,
  items: rpt.array.isRequired,
  onSwap: rpt.func,
  disabled: rpt.bool,
  className: rpt.string
};
