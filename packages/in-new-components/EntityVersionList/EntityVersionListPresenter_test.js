/* eslint-env mocha */

import { expect } from 'chai';

import { cluster } from 'in-new-components/EntityVersionList/EntityVersionListPresenter';

describe.only('in-new-components/EntityVersionList/EntityVersionListPresenter#cluster', () => {
  it('should cluster versions', () => {
    let clusters = cluster([{ from: 0, to: 100 }]);
    expect(clusters).to.have.length(1);

    clusters = cluster([{ from: 0, to: 100 }, { from: 100, to: 200 }, { from: 200, to: 300 }, { from: 300, to: 400 }]);
    expect(clusters).to.have.length(1);
    expect(clusters[0]).to.have.length(4);

    clusters = cluster([{ from: 0, to: 100 }, { from: 100, to: 200 }, { from: 250, to: 300 }, { from: 300, to: 400 }]);
    expect(clusters).to.have.length(2);
    expect(clusters[0]).to.have.length(2);
    expect(clusters[1]).to.have.length(2);
    expect(clusters[0][0].from).to.equal(0);
    expect(clusters[0][1].from).to.equal(100);
    expect(clusters[1][0].from).to.equal(250);
    expect(clusters[1][1].from).to.equal(300);

    clusters = cluster([{ from: 0, to: 100 }, { from: 200, to: 300 }, { from: 400, to: 500 }, { from: 600, to: 700 }]);
    expect(clusters).to.have.length(4);
    expect(clusters[0][0].from).to.equal(0);
    expect(clusters[1][0].from).to.equal(200);
    expect(clusters[2][0].from).to.equal(400);
    expect(clusters[3][0].from).to.equal(600);
  });
});
