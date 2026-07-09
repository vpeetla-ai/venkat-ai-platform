"use client";

import Link from "next/link";
import { PlatformArchitecturePanel } from "@/components/portfolio/PlatformArchitecturePanel";
import { ProductWorkbench } from "@/components/portfolio/ProductWorkbench";

export default function DashboardPage() {
  return (
    <ProductWorkbench
      eyebrow="Operations dashboard"
      productName="Platform metrics"
      subtitle="Workflow runs, latency, and error signals from the Render API — wire Langfuse for deeper traces."
      headerActions={
        <Link href="/monitor" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Workflow monitor
        </Link>
      }
      productPanel={
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: "Agent executions / day", value: "—" },
            { label: "Average latency", value: "—" },
            { label: "Error rate", value: "—" },
            { label: "Est. token cost", value: "—" },
          ].map((tile) => (
            <div key={tile.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{tile.label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900">{tile.value}</p>
            </div>
          ))}
        </div>
      }
      architecturePanel={<PlatformArchitecturePanel />}
    />
  );
}
