//============================== BINANCE ==============================
const axios = require('axios')
const fs = require('fs')
const util = require('./util')

//util
let cl=x=>console.log(x)

// CONFIG
// ==================================================
//instance of axios 
let ax = axios.create({
    baseURL: 'https://api.binance.com/api/v1',
    timeout: 5000,
    headers: {
	'User-Agent': 'linux chrome',
        'CB-ACCESS-KEY': 'lol',
    }
})

//url path[0] + currency pair + path[1]
let urlPath = ['/depth?limit=10&symbol=', '']
let requestDelay = 250
let retryDelay = 5000
const marketName = 'binance'
let combineObjects = (arr,obj)=>arr.map( x=>Object.assign(obj,x) )

let pairs = ['ETHBTC','LTCBTC']
// let pairs = ['ETHBTC','LTCBTC','BNBBTC','NEOBTC','QTUMETH','EOSETH','SNTETH','BNTETH','BCCBTC','GASBTC','BNBETH','BTCUSDT','ETHUSDT','HSRBTC','OAXETH','DNTETH','MCOETH','ICNETH','MCOBTC','WTCBTC','WTCETH','LRCBTC','LRCETH','QTUMBTC','YOYOBTC','OMGBTC','OMGETH','ZRXBTC','ZRXETH','STRATBTC','STRATETH','SNGLSBTC','SNGLSETH','BQXBTC','BQXETH','KNCBTC','KNCETH','FUNBTC','FUNETH','SNMBTC','SNMETH','NEOETH','IOTABTC','IOTAETH','LINKBTC','LINKETH','XVGBTC','XVGETH','SALTBTC','SALTETH','MDABTC','MDAETH','MTLBTC','MTLETH','SUBBTC','SUBETH','EOSBTC','SNTBTC','ETCETH','ETCBTC','MTHBTC','MTHETH','ENGBTC','ENGETH','DNTBTC','ZECBTC','ZECETH','BNTBTC','ASTBTC','ASTETH','DASHBTC','DASHETH','OAXBTC','ICNBTC','BTGBTC','BTGETH','EVXBTC','EVXETH','REQBTC','REQETH','VIBBTC','VIBETH','HSRETH','TRXBTC','TRXETH','POWRBTC','POWRETH','ARKBTC','ARKETH','YOYOETH','XRPBTC','XRPETH','MODBTC','MODETH','ENJBTC','ENJETH','STORJBTC','STORJETH','BNBUSDT','VENBNB','YOYOBNB','POWRBNB','VENBTC','VENETH','KMDBTC','KMDETH','NULSBNB','RCNBTC','RCNETH','RCNBNB','NULSBTC','NULSETH','RDNBTC','RDNETH','RDNBNB','XMRBTC','XMRETH','DLTBNB','WTCBNB','DLTBTC','DLTETH','AMBBTC','AMBETH','AMBBNB','BCCETH','BCCUSDT','BCCBNB','BATBTC','BATETH','BATBNB','BCPTBTC','BCPTETH','BCPTBNB','ARNBTC','ARNETH','GVTBTC','GVTETH','CDTBTC','CDTETH','GXSBTC','GXSETH','NEOUSDT','NEOBNB','POEBTC','POEETH','QSPBTC','QSPETH','QSPBNB','BTSBTC','BTSETH','BTSBNB','XZCBTC','XZCETH','XZCBNB','LSKBTC','LSKETH','LSKBNB','TNTBTC','TNTETH','FUELBTC','FUELETH','MANABTC','MANAETH','BCDBTC','BCDETH','DGDBTC','DGDETH','IOTABNB','ADXBTC','ADXETH','ADXBNB','ADABTC','ADAETH','PPTBTC','PPTETH','CMTBTC','CMTETH','CMTBNB','XLMBTC','XLMETH','XLMBNB','CNDBTC','CNDETH','CNDBNB','LENDBTC','LENDETH','WABIBTC','WABIETH','WABIBNB','LTCETH','LTCUSDT','LTCBNB','TNBBTC','TNBETH','WAVESBTC','WAVESETH','WAVESBNB','GTOBTC','GTOETH','GTOBNB','ICXBTC','ICXETH','ICXBNB','OSTBTC','OSTETH','OSTBNB','ELFBTC','ELFETH','AIONBTC','AIONETH','AIONBNB','NEBLBTC','NEBLETH','NEBLBNB','BRDBTC','BRDETH','BRDBNB','MCOBNB','EDOBTC','EDOETH','WINGSBTC','WINGSETH','NAVBTC','NAVETH','NAVBNB','LUNBTC','LUNETH','TRIGBTC','TRIGETH','TRIGBNB','APPCBTC','APPCETH','APPCBNB','VIBEBTC','VIBEETH','RLCBTC','RLCETH','RLCBNB','INSBTC','INSETH','PIVXBTC','PIVXETH','PIVXBNB','IOSTBTC','IOSTETH','CHATBTC','CHATETH','STEEMBTC','STEEMETH','STEEMBNB','NANOBTC','NANOETH','NANOBNB','VIABTC','VIAETH','VIABNB','BLZBTC','BLZETH','BLZBNB','AEBTC','AEETH','AEBNB','RPXBTC','RPXETH','RPXBNB','NCASHBTC','NCASHETH','NCASHBNB','POABTC','POAETH','POABNB','ZILBTC','ZILETH','ZILBNB','ONTBTC','ONTETH','ONTBNB','STORMBTC','STORMETH','STORMBNB','QTUMBNB','QTUMUSDT','XEMBTC','XEMETH','XEMBNB','WANBTC','WANETH','WANBNB','WPRBTC','WPRETH','QLCBTC','QLCETH','SYSBTC','SYSETH','SYSBNB','QLCBNB','GRSBTC','GRSETH','ADAUSDT','ADABNB','CLOAKBTC','CLOAKETH','GNTBTC','GNTETH','GNTBNB','LOOMBTC','LOOMETH','LOOMBNB','XRPUSDT','BCNBTC','BCNETH','BCNBNB','REPBTC','REPETH','REPBNB','TUSDBTC','TUSDETH','TUSDBNB','ZENBTC','ZENETH','ZENBNB','SKYBTC','SKYETH','SKYBNB','EOSUSDT','EOSBNB','CVCBTC','CVCETH','CVCBNB','THETABTC','THETAETH','THETABNB','XRPBNB','TUSDUSDT','IOTAUSDT','XLMUSDT','IOTXBTC','IOTXETH','QKCBTC','QKCETH','AGIBTC','AGIETH','AGIBNB','NXSBTC','NXSETH','NXSBNB','ENJBNB','DATABTC','DATAETH','ONTUSDT','TRXUSDT','ETCUSDT','ETCBNB','ICXUSDT','SCBTC','SCETH','SCBNB','NPXSBTC','NPXSETH','VENUSDT','KEYBTC','KEYETH','NASBTC','NASETH','NASBNB','MFTBTC','MFTETH','MFTBNB','DENTBTC','DENTETH']

// EXPORT
// ==============================
exports.settings = 
    {
	urlPath: urlPath,
	pairs:pairs,
	requestDelay:requestDelay,
	retryDelay:retryDelay,
	ax:ax,
	maxConcurrentRequests: 20
    }

exports.formatData = (data)=>
    {
	let obj = {}
	let a = {}
	combineObjects(data,obj)
	a[marketName] = obj
 	return a
    }


// // // GETS ALL CURRENCY PAIRS --- we don't use it normally (because we already exported all currency pairs)
// ax.get('/exchangeInfo')
//     .then(res=>
// 	  {
// 	      //build array of currency pairs (365 items!)
// 	      let arr=res.data.symbols.map(x=>"'" + x.symbol + "'")
// 	      cl(arr.length)
// 	      cl(arr)
// 	      return arr
// 	  })
//     .then((arr)=>fs.writeFile('./binance.txt', arr, err=>cl(err)))
//     .catch(e=>cl(e))
