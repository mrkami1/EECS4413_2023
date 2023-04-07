// import { Person } from '@mui/icons-material';
import React from 'react'
import { ChatDots, Person } from "react-bootstrap-icons"
import "../css/ChatMessages.css"


export default function ChatMessages(props) {
  return (
    <div className="message">
      {
        props.user ? (
          <div className="person_message">
            <div className="person"><Person /></div>
            <div className="person_reply">{props.message}</div>
          </div>
        ) :
        <div className="bot_message">
          <div className="chatdots"><ChatDots />
          </div>
          <div className="bot">
            {props.message}
              </div>
        </div>
      }
    </div>
  )
}

