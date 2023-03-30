import { Dialog, Typography } from "@mui/material"
import React from 'react'
import ReactPlayer from 'react-player/youtube'

interface YoutubeProps {
    link?: string;
}
export const Youtube: React.FC<YoutubeProps>= ({link}) => {

return (

        <ReactPlayer url={link} height="360px" width="640px"/>

)
}