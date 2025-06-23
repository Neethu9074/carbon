/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Accordion, AccordionItem, Column, Grid } from '@instana/carbon';
import { Typography } from '@instana/components';

import AgentCatalogCard from 'in-plg/components/Card/AgentCatalogCard';
import { FreeTrialEntries } from 'in-plg/pages/onboarding/content';

import locals from 'in-plg/components/Card/CardGridV2.mless';

interface CardGridProps {
  data: FreeTrialEntries;
  fromOnboarding?: boolean;
}

export default function CardGridV2({ data, fromOnboarding = false }: CardGridProps) {
  const datasources = Object.values(data);

  return (
    <Accordion>
      {datasources.map((datasource, datasourceIndex) => {
        if (datasource?.data.length)
          return (
            <AccordionItem
              key={datasourceIndex}
              className={locals.carbonAccordionItem}
              title={
                <Typography variant="heading-02">{`${datasource.accordionTitle} (${datasource.data.length})`}</Typography>
              }
              open
            >
              <Typography variant="body-01">{datasource.accordionDesciption}</Typography>
              <Grid className={locals.grid} fullWidth narrow>
                {datasource.data.map((item, itemIndex) => (
                  <Column key={itemIndex} sm={4} className={locals.carbonColumn}>
                    <AgentCatalogCard
                      title={item.label}
                      icon={item.icon}
                      content={item.subTechnology?.label ?? ''}
                      href={`/datasources${fromOnboarding ? '/onboarding' : ''}/installation/${item?.id}`}
                    />
                  </Column>
                ))}
              </Grid>
            </AccordionItem>
          );
        else return null;
      })}
    </Accordion>
  );
}
