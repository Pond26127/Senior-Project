import { ArrowForwardIos } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import styled from "styled-components";

import StatusChip from "./StatusChip";
import socket from "../../pages/Socket/socket";
import { Room } from "../../pages/Lobby";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert } from "@mui/material";

const colors = {
  primary: "#077ccd",
  hover: "#F5FAFF",
};
const StyledLeftContent = styled.div`
  min-width: 25.5rem;
  height: 100%;
  border-right: 0.1rem solid #f0f0f0;
  display: flex;
  flex-direction: column;
  padding: 2.4rem 1.7rem 2.4rem 3.6rem;
  box-sizing: border-box;
  text-align: justify;
  justify-content: center;
`;

const DetailBox = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.8rem;
  width: 13rem;
  text-align: justify;
`;

const StyledWrapText = styled(Typography)`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
`;

const StyledCenterContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 4.7rem;
  padding-right: 3.6rem;
`;

const CenterInfo = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 5rem;
  min-width: 60rem;
`;

const ButtonBox = styled.div`
  height: 100%;
  text-align: left;
`;

const StyledCard = styled.div`
  min-width: 70rem;
  height: 13.7rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 1.1rem;
  box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.05);
  background-color: white;
  cursor: pointer;
  overflow: hidden;

  :hover {
    background-color: ${colors.hover};
  }
`;

interface ActionCardProps {
  id?: any;
  name?: string;
  isPrivate?: boolean;
  user?: any;
}

const ActionCard: React.FC<ActionCardProps> = ({ ...props }) => {
  let users = props.user;
  const names = users.map((item: any) => item.name);
  // const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

  const handleJoinRoom = (id: any) => {
    if (props.user.length == 4) {
      console.log("Click Full");
      alert("This room is full!");
    } else {
      socket.emit("joinRoom", id);
      socket.on("user", (data) => {
        console.log("DATA:", data);
        navigate("/room", { state: { data } });
      });
    }
  };

  const RenderLeftContent = () => {
    return (
      <StyledLeftContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {props.user.length == 4 ? (
            <StatusChip status="Full" />
          ) : (
            <StatusChip status="Available" />
          )}
        </div>
        <Typography
          variant="h5"
          style={{ marginTop: "1rem", fontWeight: "bold" }}
        >
          {props.name}
        </Typography>
        <Typography variant="subtitle1" style={{ color: "grey" }}>
          Member: {names.join(", ")}
        </Typography>
      </StyledLeftContent>
    );
  };

  const RenderCenterContent = () => {
    const detailText = (header: string, content: string) => {
      return (
        <DetailBox>
          <Typography
            variant="subtitle1"
            style={{ color: "grey", fontWeight: "bold" }}
          >
            {header}
          </Typography>
          <StyledWrapText variant="h4">{content}</StyledWrapText>
        </DetailBox>
      );
    };
    return (
      <StyledCenterContent>
        <CenterInfo>
          {!props.isPrivate
            ? detailText("Type", "Public")
            : detailText("Type", "Private")}
          {detailText("Total", props.user.length + "/4 People")}
          <ButtonBox>
            <ArrowForwardIos
              style={{ color: "grey", fontSize: "1.6rem" }}
            ></ArrowForwardIos>
          </ButtonBox>
        </CenterInfo>
      </StyledCenterContent>
    );
  };

  return (
    <>
      <StyledCard
        style={{ minHeight: "13.7rem" }}
        onClick={() => handleJoinRoom(props.id)}
      >
        {RenderLeftContent()}
        {RenderCenterContent()}
      </StyledCard>
    </>
  );
};

export default ActionCard;
