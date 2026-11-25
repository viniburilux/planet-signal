var col = ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL');
function ym(y){ return col.filterDate(ee.Date.fromYMD(y,1,1), ee.Date.fromYMD(y,12,31)).mosaic(); }
var wdpa = ee.FeatureCollection('WCMC/WDPA/current/polygons');
var uc = wdpa.filterBounds(ee.Geometry.Point(-55.7257,-5.7922)).first();
print('UCNAME ' + ee.String(uc.get('NAME')).getInfo());
var g = uc.geometry();
print('UCAREA ' + g.area().divide(1e6).getInfo());
var pts = ee.FeatureCollection.randomPoints({region: g, points: 600, seed: 7});
var bands = ee.List.sequence(0,63).map(function(i){ return ee.String('A').cat(ee.Number(i).format('%02d')); });
function renamed(img, sfx){ return img.select(bands).rename(bands.map(function(b){ return ee.String(b).cat(sfx); })); }
var stack = renamed(ym(2017),'_17').addBands(renamed(ym(2024),'_24')).addBands(renamed(ym(2025),'_25'));
var sampled = stack.sampleRegions({collection: pts, scale: 60, tileScale: 8, geometries: true});
var out = sampled.map(function(f){
  function vec(sfx){ return ee.Array(bands.map(function(b){ return f.get(ee.String(b).cat(sfx)); })); }
  function cosdist(a,b){ var dot = a.multiply(b).reduce('sum',[0]).get([0]); var na = a.multiply(a).reduce('sum',[0]).get([0]).sqrt(); var nb = b.multiply(b).reduce('sum',[0]).get([0]).sqrt(); return ee.Number(1).subtract(dot.divide(na.multiply(nb))); }
  var v17 = vec('_17'), v24 = vec('_24'), v25 = vec('_25');
  return f.set({d1725: cosdist(v17,v25), d1724: cosdist(v17,v24), d2425: cosdist(v24,v25)}).select(['d1725','d1724','d2425']);
});
out.evaluate(function(fc, err){ if(err){ print('ERR ' + err); return; } print('GRIDDATA Jamanxim ' + JSON.stringify(fc)); });
