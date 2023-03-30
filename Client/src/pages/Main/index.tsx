import { TopBar } from "../../components/Navigation/TopBar";
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import MainPicture from "../../assets/images/example_pic_mainpage.png";
import { Alert, Divider, TextField } from "@mui/material";
import { CustomButton } from "../../components/Button/Button";
import { Stack } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/user";
import React, { useRef, FormEvent, FormEventHandler, useState } from "react";
import { getSession } from "../../api/session";
import { getMe } from "../../api/user";
import socket from "../Socket/socket";
import { Room } from "../Lobby";


const TitleText = styled(Typography)``;
const DetailText = styled(Typography)``;

const StyledMainPicture = styled.img`
  width: 50rem;
`;

const StyledTextField = styled(TextField)`
  text-align: center;
`;

const MiddleContent = styled.div`
  padding: 8px;
`;

const SecondContent = styled.div`
  padding-top: 5px;
  padding-bottom: 10px;
`;

const StyledButton = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
`;
interface User {
  id: string;
  name: string;
  email: string;
  roomId: string;
}

export const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");

  const managePublic = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (name === "") {
      alert("Required your nickname.");
    } else if (email === "") {
      alert("Required your email.")
    } else if (!email.includes("@")) {
      alert("Please check your email format again.")
    }
    else {
      socket.emit("register", name, email);
      socket.on("resultRegister", (user) => {
        if (user == 1) {
          alert("Your name is already used.")
        }
        else {
          navigate("/lobby", { state: { user } });
        }
      })

    }
  };

  const managePrivate = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    console.log("Submitted name:", name);
    let user: User;
    let room: Room;
    if (name === "") {
      alert("Required your nickname.");
    } else if (email === "") {
      alert("Required your email.");
    } else if (!email.includes("@")) {
      alert("Please check your email format again.")
    }
    else {
      socket.emit("register", name, email);
      socket.on("resultRegister", (user) => {
        if (user == 1) {
          alert("Your name is already used.")
        }
        else {
          socket.emit("createRoom", user.name + "'s Private Room", true);
          socket.emit("joinRoom", user.roomId);
          socket.on("room", (roomData) => {
            room = roomData;
            console.log(user)
            navigate("/room", { state: { room, user } });
          });
        }
      })
      // socket.on("user", async (data) => {
      //   user = data;
      //   socket.emit("createRoom", user.name + "'s Private Room", true);
      //   socket.emit("joinRoom", user.roomId);
      // });

    }
  };

  const joinByRoomID = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    console.log("Join by roomId:", roomId);
    let user: User;
    let room: Room;
    if (name === "" && email === "") {
      alert("Required your nickname or email.");
    } else {
      if (roomId === "") {
        alert("Required roomID to join");
      } else {
        socket.emit("register", name);
        socket.on("user", async (data) => {
          user = data;
          user.roomId = roomId;
          socket.emit("joinRoom", user.roomId);
        });
        socket.on("room", (roomData) => {
          room = roomData;
          navigate("/room", { state: { room, user } });
        });
      }
    }
  };
  return (
    <>
      <TopBar userState={""} roomState={""} />
      <Body>
        <TitleText style={{ paddingTop: "3rem", fontSize: "2rem" }}>
          Meet new friends and enjoy virtual community space
        </TitleText>
        <DetailText style={{ fontSize: "1.5rem" }}>
          A space to improve everyone's studying and talking!
        </DetailText>
        <StyledMainPicture
          src={MainPicture}
          style={{ padding: "50px", alignSelf: "center" }}
        />

        <MiddleContent>
          <Typography style={{ fontSize: "1.5rem" }}>
            Tell us your information
          </Typography>
          <StyledTextField
            placeholder="Your Nickname"
            value={name}
            onChange={(event) => setName(event.target.value)}
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            style={{
              width: "288px",
              height: "58px",
              paddingTop: "8px",
              paddingBottom: "18px",
            }}
          />
          <StyledTextField
            type={email}
            placeholder="Your E-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            style={{
              width: "288px",
              height: "58px",
              paddingLeft: "10px",
              paddingTop: "8px",
              paddingBottom: "18px",
            }}
          />
        </MiddleContent>

        <Divider variant="middle" />

        <Typography style={{ fontSize: "1.5rem", paddingTop: "20px" }}>
          Join our space now!
        </Typography>
        <SecondContent>
          <StyledButton>
            <Stack direction="row" spacing={20}>
              <CustomButton
                label="Lobby"
                type="submit"
                onClick={managePublic}
              ></CustomButton>
              <CustomButton
                label="Private"
                type="submit"
                onClick={managePrivate}
              ></CustomButton>
            </Stack>
          </StyledButton>
        </SecondContent>

        <Typography style={{ fontSize: "1.5rem" }}>Or</Typography>

        <Stack
          direction="column"
          spacing={0.5}
          justifyContent="center"
          alignItems="center"
          paddingTop="5px"
        >
          <StyledTextField
            placeholder="Join by Room ID"
            value={roomId}
            onChange={(event) => setRoomId(event.target.value)}
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            style={{
              width: "288px",
              height: "58px",
              paddingTop: "8px",
              paddingBottom: "18px",
            }}
          ></StyledTextField>

          <CustomButton
            label="Take me there!"
            type="submit"
            onClick={joinByRoomID}
          ></CustomButton>
        </Stack>
      </Body>
    </>
  );
};
