'use client';

import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: string; // e.g. "1,500+" or "2000" or "5+"
}

export function AnimatedCounter({ value }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Extract number and non-numeric suffixes/prefixes
  const numberMatch = value.match(/\d+([,.]\d+)?/g);
  const rawNumberStr = numberMatch ? numberMatch[0].replace(/,/g, '') : '0';
  const target = parseFloat(rawNumberStr);
  const suffix = value.replace(numberMatch ? numberMatch[0] : '', '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000; // 2 seconds
          const startTime = performance.now();

          const updateCount = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            const current = Math.floor(easeProgress * target);
            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(updateCount);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [target, hasAnimated]);

  // Format with commas if the original had commas
  const formatNumber = (num: number) => {
    if (value.includes(',')) {
      return num.toLocaleString('en-IN');
    }
    return num.toString();
  };

  return (
    <span ref={elementRef}>
      {hasAnimated ? formatNumber(count) : '0'}
      {suffix}
    </span>
  );
}
