import Geojson2wkt from 'geojson2wkt';
import fs from 'fs-extra';
import mysqlx from '@mysql/xdevapi';
import dotenv from 'dotenv';
dotenv.config();
const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '33060'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  schema: process.env.DB_SCHEMA,
  table: process.env.DB_TABLE
};

const main = async () => {
  const session = await mysqlx.getSession(config);
  const schema = await session.getSchema(config.schema);
  const table = await schema.getTable(config.table);

  const queryRes = await fs.readFile('../query.csv', 'utf-8');
  const lines = queryRes.split('\n');
  const oaza_hash = {};

  const counties = {};
  for (let i = 1; i < lines.length; i++) {
    const items = lines[i].split(',');
    if (items[1]) {
      counties[items[1].substring(0, 5)] = items[2];
    }
  }

  for (let j = 1; j < 48; j++) {
    const pref_code = j.toString().padStart(2, '0');
    const geojson = await fs.readJson(`../geojson/N03-23_${pref_code}_230101.geojson`);
    const features = geojson.features;
    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      let city_name, ward_name, county_name;
      const city_code = feature.properties.N03_007.substring(2, 5);
      if (feature.properties.N03_003) {
        if (feature.properties.N03_003.match(/^((?:大阪|名古屋|京都|横浜|神戸|北九州|札幌|川崎|福岡|広島|仙台|千葉|さいたま|静岡|堺|新潟|浜松|岡山|相模原|熊本)市)$/)) { 
          county_name = '';
          city_name = feature.properties.N03_003;
          ward_name = feature.properties.N03_004.replace(city_name, '');
        } else {
          county_name = feature.properties.N03_003;
          city_name = feature.properties.N03_004;
          ward_name = '';
        }
      } else {
        county_name = '';
        city_name = feature.properties.N03_004;
        ward_name = '';
      }
      const hash = {
        type: 'city',
        pref_code: pref_code || '',
        city_code: city_code || '',
        oaza_code: '',
        pref_name: feature.properties.N03_001,
        county_name,
        city_name,
        ward_name,
        oaza_name: '',
        koaza_name: '',
        detail_name: '',
        geometry: feature.geometry,
      };
      const oaza_key = `${hash.pref_code}${hash.city_code}${hash.oaza_code}`;
      if (!oaza_hash[oaza_key]) oaza_hash[oaza_key] = [hash];
      else oaza_hash[oaza_key].push(hash);
    }
  }

  const keys = Object.keys(oaza_hash);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    let target = oaza_hash[key];
    console.log(target);
    target[0].geometry = { "type": "MultiPolygon", "coordinates": [target[0].geometry.coordinates] };
    if (target.length == 1) {
      target = target[0];
    } else {
      target = target.reduce((prev, item) => {
        if (!prev) return item;
        prev.geometry.coordinates.push(item.geometry.coordinates);
        return prev;
      }, undefined);
    }
    console.log(target);
    const wkt = Geojson2wkt.convert(target.geometry);
    target.wkt = wkt;
    //console.log(target.wkt);
    delete target.geometry;
    //console.log(target);
    //console.log('$$$$');
    await table.insert('type', 'pref_code', 'city_code', 'oaza_code', 'pref_name', 'county_name', 'city_name', 'ward_name', 'oaza_name', 'koaza_name', 'detail_name', 'geom')
      .values(target.type, target.pref_code, target.city_code, target.oaza_code, target.pref_name, target.county_name, target.city_name, target.ward_name, target.oaza_name, target.koaza_name, target.detail_name, mysqlx.expr(`ST_GeomFromText('${target.wkt}', 4326, 'axis-order=long-lat')`))
      .execute();
  }
};

main();