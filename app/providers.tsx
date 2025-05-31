'use client';

import { ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';
import React from 'react';

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#00b96b',
  },
};

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider theme={themeConfig}>
      {children}
    </ConfigProvider>
  );
} 