'use client';

import dynamic from 'next/dynamic';
import { Spin } from 'antd';

// 使用 dynamic 导入，并禁用 SSR
const AMap = dynamic(
  () => import('./components/AMap').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-screen flex items-center justify-center bg-white/80">
        <Spin
          size="large"
          tip="地图加载中..."
          fullscreen
        />
      </div>
    )
  }
);

export default function Home() {
  return (
    <div className="h-screen w-screen relative">
      <AMap height="100%" width="100%" />
    </div>
  );
}