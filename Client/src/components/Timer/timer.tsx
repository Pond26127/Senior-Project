import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import { CustomButton } from "../../components/Button/Button";

const START_MINUTES = "20";
const START_SECOND = "00";
const START_DURATION = 10;

const TimerTopContent = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0px;
`;

const TimerBottomContent = styled.div`
  display: flex;
  justify-content: center;
`;

export default function TimerComponent() {
  const [currentMinutes, setMinutes] = useState(START_MINUTES);
  const [currentSeconds, setSeconds] = useState(START_SECOND);
  const [isStop, setIsStop] = useState(false);
  const [duration, setDuration] = useState(START_DURATION);
  const [isRunning, setIsRunning] = useState(false);

  const startHandler = () => {
    setDuration(parseInt(START_SECOND, 10) + 60 * parseInt(START_MINUTES, 10));
    // setMinutes(60 * 5);
    // setSeconds(0);
    setIsRunning(true);
  };
  const stopHandler = () => {
    // stop timer
    setIsStop(true);
    setIsRunning(false);
  };
  const resetHandler = () => {
    setMinutes(START_MINUTES);
    setSeconds(START_SECOND);
    setIsRunning(false);
    setIsStop(false);
    setDuration(START_DURATION);
  };

  const resumeHandler = () => {
    let newDuration =
      parseInt(currentMinutes, 10) * 60 + parseInt(currentSeconds, 10);
    setDuration(newDuration);

    setIsRunning(true);
    setIsStop(false);
  };

  useEffect(() => {
    if (isRunning === true) {
      let timer = duration;
      var minutes, seconds;
      const interval = setInterval(function () {
        if (--timer <= 0) {
          resetHandler();
        } else {
          minutes = parseInt(String(timer / 60), 10);
          seconds = parseInt(String(timer % 60), 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          setMinutes(String(minutes));
          setSeconds(String(seconds));
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return (
    <Fragment>
      <TimerTopContent>
        <Typography variant="h3" color="#959595">
          {currentMinutes}:{currentSeconds}
        </Typography>
      </TimerTopContent>

      <TimerBottomContent>
        <Stack direction="row" spacing={1}>
          {!isRunning && !isStop && (
            <CustomButton label="Start" onClick={startHandler}></CustomButton>
          )}
          {isRunning && <CustomButton label="Stop" onClick={stopHandler} />}

          {isStop && <CustomButton label="Resume" onClick={resumeHandler} />}

          <CustomButton
            label="Reset"
            onClick={resetHandler}
            disabled={!isRunning && !isStop}
            secondary={!isRunning && !isStop}
          />
        </Stack>
      </TimerBottomContent>
    </Fragment>
  );
}
