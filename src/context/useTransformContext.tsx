'use client';

import React, { createContext, useRef, useState } from 'react';
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch';

interface TransformContextType {
  transformWrapperRef: React.MutableRefObject<ReactZoomPanPinchRef | null> | null;
  handleZoomChange: (scale: number) => void;
  isPanning: boolean;
  setPanning: (isPanning: boolean) => void;
}

const TransformContext = createContext<TransformContextType | null>(null);

{
  /* react-zoom-pan-pinch 라이브러리 커스텀 */
}
export const TransformProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                             children,
                                                                           }) => {
  const transformWrapperRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [isPanning, setPanning] = useState(false);

  const handleZoomChange = (scale: number) => {
    // console.log(`Zoom changed to ${scale}`);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey) {

    } else {
      // ctrl 키가 눌려 있으면 zoom 기능을 트리거하도록 합니다.
      if (transformWrapperRef.current) {
        const { zoomIn, zoomOut } = transformWrapperRef.current;
        if (event.deltaY < 0) {
          zoomIn();
        } else {
          zoomOut();
        }
      }
    }
  };

  return (
    <TransformContext.Provider
      value={{
        transformWrapperRef,
        handleZoomChange,
        isPanning,
        setPanning,
      }}
    >
      <TransformWrapper
        ref={transformWrapperRef}
        wheel={{
          step: 0.1,
          wheelDisabled: true, // 기본 휠 줌 비활성화
        }}
        doubleClick={{ mode: 'reset' }}
        initialScale={1}
        maxScale={3}
        minScale={0.55}
        centerOnInit
        panning={{ disabled: !isPanning }}
        onZoomStop={(ref) => handleZoomChange(ref.state.scale)}
      >
        <div
          onWheel={(event) => handleWheel(event)}
          style={{
            width: '100vw',
            height: '100vh',
            position: 'relative',
          }}
        >
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: '100%',
            }}
          >
            {children}
          </TransformComponent>
        </div>
      </TransformWrapper>
    </TransformContext.Provider>
  );
};
