"use client";

import { StyleSheetManager } from "styled-components";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Filter out unknown props (like disableTransition) from reaching DOM elements in Studio
  return (
    <StyleSheetManager shouldForwardProp={(prop) => prop !== "disableTransition"}>
      {children}
    </StyleSheetManager>
  );
}
