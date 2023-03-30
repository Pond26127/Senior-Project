import { IconButton, Typography } from "@mui/material";
import styled from "styled-components";
import { Header } from "../Layout";
import React, { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import socket from "../../pages/Socket/socket";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

const Bar = styled.div`
  padding: 0.5rem 5.3rem;
  box-shadow: 0 0.2rem 1.6rem 0 rgba(0, 0, 0, 0.06);
  background-color: #ffffff;
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  box-sizing: border-box;
  font-weight: bold;
`;

const StyledLeftSideWrapper = styled.div`
  marginLeft: 10rem;
`;
interface TopBarProps {
  userState: any;
  roomState: any;
  userCount?: number;
  location?: any;
}
export const TopBar: React.FC<TopBarProps> = ({ userState, roomState, userCount, ...props }) => {
  const navigate = useNavigate();
  const user = userState;

 const handleLeaveRoom = (event: React.MouseEvent<HTMLElement>) => {
    socket.emit('leaveRoom' , "a");
    console.log("Leaving room...");
    navigate("/lobby", { state: { user } });
 }

 const handleRedirect = (event: React.MouseEvent<HTMLElement>) => {
  navigate("/");
 }

  return (
    <Header>
      <Wrapper>
        <Bar>
          {roomState.id ? (
            <>
              <Typography
                style={{
                  fontSize: "1rem",
                  color: "#959595",
                  width: "100%",
                  display: "flex",
                }}
              >
                {roomState.name} : {roomState.id}
              </Typography>
              <StyledLeftSideWrapper>
                <IconButton onClick={ handleLeaveRoom }>
                  <LogoutIcon></LogoutIcon>
                </IconButton>
              </StyledLeftSideWrapper>
            </>
          ) : (
            <Typography
              style={{
                fontSize: "1rem",
                color: "#959595",
                width: "100%",
                display: "flex",
              }}
               onClick={handleRedirect}
            >
              Virtual Co-Working Space   |   Welcome! {user.name}
            </Typography>
          )}


        </Bar>
      </Wrapper>
    </Header>
  );
};
