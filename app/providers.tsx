'use client';

import { ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';
import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';

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
  const cache = React.useMemo(() => createCache(), []);

  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ));

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider theme={themeConfig}>
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}