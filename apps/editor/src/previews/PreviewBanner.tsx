/**
 * PreviewBanner —— 编辑器画布中的轮播图预览组件
 *
 * 纯 HTML/CSS + React 实现的轮播预览，不依赖 Taro Stencil Web Components。
 * 支持自动轮播、指示点、圆角等可视化效果，与真实小程序端 Swiper 外观一致。
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface BannerItem {
  imageUrl: string;
  linkUrl?: string;
  alt?: string;
}

interface Props {
  items?: BannerItem[];
  height?: string;
  autoplay?: boolean;
  interval?: number;
  duration?: number;
  circular?: boolean;
  indicatorDots?: boolean;
  indicatorColor?: string;
  indicatorActiveColor?: string;
  borderRadius?: string;
}

export const PreviewBanner: React.FC<Props> = ({
  items = [],
  height = '200px',
  autoplay = true,
  interval = 3000,
  duration = 500,
  circular = true,
  indicatorDots = true,
  indicatorColor = 'rgba(255, 255, 255, 0.4)',
  indicatorActiveColor = '#ffffff',
  borderRadius = '0',
}) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = items.length;

  // 自动轮播
  useEffect(() => {
    if (!autoplay || total <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        if (prev >= total - 1) {
          return circular ? 0 : prev;
        }
        return prev + 1;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplay, interval, total, circular]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  // 空状态
  if (total === 0) {
    return (
      <div
        style={{
          width: '100%',
          height,
          borderRadius,
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: 14,
          border: '1px dashed #d9d9d9',
        }}
      >
        🖼️ 请配置轮播图片
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius,
        overflow: 'hidden',
      }}
    >
      {/* 滑动容器 */}
      <div
        style={{
          display: 'flex',
          width: `${total * 100}%`,
          height: '100%',
          transform: `translateX(-${(current / total) * 100}%)`,
          transition: `transform ${duration}ms ease`,
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              flex: `0 0 ${100 / total}%`,
              height: '100%',
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.alt ?? `banner-${index}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        ))}
      </div>

      {/* 指示点 */}
      {indicatorDots && total > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {items.map((_, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goTo(index);
              }}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background:
                  index === current ? indicatorActiveColor : indicatorColor,
                cursor: 'pointer',
                transition: 'background .2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
