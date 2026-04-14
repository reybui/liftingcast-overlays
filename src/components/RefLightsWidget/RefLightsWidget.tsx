import { MeetApiResponse, RefLight, RefLights } from "../../types";
import { every } from "lodash";
import classNames from "classnames";
import React from "react";
import "./RefLightsWidget.css";

// Optional delay when turning lights off so they stay on long enough to read.
const lightsOffDelaySeconds = import.meta.env
  .VITE_LIFTINGCAST_LIGHTS_OFF_DELAY_SECONDS as string | undefined;

export const RefLightsWidget = ({
  data,
  platformId,
}: {
  data: MeetApiResponse;
  platformId: string;
}) => {
  const platform = data?.platforms?.[platformId];

  if (!platform) return null;

  return <Lights refLights={platform.refLights} />;
};

const Lights = ({ refLights }: { refLights: RefLights }) => {
  const [refLightsInternal, setRefLightsInternal] =
    React.useState<RefLights>(refLights);

  React.useEffect(() => {
    const allSelectedCurrent = every(
      refLights,
      (rl) => rl.decision === "good" || rl.decision === "bad",
    );

    const allSelectedPrevious = every(
      refLightsInternal,
      (rl) => rl.decision === "good" || rl.decision === "bad",
    );
    if (allSelectedPrevious && !allSelectedCurrent) {
      setTimeout(
        () => setRefLightsInternal(refLights),
        Number(lightsOffDelaySeconds ?? "0") * 1000,
      );
    } else {
      setRefLightsInternal(refLights);
    }
  }, [refLights, refLightsInternal]);

  return (
    <div className="ref-lights-widget">
      <Light refLight={refLightsInternal.left} refLights={refLightsInternal} />
      <Light refLight={refLightsInternal.head} refLights={refLightsInternal} />
      <Light refLight={refLightsInternal.right} refLights={refLightsInternal} />
      <div className="ref-lights-widget-cards">
        <Card refLight={refLightsInternal.left} refLights={refLightsInternal} />
        <Card refLight={refLightsInternal.head} refLights={refLightsInternal} />
        <Card
          refLight={refLightsInternal.right}
          refLights={refLightsInternal}
        />
      </div>
    </div>
  );
};

const Light = ({
  refLight,
  refLights,
}: {
  refLight: RefLight;
  refLights: RefLights;
}) => {
  const allSelected = every(
    refLights,
    (rl) => rl.decision === "good" || rl.decision === "bad",
  );

  return (
    <div
      className={classNames(
        "ref-lights-widget-light",
        allSelected &&
          refLight.decision === "bad" &&
          "ref-lights-widget-light-red",
        allSelected &&
          refLight.decision === "good" &&
          "ref-lights-widget-light-white",
        !allSelected && "ref-lights-widget-light-off",
      )}
    ></div>
  );
};

const Card = ({
  refLight,
  refLights,
}: {
  refLight: RefLight;
  refLights: RefLights;
}) => {
  const allSelected = every(
    refLights,
    (rl) => rl.decision === "good" || rl.decision === "bad",
  );

  return (
    <div
      className={classNames(
        "card",
        allSelected && refLight.cards?.red && "card-red",
        allSelected && refLight.cards?.blue && "card-blue",
        allSelected && refLight.cards?.yellow && "card-yellow",
      )}
    ></div>
  );
};
