/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { expect } from 'chai';

import { TagFilterOperator } from '@instana/types';

import {
  getEntitySelection,
  getEntitySelectionAsTagFilterFormModel,
  hasSubEntitySelection,
  resetEntitySelection
} from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { CLOSE_BRACKET, CONJUNCTION, OPEN_BRACKET } from 'in-components/QueryBuilder/transformation/formModel';
import { and, or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { EQUALS, NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { boundaryScopes } from 'in-applications/constants';

describe('in-alerting/smart-alerts/applications/data/entitySelection', () => {
  describe('#getEntitySelectionAsTagFilterFormModel', () => {
    it('should return applicationId filter for full application selection', () => {
      const applications = {
        app1: {
          applicationId: 'app1',
          inclusive: true,
          services: {}
        }
      };
      const actualFormModel = getEntitySelectionAsTagFilterFormModel(
        applications,
        boundaryScopes.all,
        'app1',
        undefined,
        undefined
      );

      expect(actualFormModel).to.deep.equal([destinationTagFilter('application.id', EQUALS, 'app1')]);
    });

    it('should allow to select full application but exclude service', () => {
      const applications = {
        app1: {
          applicationId: 'app1',
          inclusive: true,
          services: {
            service1: {
              endpoints: {},
              serviceId: 'service1',
              inclusive: false
            }
          }
        }
      };
      const actualFormModel = getEntitySelectionAsTagFilterFormModel(
        applications,
        boundaryScopes.all,
        'app1',
        undefined,
        undefined
      );

      expect(actualFormModel).to.deep.equal([
        destinationTagFilter('application.id', EQUALS, 'app1'),
        { type: CONJUNCTION, logicalOperator: and },
        destinationTagFilter('service.id', NOT_EQUAL, 'service1')
      ]);
    });

    it('should allow to select only specific services of an application', () => {
      const applications = {
        app1: {
          applicationId: 'app1',
          inclusive: false,
          services: {
            service1: {
              endpoints: {},
              serviceId: 'service1',
              inclusive: true
            },
            service2: {
              endpoints: {},
              serviceId: 'service2',
              inclusive: true
            }
          }
        }
      };
      const actualFormModel = getEntitySelectionAsTagFilterFormModel(
        applications,
        boundaryScopes.all,
        'app1',
        undefined,
        undefined
      );

      expect(actualFormModel).to.deep.equal([
        destinationTagFilter('application.id', EQUALS, 'app1'),
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        destinationTagFilter('service.id', EQUALS, 'service1'),
        { type: CONJUNCTION, logicalOperator: or },
        destinationTagFilter('service.id', EQUALS, 'service2'),
        { type: CLOSE_BRACKET }
      ]);
    });

    it('should allow complex selection with inclusive application', () => {
      const applications = {
        app1: {
          applicationId: 'app1',
          inclusive: true,
          services: {
            service1: {
              serviceId: 'service1',
              inclusive: true,
              endpoints: {
                endpoint11: {
                  endpointId: 'endpoint11',
                  inclusive: false
                }
              }
            },
            service2: {
              serviceId: 'service2',
              inclusive: true,
              endpoints: {
                endpoint21: {
                  endpointId: 'endpoint21',
                  inclusive: false
                },
                endpoint22: {
                  endpointId: 'endpoint22',
                  inclusive: false
                },
                endpoint23: {
                  endpointId: 'endpoint23',
                  inclusive: false
                }
              }
            },
            service3: {
              serviceId: 'service3',
              inclusive: false,
              endpoints: {
                endpoint31: {
                  endpointId: 'endpoint31',
                  inclusive: true
                }
              }
            },
            service4: {
              serviceId: 'service4',
              inclusive: false,
              endpoints: {
                endpoint41: {
                  endpointId: 'endpoint41',
                  inclusive: true
                },
                endpoint42: {
                  endpointId: 'endpoint42',
                  inclusive: true
                }
              }
            },
            service5: {
              endpoints: {},
              serviceId: 'service5',
              inclusive: false
            }
          }
        }
      };
      const actualFormModel = getEntitySelectionAsTagFilterFormModel(
        applications,
        boundaryScopes.all,
        'app1',
        'appName',
        undefined
      );

      expect(actualFormModel).to.deep.equal([
        destinationTagFilter('application.name', EQUALS, 'appName'),
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        destinationTagFilter('service.id', NOT_EQUAL, 'service1'),
        { type: CONJUNCTION, logicalOperator: or },
        destinationTagFilter('endpoint.id', NOT_EQUAL, 'endpoint11'),
        { type: CLOSE_BRACKET },
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        destinationTagFilter('service.id', NOT_EQUAL, 'service2'),
        { type: CONJUNCTION, logicalOperator: or },
        destinationTagFilter('endpoint.id', NOT_EQUAL, 'endpoint21'),
        { type: CLOSE_BRACKET },
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        destinationTagFilter('service.id', NOT_EQUAL, 'service2'),
        { type: CONJUNCTION, logicalOperator: or },
        destinationTagFilter('endpoint.id', NOT_EQUAL, 'endpoint22'),
        { type: CLOSE_BRACKET },
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        destinationTagFilter('service.id', NOT_EQUAL, 'service2'),
        { type: CONJUNCTION, logicalOperator: or },
        destinationTagFilter('endpoint.id', NOT_EQUAL, 'endpoint23'),
        { type: CLOSE_BRACKET },
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        destinationTagFilter('service.id', NOT_EQUAL, 'service3'),
        { type: CONJUNCTION, logicalOperator: or },
        destinationTagFilter('endpoint.id', EQUALS, 'endpoint31'),
        { type: CLOSE_BRACKET },
        { type: CONJUNCTION, logicalOperator: and },
        destinationTagFilter('service.id', NOT_EQUAL, 'service4'),
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        destinationTagFilter('endpoint.id', EQUALS, 'endpoint41'),
        { type: CONJUNCTION, logicalOperator: or },
        destinationTagFilter('endpoint.id', EQUALS, 'endpoint42'),
        { type: CLOSE_BRACKET },
        { type: CONJUNCTION, logicalOperator: and },
        destinationTagFilter('service.id', NOT_EQUAL, 'service5')
      ]);
    });

    it('should allow complex selection with exclusive application', () => {
      const applications = {
        app1: {
          applicationId: 'app1',
          inclusive: false,
          services: {
            service1: {
              serviceId: 'service1',
              inclusive: false,
              endpoints: {
                endpoint11: {
                  endpointId: 'endpoint11',
                  inclusive: true
                }
              }
            },
            service2: {
              serviceId: 'service2',
              inclusive: false,
              endpoints: {
                endpoint21: {
                  endpointId: 'endpoint21',
                  inclusive: true
                },
                endpoint22: {
                  endpointId: 'endpoint22',
                  inclusive: true
                },
                endpoint23: {
                  endpointId: 'endpoint23',
                  inclusive: true
                }
              }
            },
            service3: {
              serviceId: 'service3',
              inclusive: true,
              endpoints: {
                endpoint31: {
                  endpointId: 'endpoint31',
                  inclusive: false
                }
              }
            },
            service4: {
              serviceId: 'service4',
              inclusive: true,
              endpoints: {
                endpoint41: {
                  endpointId: 'endpoint41',
                  inclusive: false
                },
                endpoint42: {
                  endpointId: 'endpoint42',
                  inclusive: false
                }
              }
            },
            service5: {
              endpoints: {},
              serviceId: 'service5',
              inclusive: true
            }
          }
        }
      };
      const actualFormModel = getEntitySelectionAsTagFilterFormModel(
        applications,
        boundaryScopes.all,
        'app1',
        undefined,
        undefined
      );

      expect(actualFormModel).to.deep.equal([
        destinationTagFilter('application.id', EQUALS, 'app1'),
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        destinationTagFilter('service.id', EQUALS, 'service1'),
        { type: CONJUNCTION, logicalOperator: and },
        destinationTagFilter('endpoint.id', EQUALS, 'endpoint11'),
        { type: CONJUNCTION, logicalOperator: or },
        destinationTagFilter('service.id', EQUALS, 'service2'),
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        destinationTagFilter('endpoint.id', EQUALS, 'endpoint21'),
        { type: CONJUNCTION, logicalOperator: or },
        destinationTagFilter('endpoint.id', EQUALS, 'endpoint22'),
        { type: CONJUNCTION, logicalOperator: or },
        destinationTagFilter('endpoint.id', EQUALS, 'endpoint23'),
        { type: CLOSE_BRACKET },
        { type: CONJUNCTION, logicalOperator: or },
        destinationTagFilter('service.id', EQUALS, 'service3'),
        { type: CONJUNCTION, logicalOperator: and },
        destinationTagFilter('endpoint.id', NOT_EQUAL, 'endpoint31'),
        { type: CONJUNCTION, logicalOperator: or },
        destinationTagFilter('service.id', EQUALS, 'service4'),
        { type: CONJUNCTION, logicalOperator: and },
        destinationTagFilter('endpoint.id', NOT_EQUAL, 'endpoint41'),
        { type: CONJUNCTION, logicalOperator: and },
        destinationTagFilter('endpoint.id', NOT_EQUAL, 'endpoint42'),
        { type: CONJUNCTION, logicalOperator: or },
        destinationTagFilter('service.id', EQUALS, 'service5'),
        { type: CLOSE_BRACKET }
      ]);
    });

    describe('scoped to sub-entity via serviceId', () => {
      it('should return (applicationId AND serviceId) filter for full application selection', () => {
        const applications = {
          app1: {
            applicationId: 'app1',
            inclusive: true,
            services: {}
          }
        };
        const actualFormModel = getEntitySelectionAsTagFilterFormModel(
          applications,
          boundaryScopes.all,
          'app1',
          undefined,
          'service1'
        );

        expect(actualFormModel).to.deep.equal([
          destinationTagFilter('application.id', EQUALS, 'app1'),
          { type: CONJUNCTION, logicalOperator: and },
          destinationTagFilter('service.id', EQUALS, 'service1')
        ]);
      });

      it('should allow to select only specific services of an application but then scope it to a single one', () => {
        const applications = {
          app1: {
            applicationId: 'app1',
            inclusive: false,
            services: {
              service1: {
                endpoints: {},
                serviceId: 'service1',
                inclusive: true
              },
              service2: {
                endpoints: {},
                serviceId: 'service2',
                inclusive: true
              }
            }
          }
        };
        const actualFormModel = getEntitySelectionAsTagFilterFormModel(
          applications,
          boundaryScopes.inbound,
          'app1',
          undefined,
          'service2'
        );

        expect(actualFormModel).to.deep.equal([
          tagFilter('boundary.application.id', EQUALS, 'app1'),
          { type: CONJUNCTION, logicalOperator: and },
          destinationTagFilter('service.id', EQUALS, 'service2')
        ]);
      });

      it('should allow to select only specific services of complex selection with inclusive application and excluded endpoints', () => {
        const applications = {
          app1: {
            applicationId: 'app1',
            inclusive: true,
            services: {
              service1: {
                serviceId: 'service1',
                inclusive: true,
                endpoints: {
                  endpoint11: {
                    endpointId: 'endpoint11',
                    inclusive: false
                  },
                  endpoint12: {
                    endpointId: 'endpoint12',
                    inclusive: false
                  }
                }
              },
              service2: {
                endpoints: {},
                serviceId: 'service2',
                inclusive: false
              },
              service3: {
                endpoints: {},
                serviceId: 'service3',
                inclusive: false
              }
            }
          }
        };
        const actualFormModel = getEntitySelectionAsTagFilterFormModel(
          applications,
          boundaryScopes.all,
          'app1',
          undefined,
          'service1'
        );

        expect(actualFormModel).to.deep.equal([
          destinationTagFilter('application.id', EQUALS, 'app1'),
          { type: CONJUNCTION, logicalOperator: and },
          destinationTagFilter('service.id', EQUALS, 'service1'),
          { type: CONJUNCTION, logicalOperator: and },
          destinationTagFilter('endpoint.id', NOT_EQUAL, 'endpoint11'),
          { type: CONJUNCTION, logicalOperator: and },
          destinationTagFilter('endpoint.id', NOT_EQUAL, 'endpoint12')
        ]);
      });

      it('should allow to select only specific services of complex selection with inclusive application and included endpoints', () => {
        const applications = {
          app1: {
            applicationId: 'app1',
            inclusive: true,
            services: {
              service1: {
                serviceId: 'service1',
                inclusive: false,
                endpoints: {
                  endpoint11: {
                    endpointId: 'endpoint11',
                    inclusive: true
                  },
                  endpoint12: {
                    endpointId: 'endpoint12',
                    inclusive: true
                  }
                }
              },
              service2: {
                endpoints: {},
                serviceId: 'service2',
                inclusive: false
              },
              service3: {
                endpoints: {},
                serviceId: 'service3',
                inclusive: false
              }
            }
          }
        };
        const actualFormModel = getEntitySelectionAsTagFilterFormModel(
          applications,
          boundaryScopes.all,
          'app1',
          undefined,
          'service1'
        );

        expect(actualFormModel).to.deep.equal([
          destinationTagFilter('application.id', EQUALS, 'app1'),
          { type: CONJUNCTION, logicalOperator: and },
          destinationTagFilter('service.id', EQUALS, 'service1'),
          { type: CONJUNCTION, logicalOperator: and },
          { type: OPEN_BRACKET },
          destinationTagFilter('endpoint.id', EQUALS, 'endpoint11'),
          { type: CONJUNCTION, logicalOperator: or },
          destinationTagFilter('endpoint.id', EQUALS, 'endpoint12'),
          { type: CLOSE_BRACKET }
        ]);
      });

      it('should allow to select only specific services of complex selection with exclusive application and excluded endpoints', () => {
        const applications = {
          app1: {
            applicationId: 'app1',
            inclusive: false,
            services: {
              service1: {
                serviceId: 'service1',
                inclusive: true,
                endpoints: {
                  endpoint11: {
                    endpointId: 'endpoint11',
                    inclusive: false
                  },
                  endpoint12: {
                    endpointId: 'endpoint12',
                    inclusive: false
                  }
                }
              },
              service2: {
                endpoints: {},
                serviceId: 'service2',
                inclusive: true
              },
              service3: {
                endpoints: {},
                serviceId: 'service3',
                inclusive: true
              }
            }
          }
        };
        const actualFormModel = getEntitySelectionAsTagFilterFormModel(
          applications,
          boundaryScopes.all,
          'app1',
          undefined,
          'service1'
        );

        expect(actualFormModel).to.deep.equal([
          destinationTagFilter('application.id', EQUALS, 'app1'),
          { type: CONJUNCTION, logicalOperator: and },
          destinationTagFilter('service.id', EQUALS, 'service1'),
          { type: CONJUNCTION, logicalOperator: and },
          destinationTagFilter('endpoint.id', NOT_EQUAL, 'endpoint11'),
          { type: CONJUNCTION, logicalOperator: and },
          destinationTagFilter('endpoint.id', NOT_EQUAL, 'endpoint12')
        ]);
      });

      it('should allow to select only specific services of complex selection with exclusive application and included endpoints', () => {
        const applications = {
          app1: {
            applicationId: 'app1',
            inclusive: false,
            services: {
              service1: {
                serviceId: 'service1',
                inclusive: false,
                endpoints: {
                  endpoint11: {
                    endpointId: 'endpoint11',
                    inclusive: true
                  },
                  endpoint12: {
                    endpointId: 'endpoint12',
                    inclusive: true
                  }
                }
              },
              service2: {
                endpoints: {},
                serviceId: 'service2',
                inclusive: true
              },
              service3: {
                endpoints: {},
                serviceId: 'service3',
                inclusive: true
              }
            }
          }
        };
        const actualFormModel = getEntitySelectionAsTagFilterFormModel(
          applications,
          boundaryScopes.all,
          'app1',
          undefined,
          'service1'
        );

        expect(actualFormModel).to.deep.equal([
          destinationTagFilter('application.id', EQUALS, 'app1'),
          { type: CONJUNCTION, logicalOperator: and },
          destinationTagFilter('service.id', EQUALS, 'service1'),
          { type: CONJUNCTION, logicalOperator: and },
          { type: OPEN_BRACKET },
          destinationTagFilter('endpoint.id', EQUALS, 'endpoint11'),
          { type: CONJUNCTION, logicalOperator: or },
          destinationTagFilter('endpoint.id', EQUALS, 'endpoint12'),
          { type: CLOSE_BRACKET }
        ]);
      });
    });
  });

  describe('#getEntitySelection', () => {
    it('should return application selection', () => {
      const applications = getEntitySelection('app1');

      expect(applications).to.deep.equal({
        app1: {
          applicationId: 'app1',
          inclusive: true,
          services: {}
        }
      });
    });

    it('should return application+service selection', () => {
      const applications = getEntitySelection('app1', 'service1');

      expect(applications).to.deep.equal({
        app1: {
          applicationId: 'app1',
          inclusive: false,
          services: {
            service1: {
              serviceId: 'service1',
              inclusive: true,
              endpoints: {}
            }
          }
        }
      });
    });

    it('should return application+service+endpoint selection', () => {
      const applications = getEntitySelection('app1', 'service1', 'endpoint1');

      expect(applications).to.deep.equal({
        app1: {
          applicationId: 'app1',
          inclusive: false,
          services: {
            service1: {
              serviceId: 'service1',
              inclusive: false,
              endpoints: {
                endpoint1: {
                  endpointId: 'endpoint1',
                  inclusive: true
                }
              }
            }
          }
        }
      });
    });
  });

  describe('#hasSubEntitySelection', () => {
    it('should return FALSE for default (individual) SA selection', () => {
      const defaultApplicationSelection = {
        app1: {
          applicationId: 'app1',
          inclusive: true,
          services: {}
        }
      };

      expect(hasSubEntitySelection(defaultApplicationSelection)).to.equal(false);
    });

    it('should return FALSE for default/empty GSA selection', () => {
      const emptyApplicationSelection = {};

      expect(hasSubEntitySelection(emptyApplicationSelection)).to.equal(false);
    });

    it('should return TRUE for single AP with sub-entity selection', () => {
      const singleServiceSelection = {
        app1: {
          applicationId: 'app1',
          inclusive: false,
          services: {
            service1: {
              endpoints: {},
              serviceId: 'service1',
              inclusive: true
            }
          }
        }
      };

      expect(hasSubEntitySelection(singleServiceSelection)).to.equal(true);
    });

    it('should return TRUE for multiple AP with sub-entity selection', () => {
      const multiAppWithServicesSelection = {
        app1: {
          applicationId: 'app1',
          inclusive: false,
          services: {
            service1: {
              endpoints: {},
              serviceId: 'service1',
              inclusive: true
            }
          }
        },
        app2: {
          applicationId: 'app2',
          inclusive: true,
          services: {}
        }
      };

      expect(hasSubEntitySelection(multiAppWithServicesSelection)).to.equal(true);
    });
  });

  describe('#resetEntitySelection', () => {
    it('reset and return default single AP selection for (individual) SA', () => {
      const applications = {
        app1: {
          applicationId: 'app1',
          inclusive: true,
          services: {
            service1: {
              endpoints: {},
              serviceId: 'service1',
              inclusive: true
            }
          }
        }
      };

      expect(resetEntitySelection(false, applications)).to.deep.equal({
        app1: {
          applicationId: 'app1',
          inclusive: true,
          services: {}
        }
      });
    });

    it('reset and return fully empty selection for GSA', () => {
      const multiAppSelection = {
        app1: {
          applicationId: 'app1',
          inclusive: true,
          services: {
            service1: {
              endpoints: {},
              serviceId: 'service1',
              inclusive: true
            }
          }
        },
        app2: {
          applicationId: 'app2',
          inclusive: true,
          services: {}
        }
      };

      expect(resetEntitySelection(true, multiAppSelection)).to.deep.equal({});
    });
  });
});

function destinationTagFilter(name: string, operator: TagFilterOperator, value: string) {
  return tagFilter(name, operator, value, null, DESTINATION);
}
