import { TopBar } from "../../components/Navigation/TopBar";
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import MainPicture from "../../assets/images/example_pic_mainpage.png";
import { Alert, } from "@mui/material";
import { CustomButton } from "../../components/Button/Button";
import { Stack } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/user";
import React, { useRef, FormEvent, FormEventHandler, useState } from "react";
import { getSession } from "../../api/session";
import { getMe } from "../../api/user";
import socket from "../Socket/socket";
import { Room } from "../Lobby";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, TextField } from "@mui/material";



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

  const [isPublic, setIsPublic] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const [openPDPA, setOpenPDPA] = useState(false);

  const handleOpenPDPAPublic = () => {
    setOpenPDPA(true);
    setIsPublic(true);
    setIsPrivate(false);
  }
  const handleOpenPDPAPrivate = () => {
    setOpenPDPA(true);
    setIsPrivate(true);
    setIsPublic(false);
  }
  const handleClosePDPA = () => {
    setOpenPDPA(false);
  }

  const navigateTo = (event: React.MouseEvent<HTMLElement>) => {
    if (isPublic) {
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
            setIsPrivate(false);
            setIsPublic(false);
          }
        })

      }
    } else {
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
              setIsPrivate(false);
              setIsPublic(false);
            });
          }
        })
      }
    }
  }

  return (
    <>
      <TopBar userState={""} roomState={""} />
      <> <Dialog
        open={openPDPA}
        onClose={handleClosePDPA}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"ข้อกำหนดและเงื่อนไข"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ข้อกำหนดและเงื่อนไขฉบับนี้ ถือเป็นข้อตกลงระหว่างผู้ให้บริการ "Virtual Working and Communicate Space" กับผู้รับบริการ 
            ข้าพเจ้าเข้าใจดีว่า ผู้ให้บริการจะเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าเพื่อวัตถุประสงค์ในการให้บริการตามสัญญานี้
            การบริการฟังก์ชั่นต่าง ๆ ของผู้ให้บริการแก่ข้าพเจ้า รวมถึงวัตถุประสงค์อื่นๆ ตามที่ผู้ให้บริการเห็นสมควร
            ข้าพเจ้ารับทราบดีกว่า หากข้าพเจ้าไม่ตกลงยอมรับข้อกำหนดและเงื่อนไขนี้ ผู้ให้บริการสงวนสิทธิไม่ให้บริการแก่ข้าพเจ้าได้
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button  onClick={handleClosePDPA}>
            Disagree
          </Button>
          <Button onClick={navigateTo}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      </>
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
                onClick={handleOpenPDPAPublic}
              ></CustomButton>
              <CustomButton
                label="Private"
                type="submit"
                onClick={handleOpenPDPAPrivate}
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
