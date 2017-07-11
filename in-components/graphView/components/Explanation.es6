import React from 'react';

import { goToPhysicalView } from 'in-stores/navigation';
import Lettering from 'in-components/Lettering';
import Button from 'in-components/Button';
import Link from 'in-components/Link';

import './Explanation.less';

const block = 'in-graph-explanation';

export default function Explanation() {
  return (
    <div className={block}>

      <Lettering className={block + '__lettering'} />

      <h2>
        Dynamic Graph Showcase
      </h2>

      <p>
        The core technology powering Instana is what we call the Dynamic Graph. The Graph is a
        model of your application that understands all physical and logical dependencies of
        components. On the right you see the Dynamic Graph of your current environment!
      </p>

      <p>
        The Graph has more than the physical components – it also includes logical components
        like traces, applications, services, clusters or tablespaces. Components and their
        dependencies are discovered automatically by the Instana Agent and Sensors such that
        the Graph is continuously kept up to date. Every node in the Graph is also continuously
        updated with state information like metrics, configuration data and a calculated health
        value based on semantical knowledge and a machine learning approach. This knowledge
        also analyses the dependencies in the graph to find logical groupings like services
        and applications to understand impact on that level and derive criticality of issues.
        The whole graph is persistent and you can go back and forth in time to leverage the
        knowledge of the graph for many operational use cases.
      </p>

      <p>
        <Link href="https://www.instana.com/blog/monitoring-microservice-applications-introducing-dynamic-graph/">
          Visit our blog
        </Link>{' '}
        for more information.
      </p>

      <p>
        <Button onClick={goToPhysicalView}>
          Close Graph
        </Button>
      </p>
    </div>
  );
}
