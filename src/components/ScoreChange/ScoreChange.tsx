import "./ScoreChange.css";
import { MeetApiResponse } from "../../types";
import { round } from "lodash";

export const ScoreChange = ({
  data,
  platformId,
}: {
  data: MeetApiResponse;
  platformId: string;
}) => {
  return (
    <div className="score-change">
      <ScoreChangeInner data={data} platformId={platformId} />
    </div>
  );
};

const ScoreChangeInner = ({
  data,
  platformId,
}: {
  data: MeetApiResponse;
  platformId: string;
}) => {
  const platform = data?.platforms?.[platformId];
  const currentAttempt = platform?.currentAttempt;
  if (!currentAttempt) {
    return null;
  }
  const currentLifterId = currentAttempt?.lifter.id;

  const divisions = data.lifters?.[currentLifterId]?.divisions;
  if (!divisions || !divisions.length) {
    return null;
  }

  const firstLifterDivision = divisions[0];
  const firstDivisionId = firstLifterDivision?.divisionId;
  if (!firstDivisionId) {
    return null;
  }

  const currentScore = firstLifterDivision?.score;
  if (!currentScore) {
    return null;
  }

  const firstDivision = data.divisions?.[firstDivisionId];

  const units =
    firstDivision?.scoreBy === "Percent of record"
      ? "%"
      : firstDivision?.scoreBy === "Total"
        ? data.units
        : "";

  const roundedCurrentScore =
    typeof currentScore === "string" ? currentScore : round(currentScore);

  const possibleScore = currentAttempt.ifSuccessfulScores
    ? currentAttempt.ifSuccessfulScores[firstDivisionId]
    : null;

  if (!possibleScore) {
    return <div>{roundedCurrentScore}</div>;
  }

  const roundedPossibleScore =
    typeof possibleScore === "string" ? possibleScore : round(possibleScore);

  return (
    <div className="score-change-inner">
      {/* {roundedCurrentScore} {units}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon"
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
      </svg> */}
      {roundedPossibleScore} {units}
    </div>
  );
};
