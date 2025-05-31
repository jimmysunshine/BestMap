declare namespace AMap {
  class Map {
    constructor(container: string | HTMLElement, options: any);
    destroy(): void;
    addControl(control: any): void;
    clearMap(): void;
    add(overlay: any): void;
    setZoomAndCenter(zoom: number, center: [number, number], immediately?: boolean, opts?: any): void;
  }

  class Pixel {
    constructor(x: number, y: number);
  }

  class ToolBar {
    constructor(options?: any);
  }

  class Scale {
    constructor(options?: any);
  }

  class Geolocation {
    constructor(options?: any);
    getCurrentPosition(callback: (status: string, result: any) => void): void;
  }

  class AutoComplete {
    constructor(options?: any);
    search(keyword: string, callback: (status: string, result: any) => void): void;
  }

  class Marker {
    constructor(options: any);
  }
}

interface Window {
  AMap: typeof AMap;
  _AMapSecurityConfig?: {
    securityJsCode: string;
  };
}

interface AMapError {
  info: string;
  message: string;
  type: string;
} 