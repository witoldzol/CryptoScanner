import { lunoOptions } from './luno'
import { binanceOptions } from './binance'
import { gdaxOptions } from './gdax'
import { getPrices } from './market-service'
import { mapDataToObject } from './util'
import { GraphService } from './graph-service'

let graphService = new GraphService()

let lunoPrices = getPrices(lunoOptions)
let gdaxPrices = getPrices(gdaxOptions)
let binancePrices = getPrices(binanceOptions)

Promise.all([lunoPrices, gdaxPrices, binancePrices]).
  then((data) => mapDataToObject(data)).
  then((data) => graphService.populateGraph(data)).
  then((graph) => graphService.recalculateEdgeWeights(graph)).
  then((graph) => graph.findNegativeCycles()).
  then(result => console.log('RESULT: ', result)).
  catch((e) => console.log('error from main pricess ALL.Promise: ' + e.stack))
