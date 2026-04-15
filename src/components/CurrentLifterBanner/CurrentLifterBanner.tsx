import {
  Attempt,
  AttemptNumber,
  LifterAttempts,
  LiftName,
  Lifter,
  MeetApiResponse,
} from "../../types";
import { first, last, sortBy } from "lodash";
import classNames from "classnames";
import "./CurrentLifterBanner.css";
import React from "react";
import logo from "/logo.png";

// @ts-expect-error types are not working for react-fitty
import { ReactFitty } from "react-fitty";

export const CurrentLifterBanner = ({
  data,
  platformId,
}: {
  data: MeetApiResponse;
  platformId: string;
}) => {
  const platform = data?.platforms?.[platformId];
  const lifters = data.lifters;
  const divisions = data.divisions;

  if (!platform || !lifters || !divisions) {
    return null;
  }

  const currentAttempt = platform.currentAttempt ?? null;
  const currentLifterId = currentAttempt?.lifter.id;
  const currentLifter =
    currentLifterId && lifters[currentLifterId]
      ? (lifters[currentLifterId] ?? null)
      : null;
  const firstLifterDivision = first(currentLifter?.divisions);
  const firstDivisionId = firstLifterDivision?.divisionId;
  const firstDivision =
    firstDivisionId && divisions ? divisions[firstDivisionId] : null;
  const firstWeightClassId = firstLifterDivision?.weightClassId;
  const firstWeightClass = firstWeightClassId
    ? firstDivision?.weightClasses[firstWeightClassId]
    : null;

  return (
    <div className="current-lifter-banner">
      <div className="current-lifter-banner-column-one">
        <img src={logo} className="logo" alt="logo" />
      </div>
      <div className="current-lifter-banner-column-two">
        <div className="current-lifter-banner-name-last-name">
          <AutoSize>
            {currentLifter?.name
              ? currentLifter.name.includes(" ")
                ? currentLifter.name.substring(
                    currentLifter.name.lastIndexOf(" ") + 1,
                  )
                : currentLifter.name
              : null}
          </AutoSize>
        </div>
        <div className="current-lifter-banner-name-first-name">
          <AutoSize>
            {currentLifter?.name?.includes(" ")
              ? currentLifter.name.substring(
                  0,
                  currentLifter.name.lastIndexOf(" "),
                )
              : null}
            {!!currentLifter?.team && ` : ${currentLifter.team}`}
          </AutoSize>
        </div>

        {firstDivision && firstWeightClass && (
          <div className="current-lifter-banner-category">
            <AutoSizeSmall>
              {firstDivision?.name} {firstWeightClass?.name}
            </AutoSizeSmall>
          </div>
        )}
      </div>
      <div className="current-lifter-banner-column-three">
        <div className="current-lifter-banner-attempts">
          <Attempts currentAttempt={currentAttempt} lifter={currentLifter} />
        </div>
      </div>
      <div className="current-lifter-banner-column-four" key={currentLifterId}>
        <CurrentPlace data={data} platformId={platformId} />
      </div>
      <div className="current-lifter-banner-column-five">
        <BestLifts lifter={currentLifter} />
      </div>
      <div className="current-lifter-banner-bottom-row"></div>
    </div>
  );
};

const AutoSize = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactFitty minSize={8} maxSize={20} wrapText={false}>
      {children}
    </ReactFitty>
  );
};

const AutoSizeSmall = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactFitty minSize={6} maxSize={16} wrapText={false}>
      {children}
    </ReactFitty>
  );
};

const AttemptCell = ({
  liftName,
  attemptNumber,
  isCurrent,
  lifter,
}: {
  liftName: LiftName | undefined;
  attemptNumber: AttemptNumber | undefined;
  isCurrent: boolean;
  lifter: Lifter | null;
}) => {
  const attempt =
    lifter && liftName && attemptNumber
      ? lifter.lifts[liftName][attemptNumber]
      : null;
  return (
    <div className="current-lifter-banner-attempt-wrapper">
      <div
        className={classNames(
          "current-lifter-banner-attempt",
          isCurrent && "current-lifter-banner-attempt-current",
          attempt?.result === "good" && "current-lifter-banner-attempt-good",
          attempt?.result === "bad" && "current-lifter-banner-attempt-bad",
        )}
      >
        {attempt?.weight}
      </div>
      <div
        className={classNames(
          "attempt-card",
          isCurrent && "attempt-card-white",
          attempt?.result === "good" && "attempt-card-green",
          attempt?.result === "bad" && "attempt-card-red",
        )}
      />
    </div>
  );
};

const Attempts = ({
  currentAttempt,
  lifter,
}: {
  currentAttempt: Attempt | null;
  lifter: Lifter | null;
}) => {
  return (
    <>
      <AttemptCell
        isCurrent={currentAttempt?.attemptNumber === "1"}
        liftName={currentAttempt?.liftName}
        attemptNumber="1"
        lifter={lifter}
      />
      <AttemptCell
        isCurrent={currentAttempt?.attemptNumber === "2"}
        liftName={currentAttempt?.liftName}
        attemptNumber="2"
        lifter={lifter}
      />
      <AttemptCell
        isCurrent={currentAttempt?.attemptNumber === "3"}
        liftName={currentAttempt?.liftName}
        attemptNumber="3"
        lifter={lifter}
      />
    </>
  );
};

const CurrentPlace = ({
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

  let currentPlaceText = currentPlace.toString();
  switch (currentPlaceText) {
    case "1":
      currentPlaceText = "1st";
      break;
    case "2":
      currentPlaceText = "2nd";
      break;
    case "3":
      currentPlaceText = "3rd";
      break;
    default:
      currentPlaceText = `${currentPlace}th`;
  }

  return <div className="current-place">{currentPlaceText}</div>;
};

const getBestLift = (attempts: LifterAttempts): number | null => {
  return (
    last(
      sortBy(
        Object.values(attempts).filter((a) => a.weight && a.result === "good"),
        (a) => a.weight,
      ),
    )?.weight ?? null
  );
};

export const BestLifts = ({ lifter }: { lifter: Lifter | null }) => {
  if (!lifter) return null;

  const bestSquat = getBestLift(lifter.lifts.squat);
  const bestBench = getBestLift(lifter.lifts.bench);
  const bestDead = getBestLift(lifter.lifts.dead);

  return (
    <div className="best-lifts">
      <div className="best-lifts-row">
        <span className="best-lifts-label">S</span>
        <span className="best-lifts-value">{bestSquat ?? "-"}</span>
      </div>
      <div className="best-lifts-row">
        <span className="best-lifts-label">B</span>
        <span className="best-lifts-value">{bestBench ?? "-"}</span>
      </div>
      <div className="best-lifts-row">
        <span className="best-lifts-label">D</span>
        <span className="best-lifts-value">{bestDead ?? "-"}</span>
      </div>
    </div>
  );
};
