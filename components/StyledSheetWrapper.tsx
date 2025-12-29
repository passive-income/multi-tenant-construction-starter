"use client";

import React from "react";
import { StyleSheetManager } from "styled-components";

export function StyledSheetWrapper({ children }: { children: React.ReactNode }) {
  return (
    <StyleSheetManager shouldForwardProp={(prop) => prop !== "disableTransition"}>
      {children}
    </StyleSheetManager>
  );
}

export default StyledSheetWrapper;
