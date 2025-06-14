'use client';

import { ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';
import React from 'react';

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#00b96b',
  },
};

export default function ThemeProvider({
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