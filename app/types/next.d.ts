import type { ReactNode } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      html: {
        lang?: string;
        children?: ReactNode;
      };
      body: {
        className?: string;
        children?: ReactNode;
      };
      div: {
        className?: string;
        style?: React.CSSProperties;
        ref?: React.RefObject<HTMLDivElement>;
        children?: ReactNode;
      };
    }
  }
} 