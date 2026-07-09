"use client";

import { ArchitectOverview } from "@/components/portfolio/ArchitectOverview";
import { VAP_ARCHITECTURE_PROPS } from "@/lib/platform-workbench";

export function PlatformArchitecturePanel() {
  return <ArchitectOverview {...VAP_ARCHITECTURE_PROPS} />;
}
