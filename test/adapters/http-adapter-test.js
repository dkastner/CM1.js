require('../helper');
var Cm1Result = require('../fixtures/cm1-result');

var HttpAdapter = require('../../lib/adapters/http-adapter');

var ImpactEstimate = require('../../lib/impact-estimate');

var fakeweb = require('fakeweb'),
    http = require('http');
http.register_intercept({
    uri: '/automobiles.json', 
    host: 'impact.brighterplanet.com',
    body: JSON.stringify(Cm1Result.fit)
});

vows.describe('HttpAdapter').addBatch({
  '#path': {
    topic: function() {
      return new HttpAdapter();
    },
    'returns a path for the model': function(adapter) {
      assert.equal(adapter.path({ model: 'automobile' }), '/automobiles.json');
    }
  },

  '#getImpacts': {
    topic: function() {
      var adapter = new HttpAdapter();
      adapter.getImpacts({model: 'automobile'}, {}, {}, this.callback);
    },
    'calls the callback with the impactEstimate': function(err, estimate) {
      assert.instanceOf(estimate, ImpactEstimate);
    },
    "sets the data attribute on the emitter's ImpactEstimate": function(err, estimate) {
      assert.deepEqual(estimate.data, Cm1Result.fit);
    }
  },
}).export(module);
