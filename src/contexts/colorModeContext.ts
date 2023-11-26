import { createContext } from "react";

const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export default ColorModeContext;
