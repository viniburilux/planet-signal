// Planet Signal test: embedding trajectory vs NDVI/NDWI, 3 sites, change x control
var BUF = 1500;
var SITES = {
  esec_change:     {pt: [-44.9805, -8.8273]},
  esec_ctrl:       {pt: [-45.1000, -8.7000]},
  kayapo_change:   {pt: [-50.9800, -7.8800]},
  kayapo_ctrl:     {pt: [-51.1000, -7.8000]},
  jamanxim_change: {pt: [-55.7257, -5.7922]},
  jamanxim_ctrl:   {pt: [-55.6000, -5.7000]}
};
var YEARS = ee.List.sequence(2017, 2025);
var embCol = ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL');

var siteNames = Object.keys(SITES);
var geoms = {};
siteNames.forEach(function(n){
  geoms[n] = ee.Geometry.Point(SITES[n].pt).buffer(BUF);
  Map.addLayer(geoms[n], {color: n.indexOf('ctrl') >= 0 ? '00ff00' : 'ff0000'}, n);
});
Map.setCenter(-52.5, -7.5, 5);

function yearDict(n, y) {
  var geom = geoms[n];
  var emb = embCol.filterDate(ee.Date.fromYMD(y,1,1), ee.Date.fromYMD(y,12,31).advance(1,"day")).mosaic();
  var embMean = emb.reduceRegion({
    reducer: ee.Reducer.mean(), geometry: geom, scale: 30,
    maxPixels: 1e8, bestEffort: true, tileScale: 4
  });
  var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(geom)
    .filterDate(ee.Date.fromYMD(y,6,1), ee.Date.fromYMD(y,10,31))
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 70))
    .median();
  var idx = ee.Image.cat([
    s2.normalizedDifference(['B8','B4']).rename('ndvi'),
    s2.normalizedDifference(['B3','B8']).rename('ndwi')
  ]).reduceRegion({reducer: ee.Reducer.mean(), geometry: geom, scale: 30, maxPixels: 1e8, bestEffort: true});
  return ee.Dictionary({emb: embMean, idx: idx});
}

var yearsStr = YEARS.map(function(y){ return ee.Number(y).format(); });
var perSite = ee.Dictionary.fromLists(siteNames, siteNames.map(function(n){
  var dicts = YEARS.map(function(y){ return yearDict(n, y); });
  return ee.Dictionary.fromLists(yearsStr, dicts);
}));

perSite.evaluate(function(res){
  if (!res) { print('SITEDATA ERROR: evaluate returned null'); return; }
  Object.keys(res).forEach(function(k){ print('SITEDATA ' + k + ' ' + JSON.stringify(res[k])); });
  print('SITEDATA DONE');
});
