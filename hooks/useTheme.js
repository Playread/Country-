import { useContext } from "react";
import { ThemeContext } from "../components/ThemeContexts";

export function useTheme(){
     const [isDark, setIsDark] = useContext(ThemeContext);
     return [isDark, setIsDark]
}