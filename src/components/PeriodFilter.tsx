"use client";

import { periods } from "@/data/events";

interface PeriodFilterProps {
  activePeriods: number[];
  onTogglePeriod: (periodId: number) => void;
}

export default function PeriodFilter({
  activePeriods,
  onTogglePeriod,
}: PeriodFilterProps) {
  return (
    <div className="period-filter">
      {periods.map((period) => (
        <button
          key={period.id}
          className={`period-filter-btn ${
            activePeriods.includes(period.id) ? "active" : ""
          }`}
          style={
            activePeriods.includes(period.id)
              ? { borderColor: period.color, color: period.color }
              : {}
          }
          onClick={() => onTogglePeriod(period.id)}
          title={period.description}
        >
          GĐ {period.id}
        </button>
      ))}
    </div>
  );
}
