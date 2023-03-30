import Typography from "@mui/material/Typography";
import styled from "styled-components";
import { TopBar } from "../../components/Navigation/TopBar";
import LobbyPicture from "../../assets/images/example_pic_lobby.gif";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { CustomButton } from "../../components/Button/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { Container } from "../../components/Layout";
import { Search } from "@mui/icons-material";
import ActionCard from "../../components/Action/ActionCard";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../Socket/socket";
const TopText = styled.div`
  margin-top: 2rem;
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
  width: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 50px 3rem;
  row-gap: 1ch;
`;

const StyledMainPicture = styled.img`
  width: 20rem;
`;

const StyledTextField = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 24px 0px 0px 0px;
`;

const CardColumn = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 2.1rem;
  width: 100%;
`;
const SideBar = styled.div``;

const ButtonBar = styled.div`
  display: grid;
  justify-items: center;
  padding-top: 50px;
`;

const Body = styled.div`
  display: grid;
`;

export interface Room {
  id: string;
  name: string;
}

export const Lobby: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState("");
  const [fullRoom, setFullRoom] = useState<Boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state.user;
  // open and close dialog
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setRoomName("");
    setOpen(false);
  };


  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    socket.on("room", (room: Room) => {
      user.roomId = room.id;
      navigate("/room", { state: { room, user } });
    });
    socket.emit('getPublicRoom', 'a');
    socket.on("roomList", (roomsData: Room[]) => {
      setRooms(roomsData);
    });
    // socket.on("roomList", (roomsData: Room[]) => {
    //   console.log(roomsData)
    //   setRooms(roomsData);
    // });
    // socket.emit("roomList");
  }, []);



  const handleSearchClick = (searchTerm: string) => {
    socket.emit("getRooms", searchTerm);
    socket.on("roomSearch", (data) => {
      setRooms(data);
    });
  }
  
  const handleCreateRoom = (event: React.MouseEvent<HTMLElement>) => {
    if (roomName == "") {
      event.stopPropagation();
      socket.emit("createRoom", user.name + "'s Room", false);
      socket.on("room", (room) => {
        socket.emit("joinRoom", room.id);
        navigate("/room", { state: { room, user } });
        setRoomName("");
      });
    } else {
      event.stopPropagation();
      socket.emit("createRoom", roomName);
      socket.on("room", (room) => {
        socket.emit("joinRoom", room.id);
        navigate("/room", { state: { room,user } });
        setRoomName("");
      });
    }
  };
  const handleRefresh = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    socket.on("roomList", (roomsData: Room[]) => {
      setRooms(roomsData);
      console.log(roomsData);
    });
    socket.emit("roomList");
  };

  return (
    <div style={{ overflow: "hidden"}}>
      <TopBar userState={user} roomState={""}/>
      <Grid>
        <TopText>
          <Typography variant="h4" style={{ width: "100%", textAlign: "left",
          marginLeft: "210px"}}>
            All Public Rooms
          </Typography>
        </TopText>

        <SideBar>
          <StyledMainPicture src={LobbyPicture} style={{}}></StyledMainPicture>
          <div
            style={{
              textAlign: "left",
          
              paddingTop: "10px",
              justifyItems: "center"
            }}
          >
            <Typography variant="h6"   style={{
              textAlign: "center",
              paddingTop: "10px",
            }}>Welcome to lobby!
  
          </Typography>

          <Typography style={{
              textAlign: "center",
          
            }}>
            Create new public room or select one of rooms here.
          </Typography>

          </div>
          <ButtonBar>
            
          <Typography style={{ marginBottom: "10px"}}>
            Menu :
          </Typography>
            <CustomButton
              label="Create Public"
              type="submit"
              onClick={handleClickOpen}
            ></CustomButton>
            <div style={{ paddingTop: "15px" }}></div>
            <CustomButton
              label="Refresh"
              type="submit"
              onClick={handleRefresh}
            ></CustomButton>
          </ButtonBar>
        </SideBar>

        <Body>
          <Container>
            <CardColumn>
              {rooms.length > 0 ? (
                <>
                  {rooms.map((room, index) => (
                    <ActionCard {...room} key={index}></ActionCard>
                  ))}
                </>
              ) : (
                <Typography variant='h5'>No joinable rooms found.</Typography>
              )}
            </CardColumn>
          </Container>

          <StyledTextField>
            <TextField
              style={{ width: "376px", height: "56px" }}
              placeholder="Search"
              onChange={(event) => setSearchTerm(event.target.value)}
              type="text"
              InputProps={{
                endAdornment: (
                  <IconButton onClick={(e) => handleSearchClick(searchTerm)}>
                    <Search/>
                  </IconButton>
                ),
              }}
            ></TextField>
          </StyledTextField>
        </Body>
      </Grid>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Create new room</DialogTitle>
        <DialogContent>
          <DialogContentText>Insert your room name</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            value={roomName}
            onChange={(event) => setRoomName(event.target.value)}
            label={user.name + "'s Room"}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateRoom}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
