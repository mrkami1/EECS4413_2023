// import { Person } from '@mui/icons-material';
import React from 'react'
import { ChatDots, Person } from "react-bootstrap-icons"


export default function ChatMessages(props) {
  return (
    <div>
      {
        props.user ? (
          <span>
            <span>{props.message}</span>
            <Person />
          </span>
        ) :
        <span>
          <ChatDots />
          <span>{props.message}</span>
        </span>
      }
    </div>
  )
}

