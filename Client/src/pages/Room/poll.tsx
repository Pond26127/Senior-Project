import { Typography } from '@mui/material';
import 'react-polls/dist/index.js'
// @ts-ignore
import Poll from 'react-polls';
import { useEffect, useState } from 'react';
import socket from '../Socket/socket';

const pollAnswers1 = [
  { option: "Yes", votes: 24 },
  { option: "No", votes: 3 },
  { option: "I don't know", votes: 1 }
];
const pollStyles = {
  questionSeparator: true,
  questionSeparatorWidth: "question",
  questionBold: true,
  questionColor: "#303030",
  align: "center",
  theme: "purple"
};

interface pollFormat {
  id: number,
  option: string,
  votes: number,
  realId: number
}

const Polling = (props: any) => {

  const [pollAns, setPollAns] = useState([...props.choiceSurvey]);

  const handleVote = (voteAnswer: any, pollAnswers:any) => {
    console.log(voteAnswer, pollAnswers)
    
    const newPollAnswers = pollAnswers.map((answer: any) => {
      if (answer.option === voteAnswer) 
    {
     
      socket.emit("submitResponse", answer.realId);
    }
    });
      socket.on("resultSummitRes", (data) => {
        setPollAns(data);
      })
  };

  useEffect(() => {
    socket.on("resultSummitRes", (data) => {
      console.log("socket", data)
      setPollAns(data);
    })
  }, []);


  return (
  <>
   <Poll
            question={props.question}
            answers={pollAns}
            onVote={(voteAnswer: any) => handleVote(voteAnswer, pollAns)}
            customStyles={pollStyles}
          />
  </>
  )
}

export default Polling;