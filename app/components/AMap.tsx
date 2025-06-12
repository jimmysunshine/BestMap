'use client';

// 配置高德地图参数
const AMAP_CONFIG = {
  key: '94ed5588c75afdcaccef702f5097851c',
  securityJsCode: 'b281039012dbd5a808997f9e5a461ed3'
};

import { useEffect, useRef, useState, useCallback } from 'react';
import { message, Spin, Input } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import AMapLoader from '@amap/amap-jsapi-loader';
import type { ChangeEvent } from 'react';
import { loadOsmData } from '../utils/osmLoader';
import type { FeatureCollection } from 'geojson';
import { wgs84togcj02 } from '../utils/coordTransform';

interface AMapProps {
  width?: string | number;
  height?: string | number;
}

type MapPosition = [number, number];

interface AMapError {
  message?: string;
  info?: string;
}

const AMap: React.FC<AMapProps> = ({ width = '100%', height = '400px' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const [containerReady, setContainerReady] = useState(false);
  const [searching, setSearching] = useState(false);
  const [AMapClass, setAMapClass] = useState<any>(null);
  const [placeSearch, setPlaceSearch] = useState<any>(null);
  const [districtLayer, setDistrictLayer] = useState<any[]>([]);
  const [showDistricts, setShowDistricts] = useState(true);

  const showMessage = useCallback((type: 'success' | 'error' | 'warning', content: string) => {
    messageApi[type](content);
  }, [messageApi]);

  // 确保容器已经渲染
  useEffect(() => {
    if (mapRef.current) {
      setContainerReady(true);
    }
  }, []);

  // 初始化地图
  useEffect(() => {
    if (!containerReady) return;

    let map: any = null;
    
    const initMap = async () => {
      try {
        window._AMapSecurityConfig = {
          securityJsCode: AMAP_CONFIG.securityJsCode
        };
        
        console.log('开始加载高德地图...');
        const AMap = await AMapLoader.load({
          key: AMAP_CONFIG.key,
          version: '2.0',
          plugins: ['AMap.PlaceSearch', 'AMap.ToolBar', 'AMap.Scale']
        });
        console.log('高德地图加载完成');

        setAMapClass(AMap);

        if (!mapRef.current) {
          throw new Error('地图容器元素不存在');
        }

        const container = mapRef.current;
        map = new AMap.Map(container, {
          zoom: 11,
          center: [120.153576, 30.287459], // 杭州
          viewMode: '2D',
          features: ['bg', 'point', 'road', 'building'],
          mapStyle: 'amap://styles/normal',
          optimizePanAnimation: true,
          canvas: {
            willReadFrequently: true,
            retina: true
          }
        });
        console.log('地图实例创建成功');

        // 初始化搜索服务
        try {
          console.log('初始化搜索服务...');
          const placeSearchInstance = new AMap.PlaceSearch({
            pageSize: 10,
            extensions: 'all',
            type: '',  // 不限制类型
            citylimit: false,  // 关闭城市限制
            autoFitView: true  // 自动调整视图
          });
          console.log('搜索服务初始化成功');
          setPlaceSearch(placeSearchInstance);
        } catch (error) {
          console.error('搜索服务初始化失败:', error);
          showMessage('error', '搜索服务初始化失败');
        }

        map.on('complete', () => {
          console.log('地图加载完成');
          setMapInstance(map);
          setLoading(false);
        });

        // 添加地图控件
        try {
          const toolBar = new AMap.ToolBar({
            position: 'RB'
          });
          const scale = new AMap.Scale({
            position: 'LB'
          });

          map.addControl(toolBar);
          map.addControl(scale);
          console.log('地图控件添加成功');

          

          // 加载 OSM 数据
          const loadOsmDistricts = async () => {
            try {
              console.log('开始加载街区数据...');
              const osmData = await loadOsmData();
              
              // 创建多边形图层
              const polygons = (osmData as FeatureCollection).features
                .filter((feature: any) => 
                  feature.geometry.type === 'Polygon' || 
                  feature.geometry.type === 'MultiPolygon'
                )
                .map((feature: any) => {
                  const coordinates = feature.geometry.type === 'Polygon' 
                    ? [feature.geometry.coordinates[0]]
                    : feature.geometry.coordinates.map((poly: number[][]) => poly[0]);
                  
                  return coordinates.map((path: number[][]) => {
                    // 根据行政级别设置不同的样式
                    const adminLevel = feature.properties?.['admin_level'] as '7' | '8' | '9';
                    const styles = {
                      '7': { // 区县级
                        strokeWeight: 3,
                        strokeColor: '#e17055',
                        fillColor: '#fab1a0',
                        fillOpacity: 0.1,
                        strokeStyle: 'solid'
                      },
                      '8': { // 街道级
                        strokeWeight: 2,
                        strokeColor: '#00b894',
                        fillColor: '#55efc4',
                        fillOpacity: 0.1,
                        strokeStyle: 'solid'
                      },
                      '9': { // 社区级
                        strokeWeight: 1,
                        strokeColor: '#0984e3',
                        fillColor: '#74b9ff',
                        fillOpacity: 0.1,
                        strokeStyle: 'dashed'
                      }
                    };
                    const style = styles[adminLevel] || styles['9'];

                    return new AMap.Polygon({
                      path: path.map((coord: number[]) => {
                        const [gcjLon, gcjLat] = wgs84togcj02(coord[0], coord[1]);
                        return new AMap.LngLat(gcjLon, gcjLat);
                      }),
                      ...style
                    });
                  });
                })
                .flat();

              console.log(`共加载了 ${polygons.length} 个街区`);
              setDistrictLayer(polygons);
              if (showDistricts) {
                map.add(polygons);
              }
            } catch (error) {
              console.error('加载街区数据失败:', error);
              showMessage('error', '街区数据加载失败');
            }
          };

          loadOsmDistricts();
        } catch (error) {
          console.error('地图控件添加失败:', error);
        }

      } catch (error: any) {
        console.error('地图初始化失败:', error);
        showMessage('error', `地图加载失败: ${error.message || '未知错误'}`);
        setLoading(false);
      }
    };

    initMap();

    // 清理函数
    return () => {
      if (map) {
        map.destroy();
        setMapInstance(null);
        setPlaceSearch(null);
      }
    };
  }, [containerReady, showMessage]);

  const handleSearch = useCallback(async (value: string) => {
    if (!value.trim()) {
      showMessage('warning', '请输入地址');
      return;
    }

    if (!mapInstance || !placeSearch || !AMapClass) {
      console.log('搜索条件检查：', {
        mapInstance: !!mapInstance,
        placeSearch: !!placeSearch,
        AMapClass: !!AMapClass
      });
      showMessage('error', '地图未准备就绪，请稍后重试');
      return;
    }

    setSearching(true);
    console.log('开始搜索地址:', value);

    try {
      placeSearch.search(value, (status: string, result: any) => {
        console.log('搜索回调被触发', { status, result });
        setSearching(false);
        
        if (status === 'complete' && result.poiList && result.poiList.pois && result.poiList.pois.length > 0) {
          const poi = result.poiList.pois[0];
          console.log('找到位置:', poi);

          // 创建标记
          const marker = new AMapClass.Marker({
            position: poi.location,
            title: poi.name
          });

          // 清除之前的标记
          mapInstance.clearMap();
          
          // 添加新标记
          mapInstance.add(marker);
          
          // 设置地图视图
          mapInstance.setZoomAndCenter(15, poi.location);

          showMessage('success', `已定位到: ${poi.name}`);
        } else {
          console.log('未找到地址', { status, result });
          showMessage('warning', '未找到匹配的地址');
        }
      });

    } catch (error) {
      console.error('搜索出错:', error);
      setSearching(false);
      showMessage('error', '搜索失败，请重试');
    }
  }, [mapInstance, placeSearch, AMapClass, showMessage]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  // 切换区域显示
  const toggleDistricts = useCallback(() => {
    if (mapInstance && districtLayer.length > 0) {
      if (showDistricts) {
        mapInstance.remove(districtLayer);
      } else {
        mapInstance.add(districtLayer);
      }
      setShowDistricts(!showDistricts);
    }
  }, [mapInstance, districtLayer, showDistricts]);

  return (
    <div style={{ width, height, position: 'relative' }}>
      {contextHolder}
      <div className="search-container" style={{ 
        position: 'absolute', 
        top: '10px', 
        left: '10px',
        right: '10px',
        zIndex: 100,
        background: 'white',
        padding: '10px',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}>
        <Input.Search
          value={searchValue}
          onChange={handleInputChange}
          onSearch={handleSearch}
          placeholder="请输入详细地址..."
          loading={searching}
          enterButton
        />
      </div>
      <div className="absolute top-4 right-4 z-50 bg-white/90 rounded-lg shadow-md p-1.5 flex gap-1.5">
        <button
          onClick={toggleDistricts}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            showDistricts 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          区域
        </button>
        <button
          className="px-2.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          产业带
        </button>
        <button
          className="px-2.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          覆盖
        </button>
      </div>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          minHeight: '400px',
          background: '#f0f0f0'
        }}
      />
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.8)',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <Spin
            size="large"
            tip="地图加载中..."
          />
        </div>
      )}
    </div>
  );
};

export default AMap;