"use client";

import { ChakraProvider, defaultSystem, ClientOnly } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";

export function Provider(props: React.PropsWithChildren) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ClientOnly>
        <ColorModeProvider {...props} forcedTheme="light" />
      </ClientOnly>
    </ChakraProvider>
  );
}
