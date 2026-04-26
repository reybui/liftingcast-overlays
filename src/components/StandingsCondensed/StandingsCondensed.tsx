import { first, round, sortBy, take } from "lodash";
import { MeetApiResponse } from "../../types";
import "./StandingsCondensed.css";
import React, { useEffect } from "react";

// @ts-expect-error types are not working for react-fitty
import { ReactFitty } from "react-fitty";

export const StandingsCondensed = ({
  data,
  platformId,
}: {
  data: MeetApiResponse;
  platformId: string;
}) => {
  const divisionOptions = sortBy(
    Object.values(data.divisions ?? {}).map((d) => ({
      label: d.name,
      value: d.id,
    })),
    "label",
  );

  const [selectedDivisionId, setSelectedDivisionId] = React.useState<
    string | null
  >(first(divisionOptions)?.value ?? null);

  const selectedDivision =
    selectedDivisionId && data.divisions
      ? data.divisions[selectedDivisionId]
      : null;

  const weightClassOptions = sortBy(
    Object.keys(selectedDivision ? selectedDivision.weightClasses : []).map(
      (wId) => ({
        label: selectedDivision?.weightClasses[wId]?.name ?? "",
        value: wId,
      }),
    ),
    (w) => Number(w.label),
  );

  const [selectedWeightClassId, setSelectedWeightClassId] = React.useState(
    selectedDivision ? first(weightClassOptions)?.value : null,
  );

  const selectedWeightClass =
    selectedDivision && selectedWeightClassId
      ? selectedDivision.weightClasses[selectedWeightClassId]
      : null;

  const currentAttempt = data.platforms?.[platformId]?.currentAttempt;
  const currentLifterId = currentAttempt?.lifter.id;
  const currentLifterDivision = first(
    data.lifters?.[currentLifterId ?? ""]?.divisions,
  );

  useEffect(() => {
    if (currentLifterDivision?.divisionId) {
      setSelectedDivisionId(currentLifterDivision.divisionId);
      setSelectedWeightClassId(currentLifterDivision.weightClassId ?? null);
    }
  }, [
    currentLifterId,
    currentLifterDivision?.divisionId,
    currentLifterDivision?.weightClassId,
  ]);

  const scoreBy = selectedDivision?.scoreBy
    ? selectedDivision.scoreBy.replace("Points", "")
    : null;

  const topLifters = useCategoryRankings({
    divisionId: selectedDivisionId,
    weightClassId: selectedWeightClassId ?? null,
    maxRows: 10,
    data,
  });

  return (
    <div className="standings-condensed">
      <div className="standings-condensed-config-bar">
        <div>
          <div>Division</div>
          <select
            onChange={(e) => {
              const newDivisionId = e.target.value;
              setSelectedDivisionId(newDivisionId);
              const newDivision =
                newDivisionId && data.divisions
                  ? data.divisions[newDivisionId]
                  : null;
              setSelectedWeightClassId(
                newDivision
                  ? first(Object.keys(newDivision.weightClasses))
                  : null,
              );
            }}
          >
            {divisionOptions.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div>Weight Class</div>
          <select onChange={(e) => setSelectedWeightClassId(e.target.value)}>
            {weightClassOptions.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="standings-condensed-category-name">
        Forecasted {selectedDivision?.name} {selectedWeightClass?.name}{" "}
        LEADERBOARD
      </div>
      <div>
        <div className="standings-condensed-row">
          <div className="standings-condensed-item"></div>
          <div className="standings-condensed-item">(IF ALL LIFTS MADE)</div>
          <div className="standings-condensed-item">Bodyweight</div>
          <div className="standings-condensed-item">{scoreBy}</div>
        </div>
        {topLifters.map((l) => {
          const place = l.selectedDivision?.forecastedPlace;
          const score = l.selectedDivision?.forecastedScore;
          return (
            <div key={l.id} className="standings-condensed-row">
              <div className="standings-condensed-item">{place || "-"}</div>
              <div className="standings-condensed-item">
                <AutoSize>{l.name}</AutoSize>
              </div>
              <div className="standings-condensed-item">
                {l.bodyWeight ?? "-"}
              </div>
              <div className="standings-condensed-item">
                {score ? round(Number(score), 2) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const useCategoryRankings = ({
  data,
  maxRows,
  divisionId,
  weightClassId,
}: {
  data: MeetApiResponse;
  maxRows: number;
  divisionId: string | null;
  weightClassId: string | null;
}) => {
  const lifters = data.lifters;
  if (!lifters) return [];

  const allLiftersInSelectedCategory = Object.values(lifters)
    .filter((l) =>
      l.divisions.some(
        (ld) =>
          ld.divisionId === divisionId && ld.weightClassId === weightClassId,
      ),
    )
    .map((l) => ({
      ...l,
      selectedDivision: l.divisions.find(
        (ld) =>
          ld.divisionId === divisionId && ld.weightClassId === weightClassId,
      ),
    }));

  return take(
    sortBy(
      allLiftersInSelectedCategory,
      (l) => l.selectedDivision?.forecastedPlace,
    ),
    maxRows,
  );
};

const AutoSize = ({ children }: { children: React.ReactNode }) => (
  <ReactFitty minSize={8} maxSize={16} wrapText={false}>
    {children}
  </ReactFitty>
);
