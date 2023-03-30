import { TopBar } from "../../components/Navigation/TopBar";
import styled from "styled-components";
import img1 from "../../assets/images/background1.gif";
import img2 from "../../assets/images/background2.gif";
import img3 from "../../assets/images/background3.gif";
import img4 from "../../assets/images/background4.gif";
import img5 from "../../assets/images/background5.gif"
import FaceIcon from "@mui/icons-material/Face";
import 'react-leaf-polls/dist/index.css'
import {
  Avatar,
  Box,
  Button,
  CardHeader,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Popover,
  Slide,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import socket from "../Socket/socket";
import GifPicker from "gif-picker-react";

import {
  ChatBubble,

  Check,

  Close,

  Edit,
  Favorite,
  GifBox,
  MoreHoriz,
  Send,
} from "@mui/icons-material";
import { ButtonText, CustomButton } from "../../components/Button/Button";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AddReaction } from "@mui/icons-material";
import EmojiPicker from "emoji-picker-react";
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { gapi } from 'gapi-script'
import axios from "axios";
import { ChatBox, ReceiverMessage, SenderMessage } from "mui-chat-box";
import Polling from "./poll";
import { Youtube } from "./youtube";
import CardMui from '@mui/material/Card';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;
const TopText = styled.div`
  text-align: start;
`;

const Card = styled.div`
  width: 600px;
  height: fit-content;
  margin: 20px;
  padding: 2rem 2.6rem;
  border-radius: 1.6rem;
  background-color: white;
  box-sizing: border-box;
`;

const Content = styled.div`
  margin: 20px 0px;
`;

const SpacesButton = styled.div`
  column-gap: 10px;
  margin: 10px 0px;
`;

const Note = styled.div`
  text-align: start;
  margin: 10px 0px;
`;

const MediaContent = styled.div`
  margin: 10px 0px;
`;

const MainContent = styled.div`
  grid-column-start: 1;
`;

const SideContent = styled.div`
  grid-column-start: 3;

`;

const Container = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 1fr 2fr 1ft;
  flex-direction: row;
  gap: 10rem;
`;

interface User {
  id: string;
  name: string;
  email: string;
}

interface ChatMessage {
  id: string;
  user: User;
  text: string;
  createdAt: string;
}

export const Room = (props: any) => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const location = useLocation();
  const userState = location.state.user;
  const roomState = location.state.room;

  // Announcement
  const [editAnnounce, setEditAnnounce] = useState(false);
  const [announceText, setAnnounceText] = useState("");
  const [announcePublic, setAnnouncePublic] = useState("No note");
  const [userAnnouncePublic, setUserAnnouncePublic] = useState("any user");
  const [timeAnnouncePublic, setTimeAnnouncePublic] = useState(null);
  // Scroll Chat
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Poll
  const [pollDialog, setPollOpenDialog] = useState(false);
  // เรียกข้อมูลมาแสดงทุกคน
  const [showPollALL, setShowPollAll] = useState(false);
  const [topicPoll, setTopicPoll] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [dataPoll, setDataPoll] = useState({});


  const handleOpenPoll = () => {
    setPollOpenDialog(true);
  };
  const handleClosePoll = () => {
    setPollOpenDialog(false);

  };

  useEffect(() => {
    socket.on("resultCreateSurvey", (data) => {
      console.log(data)
      setPollOpenDialog(false)
      setDataPoll(data);
      console.log("Data", dataPoll);
      setShowPollAll(true);
    })
  }, [])

  const handleCreatePoll = () => {
    var array = [];
    array.push(option1)
    array.push(option2)
    array.push(option3)
    array.push(option4)
    var arrayFilter = [];
    arrayFilter = array.filter(arr => arr !== "")


    socket.emit("createSurvey", topicPoll, arrayFilter)
    setPollOpenDialog(false)
  }


  const handleCloseShowPollAll = () => {
    setShowPollAll(false);
  }

  // Add more poll option
  const [addMoreTextFields, setAddMoreTextFields] = useState(false)
  const [option4, setOption4] = useState('');

  function handleEmojiClick(emoji: any) {
    setMessageText(messageText + emoji.emoji);
  }

  useEffect(() => {
    socket.on("message", (message: ChatMessage) => {
      console.log("Received Message:", message);
      if (message.user.id === userState.id) {
        // Skip adding the message to the "messages" state if it's from the current user
        return;
      }
      setMessages((messages) => {
        if (
          messages.length > 0 &&
          messages[messages.length - 1].id === message.id
        ) {
          return messages;
        } else {
          return [...messages, message];
        }
      });
    });

  }, [userState]);

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  useEffect(() => {
    if (location.pathname === "/room") {
      console.log("Someone joined the chat page from the lobby.");
      socket.emit("userInRoom", roomState.id);
      socket.on("userList", (data) => {
        setUsers(data);
      });
    }
    else {

    }
  }, [location.pathname]);

  const sendMessage = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    socket.emit(
      "createMessage",
      messageText,
      roomState.id,
      userState.id,
      (message: ChatMessage) => {
        setMessages([...messages, message]); // Add the new message to the messages array
      }
    );
    setMessageText("");
  };

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const backgrounds = [img1, img2, img3, img4,img5];

  const handleClickOne = () => {
    setBackgroundIndex(0);
  };

  const handleClickTwo = () => {
    setBackgroundIndex(1);
  };

  const handleClickThree = () => {
    setBackgroundIndex(2);
  };
  const handleClickFour = () => {
    setBackgroundIndex(3);
  };

  const handleClickFive = () => {
    setBackgroundIndex(4);

  }

  const handleSubmitAnnounce = () => {
    // sent it to backend to edit
    socket.emit("announcement", roomState.id, userState.id, userState.name, announceText)

    setEditAnnounce(false);
  };
  // get data from 

  useEffect(() => {
    socket.on("resultAnnouncement", (data) => {
      setAnnouncePublic(data.textNote)
      setUserAnnouncePublic(data.owner_name)
      setTimeAnnouncePublic(data.createdAt)
    })
  }, [])

  // Google Calendar
  const clientId = "773809841935-i4gvn4vtuh2pef46juqsfpn0vt01iliv.apps.googleusercontent.com"
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: 'https://www.googleapis.com/auth/calendar',
        plugin_name: 'FinalProject App'
      })
    }
    gapi.load("client:auth2", initClient);
  }, [])

  async function responseGoogle(res: any) {
    const { code } = res
    console.log(res)
    axios.post('http://localhost:3001/calendars/create-tokens', { code, id: userState.id })
      .then(res => {
        console.log(res.data.refresh_token)
        setSignedIn(true);
      }).catch(error => console.log(error.message))
  }

  const responseError = (res: any) => {
    console.log('failed', res)
  }

  const [openCalendarDialog, setOpenCalendarDialog] = useState(false)
  // Dialog Form Calendar
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [place, setPlace] = useState('')
  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')
  const [signedIn, setSignedIn] = useState(false)


  const handleSubmitEvent = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    const attendeesMail = [];

    let emailUsers = users.map((item: any) => item.email)
    let emailUsersFilter = emailUsers.filter(email => email !== userState.email)
    for (let i = 0; i < emailUsersFilter.length; i++) {
      attendeesMail.push({ email: emailUsersFilter[i] })
    }
    if (emailUsers.length)
      axios.post('http://localhost:3001/calendars/create-event', {
        summary, description, place, startDateTime, endDateTime, id: userState.id,
        attendeesMail
      }).then(res => {

        setSummary('')
        setDescription('')
        setPlace('')
        setStartDateTime('')
        setEndDateTime('')
        setOpenCalendarDialog(false)
        // ทำ Alert ขึ้นหน้าจอ
      }).catch(error => console.log(error.message))
  }

  // Popover
  const [anchorEmoji, setAnchorEmoji] = React.useState<HTMLButtonElement | null>(null);
  const [anchorGif, setAnchorGif] = React.useState<HTMLButtonElement | null>(null);
  const [anchorMain, setAnchorMain] = React.useState<HTMLButtonElement | null>(null);
  const [anchorChat, setAnchorChat] = React.useState<HTMLButtonElement | null>(null);

  const openPopoverEmoji = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEmoji(event.currentTarget);
  };

  const handleClosePopoverEmoji = () => {
    setAnchorEmoji(null);
  };

  const openPopoverGif = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorGif(event.currentTarget)
  }
  const handleClosePopoverGif = () => {
    setAnchorGif(null)
  }

  const onGifClick = (gif: any) => {
    console.log(gif.url)
    socket.emit(
      "createMessage",
      gif.url,
      roomState.id,
      userState.id,
      (message: ChatMessage) => {
        setMessages([...messages, message]); // Add the new message to the messages array
      }
    );
  }
  const openPopoverMain = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorMain(event.currentTarget)
  }
  const handleClosePopoverMain = () => {
    setAnchorMain(null)
  }

  // Popover Chat
  const openPopoverChat = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorChat(event.currentTarget)
  }

  const handleClosePopoverChat = () => {
    setAnchorChat(null)
  }

  // Media
  const [inputVideo, setInputVideo] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [openVideo, setOpenVideo] = useState(false);
  const [openOurSong, setOpenOurSong] = useState(false);
  const [openMenu, setOpenMenu] = useState(true);
  const handleClickOurSong = () => {
    setOpenOurSong(true);
    setAnchorMain(null)
    setVideoUrl("https://www.youtube.com/watch?v=iKzRIweSBLA&list=PL7v1FHGMOadDghZ1m-jEIUnVUsGMT9jbH")
    setOpenVideo(true)
  }

  const handleClickListenWithFriends = () => {
    window.open("https://sync-tube.de/");
  }

  const handleSubmitVideo = () => {
    setVideoUrl(inputVideo)
    setInputVideo("");
    setAnchorMain(null)
    setOpenVideo(true)

  }

  const handleCloseMedia = () => {
    setOpenVideo(false);
  }

  

  return (
    <div style={{ overflow: "hidden" }}>
      <TopBar roomState={roomState} {...roomState} userState={userState} {...userState} userCount={users.length} />
      <div
        style={{
          backgroundImage: `url(${backgrounds[backgroundIndex]})`,
          height: "993px",
          width: "100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >



        <Dialog open={showPollALL} fullWidth>
          <DialogTitle>Voting</DialogTitle>
          <DialogContent dividers>
            <Polling {...dataPoll} />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleCloseShowPollAll}>Close</Button>
          </DialogActions>
        </Dialog>

        <Popover
          open={Boolean(anchorMain)}
          anchorEl={anchorMain}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handleClosePopoverMain}
        >   <MainContent>
            <Card>
              <Header>
                <Typography variant="h6">Welcome! {userState.name}</Typography>
                <Typography variant="h6">
                  {currentTime.toLocaleTimeString()}
                </Typography>
              </Header>

              <Content>
                <TopText>
                  <Typography variant="h6">Spaces</Typography>
                  <Typography variant="subtitle2">
                    Select space which you enjoy with
                  </Typography>
                </TopText>
                <SpacesButton style={{ display: "flex", justifyItems: "center", justifyContent: "center" }}>
                  <IconButton size="large" onClick={handleClickOne}>
                    <Favorite />
                  </IconButton>

                  <IconButton size="large" onClick={handleClickTwo}>
                    <Favorite />
                  </IconButton>

                  <IconButton size="large" onClick={handleClickThree}>
                    <Favorite />
                  </IconButton>

                  <IconButton size="large" onClick={handleClickFour}>
                    <Favorite />
                  </IconButton>

                  <IconButton size="large" onClick={handleClickFive}>
                    <Favorite />
                  </IconButton>
                </SpacesButton>
              </Content>

              <Divider></Divider>
              <Note>
                <Typography variant="h6" style={{ display: "inline-block" }}>
                  Note
                </Typography>
                <IconButton onClick={(e) => setEditAnnounce(!editAnnounce)}>
                  <Edit />
                </IconButton>
                <>
                  {editAnnounce ? (
                    <div>
                      <TextField
                        placeholder="Write room's note here"
                        variant="outlined"
                        onChange={(e) => setAnnounceText(e.target.value)}
                        fullWidth
                        multiline={true}
                        rows={3}
                        style={{ margin: "10px 0px" }}
                      ></TextField>
                      <Button
                        type="submit"
                        onClick={(e) => handleSubmitAnnounce()}
                        style={{
                          height: "44px",
                          width: "100%",
                          backgroundColor: "#FFFFFF",
                          borderColor: "#000000",
                          border: "2px solid #000000",
                        }}
                      >
                        <ButtonText style={{ color: "#000000" }}>
                          Submit
                        </ButtonText>
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Stack>
                        <Typography style={{ display: "inline-block", }}>
                          {announcePublic} by {userAnnouncePublic}
                        </Typography>
                      </Stack>
                    </div>
                  )}
                </>
              </Note>

              <Divider></Divider>

              <Content>
                <TopText>
                  <Typography variant="h6">Media</Typography>
                  <Typography variant="subtitle2">
                    Listen a song or watch youtube
                  </Typography>
                </TopText>
                <MediaContent style={{ display: "flex",justifyContent: "center" }}>
                  {
                    openMenu ? (
                      <div style={{display: "flex", justifyContent: "center", justifyItems: "center"}}>
                        <Button onClick={handleClickOurSong}>
                          Open Our Song
                        </Button>
                        <Divider orientation="vertical" variant="middle" flexItem />

                        <Button onClick={() => setOpenMenu(false)}>
                          Open by URL
                        </Button>
                        <Divider orientation="vertical" variant="middle" flexItem />

                        <Button onClick={handleClickListenWithFriends}>
                          Listen with friends
                        </Button>
                      </div>

                    ) : (<div style={{ display: "flex"}}>
                      <TextField
                        placeholder="Insert link ..."
                        variant="outlined"
                        type="text"
                        value={inputVideo}
                        onChange={(e) => setInputVideo(e.target.value)}
                        sx={{ width: 400 }}
                      ></TextField>
                    
                      <Button onClick={handleSubmitVideo}>
                        Open
                      </Button>

                      <Button onClick={() => setOpenMenu(true)}>
                        Back
                      </Button>
                    </div>)
                  }
                </MediaContent>
              </Content>

              <Divider></Divider>

              <Content>
                <TopText style={{ marginBottom: "10px" }}>
                  <Typography variant="h6">Calendar</Typography>
                  <Typography variant="subtitle2">
                    Set Calendar to your friends
                  </Typography>

                </TopText>
                {
                  signedIn ? (
                    <div style={{ display: "flex", justifyItems: "center", justifyContent: "center" }}>
                      <CustomButton label="Create an event" onClick={(e) => setOpenCalendarDialog(!openCalendarDialog)} />
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyItems: "center", justifyContent: "center" }}>
                      <GoogleLogin
                        clientId={clientId}
                        buttonText="Sign in with Google"
                        onSuccess={responseGoogle}
                        onFailure={responseError}
                        cookiePolicy={'single_host_origin'}
                        responseType='code'
                        accessType="offline"
                        scope="openid email profile https://www.googleapis.com/auth/calendar"
                      />
                    </div>)

                }

                <Dialog open={openCalendarDialog} onClose={() => setOpenCalendarDialog(!openCalendarDialog)} fullWidth>
                  <DialogTitle>Create an event</DialogTitle>
                  <DialogContent dividers>

                    <TextField
                      autoFocus
                      margin="dense"
                      id="summary"
                      label="Summary"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      style={{ marginBottom: "10px" }}
                    />


                    <TextField
                      autoFocus
                      margin="dense"
                      id="description"
                      label="Description"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      inputProps={{
                        style: { height: "50px", marginBottom: "10px" }
                      }}
                    />

                    <TextField
                      autoFocus
                      margin="dense"
                      id="place"
                      label="Place"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      style={{ marginBottom: "20px" }}

                    />

                    <DialogContentText>
                      Start Date Time
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="startDateTime"
                      type="datetime-local"
                      fullWidth
                      variant="outlined"
                      value={startDateTime}
                      onChange={(e) => setStartDateTime(e.target.value)}
                      style={{ marginBottom: "10px" }}

                    />

                    <DialogContentText>
                      End Date Time
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="endDateTime"
                      type="datetime-local"
                      fullWidth
                      variant="outlined"
                      value={endDateTime}
                      style={{ marginBottom: "10px" }}
                      onChange={(e) => setEndDateTime(e.target.value)}
                    />
                    <DialogContentText>
                     * This event will send to everyone's calendar 
                    </DialogContentText>

                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenCalendarDialog(!openCalendarDialog)}>
                      Cancel
                    </Button>
                    <Button color="primary" onClick={handleSubmitEvent}>Create</Button>
                  </DialogActions>
                </Dialog>
              </Content>
              <Divider />

              <Content>
                <TopText>
                  <Typography variant="h6">Poll</Typography>
                  <Typography variant="subtitle2">
                    Brainstorm and voting in the poll with friends
                  </Typography>
                </TopText>
                <div style={{ paddingTop: "20px", display: "flex", justifyItems: "center", justifyContent: "center" }}>
                  <CustomButton label="Create Poll" onClick={handleOpenPoll} />
                </div>
                <Dialog open={pollDialog} onClose={handleClosePoll}>
                  <DialogTitle>Create new poll</DialogTitle>
                  <DialogContent dividers>
                    <DialogContentText>
                      Choose Your Topic
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="outlined-required"
                      label="Topic"
                      type="text"
                      fullWidth
                      variant="outlined"
                      onChange={(event) => setTopicPoll(event.target.value)}
                    />
                    <DialogContentText>
                      Add Option
                    </DialogContentText>
                    <TextField
                      required
                      autoFocus
                      margin="dense"
                      id="outlined-required"
                      label="Option 1"
                      type="text"
                      fullWidth
                      variant="outlined"
                      onChange={(event) => setOption1(event.target.value)} />
                    <TextField
                      required
                      autoFocus
                      margin="dense"
                      id="outlined-required"
                      label="Option 2"
                      type="text"
                      fullWidth
                      variant="outlined"
                      onChange={(event) => setOption2(event.target.value)} />
                    <TextField
                      required
                      autoFocus
                      margin="dense"
                      id="outlined-required"
                      label="Option 3"
                      type="text"
                      fullWidth
                      variant="outlined"
                      onChange={(event) => setOption3(event.target.value)} />

                      { addMoreTextFields ? (
                        <div>
                          <TextField
                          required
                          autoFocus
                          margin="dense"
                          id="outlined-required"
                          label="Option 4"
                          type="text"
                          fullWidth
                          variant="outlined"
                          onChange={(event) => setOption4(event.target.value)}
                          />
                          <div style={{ textAlign: "center"}}>
                              <Button onClick={() => setAddMoreTextFields(false)}>
                          Delete More Option
                        </Button>
                          </div>
                        
                        </div>
                      ) : (
                        <div style={{ textAlign: "center"}}>
                        <Button onClick={() => setAddMoreTextFields(true)}>
                          Add More Option
                        </Button>
                        </div>
                      )}

                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClosePoll}>
                      Cancel
                    </Button>
                    <Button color="primary" onClick={handleCreatePoll}>Create</Button>
                  </DialogActions>
                </Dialog>

              </Content>
            </Card>
          </MainContent>
        </Popover>

        <div style={{
          position: "absolute",
          bottom: "10px",
          left: "10px"
        }}>

          {openVideo ? (
            <CardMui>
              <CardHeader style={{ display: "flex" }}
                action={
                  <IconButton onClick={handleCloseMedia}>
                    <Close />
                  </IconButton>
                }
              />
              <Youtube link={videoUrl} ></Youtube>
            </CardMui>
          ) : (null)}
        </div>
        <Container>
          <IconButton style={{
            backgroundColor: "white", height: "50px", width: "50px", marginTop: "10px",
            marginLeft: "10px", display: "flex"
          }} onClick={
            openPopoverMain
          }>
            <MoreHoriz />
          </IconButton>

          <SideContent>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="flex-end"
              spacing={1}
              marginTop={2}
              marginRight={3}
            >
              {users.map((user) => (
                <Chip
                  key={user.id}
                  icon={<FaceIcon />}
                  label={user.name}
                  color="secondary"
                  variant="filled"
                  sx={{ height: "35px", width: "100px"}}
                />
              ))}
            </Stack>

            {/* MESSAGE */}

            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                marginRight: "20px",
              }}
            >
              <div style={{
                bottom: 0,
                marginBottom: "20px"
              }}>
                <IconButton style={{
                  backgroundColor: "white", height: "50px", width: "50px", marginTop: "10px",
                  marginLeft: "10px", display: "flex"
                }} onClick={
                  openPopoverChat
                }>
                  <ChatBubble />
                </IconButton>
              </div></div>

            <Popover
              open={Boolean(anchorChat)}
              anchorEl={anchorChat}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              onClose={handleClosePopoverChat}
            >
              <div style={{
                overflow: "scroll", height: "600px", width: "500px", backgroundColor: "white",
                boxSizing: "border-box"
              }}>
                {messages.map((message, index) => (
                  <div key={index}>
                    {
                      message.user.name == userState.name ? (
                        <>
                          <Typography style={{ textAlign: "center", marginTop: "10px" }}>  {message.user.name}: </Typography>
                          {
                            message.text.slice(-3) === 'gif' ? (
                              <div style={{ display: "flex", justifyContent: "end", justifyItems: "end" }}>

                                <SenderMessage avatar={<Avatar>{message.user.name.slice(0, 1)}</Avatar>}>
                                  <img src={message.text} style={{ height: "150px", width: "200px" }} />
                                </SenderMessage>
                              </div>

                            ) : (
                              <div style={{ display: "flex", justifyContent: "end", justifyItems: "end" }}>
                                <SenderMessage avatar={<Avatar>{message.user.name.slice(0, 1)}</Avatar>}>
                                  {message.text}
                                </SenderMessage>
                              </div>
                            )
                          }
                          <Typography style={{ textAlign: "end", marginRight: "60px", marginTop: "5px" }}>
                            {message.createdAt.slice(11, 16)}
                          </Typography>
                        </>
                      ) : (
                        <div>
                          <Typography style={{ textAlign: "center", marginTop: "10px" }}>
                            {message.user.name}:  </Typography>

                          {
                            message.text.slice(-3) === 'gif' ? (
                              <div style={{ display: "flex", justifyContent: "start", justifyItems: "start" }}>

                                <ReceiverMessage avatar={<Avatar>{message.user.name.slice(0, 1)}</Avatar>}>
                                  <img src={message.text} style={{ height: "150px", width: "150px" }} />

                                </ReceiverMessage>
                              </div>
                            ) : (
                              <div style={{ display: "flex", justifyContent: "start", justifyItems: "start" }}>

                                <ReceiverMessage avatar={<Avatar>{message.user.name.slice(0, 1)}</Avatar>}>
                                  {message.text}
                                </ReceiverMessage>
                              </div>
                            )
                          }
                          <Typography style={{ textAlign: "start", marginLeft: "60px", marginTop: "5px" }}>
                            {message.createdAt.slice(11, 16)}
                          </Typography>
                        </div>
                      )
                    }
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>

              <Stack
                direction="row"
                spacing={2}
                style={{ alignItems: "center", backgroundColor: "white" }}
              >
                <IconButton onClick={openPopoverGif} style={{ backgroundColor: "white" }}>
                  <GifBox />
                </IconButton>

                <Popover
                  open={Boolean(anchorGif)}
                  anchorEl={anchorGif}
                  anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  onClose={handleClosePopoverGif}
                >
                  <GifPicker tenorApiKey={"AIzaSyB0pSY1K0EJSrIht5d8wushEClSC-vu5d4"} onGifClick={(item) => onGifClick(item)} />

                </Popover>

                <IconButton onClick={openPopoverEmoji} style={{ backgroundColor: "white" }}>
                  <AddReaction />
                </IconButton>
                <Popover
                  open={Boolean(anchorEmoji)}
                  anchorEl={anchorEmoji}
                  anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  onClose={handleClosePopoverEmoji}
                >
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </Popover>
                <TextField
                  type="text"

                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  style={{ backgroundColor: "white", width: "250px", justifyContent: "center" }}
                />
                <IconButton onClick={sendMessage} >
                  <Send />
                </IconButton>
              </Stack>
            </Popover>

          </SideContent>
        </Container>
      </div>

    </div>


  );
};
