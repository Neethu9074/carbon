/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ContentProps from 'in-plg/pages/onboarding/content/ContentProps';
import AgentCatalogCard from 'in-plg/components/Card/AgentCatalogCard';

import locals from 'in-plg/components/Card/CardGrid.mless';

interface CardGridProps {
  data: ContentProps[];
}

export default function CardGrid({ data }: CardGridProps) {
  return (
    <div className={locals.cardGrid}>
      {data.map((item, index) => (
        <AgentCatalogCard
          key={index}
          title={item.label}
          icon={item.icon}
          iconColor={item.iconColor}
          content={item.subTechnology?.label ?? ''}
          href={`/agents/installation/${item?.id}`}
        />
      ))}
    </div>
  );
}
