'use client';

import type React from 'react';
import { StyleSheetManager } from 'styled-components';

export function StyledSheetWrapper({ children }: { children: React.ReactNode }) {
  return (
    <StyleSheetManager
      shouldForwardProp={(prop) => prop !== 'disableTransition' && prop !== 'disabletransition'}
    >
      {children}
    </StyleSheetManager>
  );
}

export default StyledSheetWrapper;
