"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";
import { PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DataCard, DataCardSkeleton } from "@/components/data-card";

export const DataGrid = () => {
  const { data, isLoading } = useGetSummary();

  const params = useSearchParams();
  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;

  const dateRangeLabel = formatDateRange({ to, from });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
        <DataCardSkeleton />;
        <DataCardSkeleton />;
        <DataCardSkeleton />;
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      {dateRangeLabel}
      <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={PiggyBank}
        dateRange={dateRangeLabel}
        variant={"default"}
      />
      <DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={TrendingUp}
        dateRange={dateRangeLabel}
        variant={"success"}
      />
      <DataCard
        title="Expenses"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={TrendingDown}
        dateRange={dateRangeLabel}
        variant={"danger"}
      />
    </div>
  );
};
