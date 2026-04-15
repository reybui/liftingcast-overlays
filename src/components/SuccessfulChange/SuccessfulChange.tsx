import "./SuccessfulChange.css";
import { MeetApiResponse } from "../../types";
import { PlaceChange } from "../PlaceChange/PlaceChange";
import { ScoreChange } from "../ScoreChange/ScoreChange";

export const SuccessfulChange = ({
  data,
  platformId,
}: {
  data: MeetApiResponse;
  platformId: string;
}) => {
  const platform = data?.platforms?.[platformId];
  const currentAttempt = platform?.currentAttempt ?? null;
  const liftName = currentAttempt?.liftName ?? null;
  let totalType = null;

  switch (liftName) {
    case "bench":
      totalType = "SUBTOTAL";
      break;
    case "dead":
      totalType = "TOTAL";
      break;
    default:
      totalType = null;
  }

  return (
    <div className="successful-change">
      <div className="successful-change-title">IF SUCCESSFUL</div>
      <div className="successful-change-rank">
        <span className="text-change-place">RANK</span>
        <PlaceChange data={data} platformId={platformId} />
      </div>
      {totalType && (
        <div className="successful-change-score">
          <span className="text-change-place">{totalType}</span>
          <ScoreChange data={data} platformId={platformId} />
        </div>
      )}
    </div>
  );
};
