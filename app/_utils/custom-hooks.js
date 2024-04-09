import { useLayoutEffect, useState } from "react";

/**
 * Custom hook that returns the current width of the window and updates it on resize.
 *
 * @return {number} The current width of the window.
 */
export const useWindowWidth = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useLayoutEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width;
};
