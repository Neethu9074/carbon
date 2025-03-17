/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { CSS } from '@dnd-kit/utilities';

import { ColumnizedContent, Li, Stack, SvgIcon, toInteractiveElement, Ul, Pill } from '@instana/components';

import {
  formatterPath,
  metricsPath,
  useChartFormatterDragAndDropFormSideEffects
} from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { getMetricId, getMetricLabel, getMetricUnit } from 'in-custom-dashboards/widgets/Chart/util';
import ColorConfigurator from 'in-custom-dashboards/widgets/Chart/FormComponent/ColorConfigurator';
import { refreshDFQ$ } from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricConfiguration';
import { triggerHighlight } from 'in-components/SelectedElementHighlighter';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Header from 'in-components/workspace/Header';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './AxesConfigurator.mless';

export const columnDefinitions = [
  {
    forceMinimumWidth: true,
    verticallyCenter: true,
    shrink: false,
    getContent({ dragHandleProps }) {
      return (
        <div className={locals.dragHandleWrapper} {...dragHandleProps}>
          <SvgIcon className={locals.dragHandle} type="lib_actions_reorder" />
        </div>
      );
    }
  },
  {
    forceMinimumWidth: true,
    verticallyCenter: true,
    shrink: false,
    getContent({ index, axisName, indexInAxis, getShortMetricKey }) {
      return (
        <Pill
          kind="info"
          {...toInteractiveElement({
            onDefaultInteraction: () => triggerHighlight(getMetricId(index)),
            ariaLabel: t('in-custom-dashboards:widgets.formCompChart.metricReorderingChart.jumpConfigDataset')
          })}
          className={locals.pill}
        >
          {getShortMetricKey(axisName, indexInAxis)}
        </Pill>
      );
    }
  },
  {
    getContent({ metricForm }) {
      let title = getMetricLabel(metricForm.toJS());
      if (metricForm.get('timeShift').value !== 0) {
        title = (
          <Tooltip content={t('in-custom-dashboards:widgets.formCompChart.metricReorderingChart.datasetTimeShift')}>
            <span className={locals.timeShifted}>
              {title} <SvgIcon className={locals.timeShiftIndicator} size="xs" type="lib_datetime_time" />
            </span>
          </Tooltip>
        );
      }

      return <div className={locals.title}>{title}</div>;
    }
  },
  {
    x: 'unitPill',
    forceMinimumWidth: true,
    verticallyCenter: true,
    shrink: false,
    getContent({ metricForm }) {
      return (
        <div className={locals.pillWrapper}>
          <Pill size="lg" kind="info">
            {getMetricUnit(metricForm.toJS())}
          </Pill>
        </div>
      );
    }
  },
  {
    x: 'colorConfigurator',
    forceMinimumWidth: true,
    verticallyCenter: true,
    shrink: false,
    getContent(args) {
      return <ColorConfigurator {...args} />;
    }
  }
];

function SortableItem({ id, content }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    position: 'relative',
    zIndex: isDragging ? 1000 : 'auto'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {content}
    </div>
  );
}

export function Reorderer({ form, onChange, children }) {
  const [scrollTopPosition, setScrollTopPosition] = useState(0);
  const dndScrollTopPosition = useRef(0);
  const dialogBoxRef = useRef(null);

  const updateScrollTopPosition = useCallback(() => {
    if (dialogBoxRef.current) {
      setScrollTopPosition(dialogBoxRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    dialogBoxRef.current = document.getElementById('dialog-slide-in-view-id');
    if (dialogBoxRef.current) {
      dialogBoxRef.current.addEventListener('scroll', updateScrollTopPosition);
      updateScrollTopPosition();
    }

    return () => {
      if (dialogBoxRef.current) {
        dialogBoxRef.current.removeEventListener('scroll', updateScrollTopPosition);
      }
    };
  }, [updateScrollTopPosition]);

  const updateForm = useChartFormatterDragAndDropFormSideEffects(form, updatedForm => {
    onChange([], () => updatedForm);
    refreshDFQ$.emit(true);
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={() => {
        document.getElementById('dialog-slide-in-view-id').style.overflowY = 'hidden';
        dndScrollTopPosition.current = scrollTopPosition;
      }}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;

        const { axisName: sourceDroppableId, indexInAxis: sourceIndex } = JSON.parse(active.id);
        const { axisName: destinationDroppableId, indexInAxis: destinationDroppableIndex } = JSON.parse(over.id);

        updateForm(
          form.updateIn([], form => {
            const metric = form.getIn([sourceDroppableId, metricsPath, sourceIndex]);
            form = form
              .updateIn([sourceDroppableId, metricsPath], f => f.remove(sourceIndex).setTouched(true))
              .updateIn([destinationDroppableId, metricsPath], f =>
                f.insert(destinationDroppableIndex, metric).setTouched(true)
              );

            if (form.containsKey(formatterPath)) {
              const formatterSource = form.getIn([sourceDroppableId, formatterPath])?.value;
              form = form.updateIn([destinationDroppableId, formatterPath], f =>
                f.setValue(formatterSource).setTouched(true)
              );
            }
            return form;
          })
        );

        setTimeout(() => {
          if (dialogBoxRef.current) {
            dialogBoxRef.current.scrollTop = dndScrollTopPosition.current;
            document.getElementById('dialog-slide-in-view-id').style.overflowY = 'auto';
          }
        }, 50);
      }}
    >
      {children}
    </DndContext>
  );
}

export function MetricsForAxis({
  form,
  onChange,
  axisName,
  startIndex,
  getShortMetricKey,
  isColorConfiguratorEnabled = true,
  withUnitPill = false,
  helpText = t('in-custom-dashboards:widgets.formCompChart.metricReorderingChart.dragDropDataset2Axes')
}) {
  const axisForm = form.get(axisName);
  const metricsForm = axisForm.get(metricsPath);

  const [sortableMetrics, setSortableMetrics] = useState(metricsForm);

  useEffect(() => {
    setSortableMetrics(metricsForm);
  }, [metricsForm]);

  const sortableIds = sortableMetrics.map((metric, indexInAxis) => ({
    id: JSON.stringify({ axisName, indexInAxis }),
    content: metric
  }));

  const showHelpText = metricsForm.size === 0;
  const columnsDefinitions = columnDefinitions
    .filter(({ x }) => x !== 'colorConfigurator' || isColorConfiguratorEnabled)
    .filter(({ x }) => x !== 'unitPill' || withUnitPill);

  return (
    <Stack gap="normal">
      <Header>{t('in-custom-dashboards:widgets.formCompChart.metricReorderingChart.datasets')}</Header>

      <TouchedMessages field={metricsForm} />

      <SortableContext items={sortableIds.map(item => item.id)} strategy={verticalListSortingStrategy}>
        {sortableIds.map(({ id, content }, indexInAxis) => (
          <SortableItem
            key={id}
            id={id}
            content={
              <Ul>
                <Li noAlternatingBg className={locals.draggableItem}>
                  <ColumnizedContent
                    columnDefinitions={getFilteredColumnDefinitionsForSource(
                      columnsDefinitions,
                      content.toJS()?.source
                    )}
                    axisName={axisName}
                    metricForm={content}
                    form={form}
                    onChange={onChange}
                    indexInAxis={indexInAxis}
                    index={startIndex + indexInAxis}
                    getShortMetricKey={getShortMetricKey}
                  />
                </Li>
              </Ul>
            }
          />
        ))}
        {showHelpText && <p className={locals.dragAndDropHelpText}>{helpText}</p>}
      </SortableContext>
    </Stack>
  );
}

function getFilteredColumnDefinitionsForSource(columnsDefinitions, source) {
  return columnsDefinitions.filter(({ x }) => x !== 'unitPill' || source === 'INFRASTRUCTURE_METRICS');
}
