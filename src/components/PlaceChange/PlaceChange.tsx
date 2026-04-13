import "./PlaceChange.css";
import { MeetApiResponse } from "../../types";

export const PlaceChange = ({
  data,
  platformId,
}: {
  data: MeetApiResponse;
  platformId: string;
}) => {
  return (
    <div className="place-change">
      <PlaceChangeInner data={data} platformId={platformId} />
    </div>
  );
};

const PlaceChangeInner = ({
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

  const firstDivision = divisions[0];
  const firstDivisionId = firstDivision?.divisionId;
  if (!firstDivisionId) {
    return null;
  }

  const currentPlace = firstDivision?.place;
  if (!currentPlace) {
    return null;
  }

  const possiblePlace = currentAttempt.ifSuccessfulPlaces
    ? currentAttempt.ifSuccessfulPlaces[firstDivisionId]
    : null;

  if (!possiblePlace) {
    return <div>{currentPlace}</div>;
  }

  return (
    <div className="place-change-inner">
      {currentPlace}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon"
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
      </svg>
      {possiblePlace}
    </div>
  );
};
