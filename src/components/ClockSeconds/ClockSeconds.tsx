import "./ClockSeconds.css";
import { MeetApiResponse } from "../../types";
import React from "react";
import { max } from "lodash";

const CLOCK_LATENCY_MS = 400;

export const ClockSeconds = ({
  data,
  platformId,
  latency,
}: {
  data: MeetApiResponse;
  platformId: string;
  latency: number;
}) => {
  const platform = data?.platforms?.[platformId];
  const clockTimerLength = platform?.clockTimerLength ?? 60000;
  const clockState = platform?.clockState;
  const previousClockState = React.useRef(clockState);
  const [timeRemaining, setTimeRemaining] = React.useState(clockTimerLength);
  const [clockStartedAt, setClockStartedAt] = React.useState<number | null>(
    null
  );

  React.useEffect(() => {
    if (previousClockState.current === "initial" && clockState === "started") {
      setClockStartedAt(Date.now() - CLOCK_LATENCY_MS - latency);
      previousClockState.current = clockState;
    } else if (clockState === "initial") {
      setClockStartedAt(null);
      setTimeRemaining(clockTimerLength);
      previousClockState.current = clockState;
    }
  }, [clockState, clockTimerLength, latency]);

  React.useEffect(() => {
    let timerId = null;
    if (clockStartedAt) {
      timerId = setInterval(() => {
        const clockRunningForMs = Date.now() - clockStartedAt;
        const time = max([clockTimerLength - clockRunningForMs, 0]);
        if (time) {
          setTimeRemaining(time);
        }
      }, 100);
    }

    return () => {
      timerId && clearInterval(timerId);
    };
  }, [clockStartedAt, clockTimerLength]);

  return <div className="clock-seconds">{formatSeconds(timeRemaining)}</div>;
};

const formatSeconds = (d: number) => {
  const totalSeconds = Math.ceil(d / 1000);
  return `${totalSeconds}`;
};
