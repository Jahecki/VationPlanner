// plik: src/components/Providers.tsx (lub app/Providers.tsx)
"use client";

import { SessionProvider } from "next-auth/react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
