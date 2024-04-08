import { useEffect, useState } from "react";

/**
 * Custom hook that returns the current width of the window and updates it on resize.
 *
 * @return {number} The current width of the window.
 */
export const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width;
};
