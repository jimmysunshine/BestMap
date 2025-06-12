import osmtogeojson from 'osmtogeojson';
import type { FeatureCollection } from 'geojson';

const HANGZHOU_BOUNDS = {
  north: 30.5369,  // 扩大范围
  south: 29.9027,
  east: 120.5374,
  west: 119.8164
};

export async function loadOsmData() {
  try {
    // 构建 Overpass API 查询
    const query = `
      [out:json][timeout:60];
      (
        // 区县级
        relation["admin_level"="7"]["type"="boundary"]["boundary"="administrative"](${HANGZHOU_BOUNDS.south},${HANGZHOU_BOUNDS.west},${HANGZHOU_BOUNDS.north},${HANGZHOU_BOUNDS.east});
        // 街道级
        relation["admin_level"="8"]["type"="boundary"]["boundary"="administrative"](${HANGZHOU_BOUNDS.south},${HANGZHOU_BOUNDS.west},${HANGZHOU_BOUNDS.north},${HANGZHOU_BOUNDS.east});
        // 社区级
        relation["admin_level"="9"]["type"="boundary"]["boundary"="administrative"](${HANGZHOU_BOUNDS.south},${HANGZHOU_BOUNDS.west},${HANGZHOU_BOUNDS.north},${HANGZHOU_BOUNDS.east});
      );
      out body;
      >;
      out skel qt;
    `;

    // 发送请求到 Overpass API
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch OSM data');
    }

    const osmData = await response.json();
    
    // 转换为 GeoJSON 格式
    const geojson = osmtogeojson(osmData);
    
    return geojson;
  } catch (error) {
    console.error('Error loading OSM data:', error);
    throw error;
  }
}