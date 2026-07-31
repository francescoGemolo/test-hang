import { useEffect, useRef, useState } from 'react';

export function useScrollFab() {
  const [isActive, setIsActive] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const resetTimeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;

      setIsActive(true);
      setIsHidden(scrollingDown && currentScrollY > 80);
      lastScrollY.current = currentScrollY;

      window.clearTimeout(resetTimeout.current);
      resetTimeout.current = window.setTimeout(() => {
        setIsActive(false);
        setIsHidden(false);
      }, 600);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(resetTimeout.current);
    };
  }, []);

  return { isActive, isHidden };
}