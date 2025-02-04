import { useEffect, useState } from "react";

export function useWindowsize(){
    const [windowSize, setWindowSize] = useState({
        windowSize: window.width,
        windowSize: window.height,
      });
    
      useEffect(() => {
        window.addEventListener("resize", () => {});
        setWindowSize({
          windowSize: window.width,
          windowSize: window.height,
        });
      }, []);

      return windowSize
}