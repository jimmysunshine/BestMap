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

interface AMapProps {
  width?: string | number;
  height?: string | number;
}

type Position = [number, number];

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
          viewMode: '2D'
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