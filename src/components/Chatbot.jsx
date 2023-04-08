import React from 'react'
import "../assets/chatbot_icon.png"
import { useState } from 'react'
import { Button } from '@mui/material'
import ChatMessages from './ChatMessages'
import { analyze } from './utils'
import "../css/Chatbot.css"


export const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      message: 'Hi, May I have your name ?'
    },
  ]);

  const [text, setText] = useState("")

  const [showBot, toggleBot] = useState(false);

  const onSend = () => {
    let list = [...messages, {message: text, user: true}];
    if (list.length > 2) {
      const reply = analyze(text)
      list = [
        ...list,
        {message: reply}
      ]
    }
    else {
      list = [
        ...list,
        {
          message: `Hi, ${text}`,
        },
        {
          message: "How may I help you today?"
        }
      ];
    }
    setMessages(list)
    setText("")
    setTimeout(() => {
      // document.querySelector('.chat_input').scrollIntoView();
      // document.querySelector('.chat_message').scrollIntoView();
    //   $('.chat_message').animate({
    //     scrollTop: $('chat_input').offset().top - $('.chat_message').offset().top + 
    //     $('.chat_message').scrollTop()
    //  })
    document.querySelector('.chat_message').scrollTo({ // scroll message window down to bottom
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth'
    })
    }, 1);
  }

  return (
    <div>
      {showBot && (
        <div className='chatbot_container'>
        <div className="chatbot">
          <div className="chat_message">
          {
            messages.length > 0 && messages.map((data, index) => <ChatMessages {...data} key={index} />)
          }
            </div>
        <div className="chat_input">
        <input type="text" className='chat_box' value={text} onChange={(e) => setText(e.target.value)} />
        <button id="chat_button" onClick={onSend}>Send</button>
      </div>
      <div id="copyright">
        Copyrights reserved EECS4413 Team L
      </div>
    </div>
      </div>)}
      <button className="chatbot_button" onClick={() => toggleBot((prev) => !prev)}>
      {/* <img
        src={require('../assets/chatbot_icon.png')}
        alt="logo"
        // height={200}
        // width={50}
        /> */}
        <div>Chatbot</div>
        <svg viewBox="0 0 640 512" className="app-chatbot-button-icon">
            <path d="M192,408h64V360H192ZM576,192H544a95.99975,95.99975,0,0,0-96-96H344V24a24,24,0,0,0-48,0V96H192a95.99975,95.99975,0,0,0-96,96H64a47.99987,47.99987,0,0,0-48,48V368a47.99987,47.99987,0,0,0,48,48H96a95.99975,95.99975,0,0,0,96,96H448a95.99975,95.99975,0,0,0,96-96h32a47.99987,47.99987,0,0,0,48-48V240A47.99987,47.99987,0,0,0,576,192ZM96,368H64V240H96Zm400,48a48.14061,48.14061,0,0,1-48,48H192a48.14061,48.14061,0,0,1-48-48V192a47.99987,47.99987,0,0,1,48-48H448a47.99987,47.99987,0,0,1,48,48Zm80-48H544V240h32ZM240,208a48,48,0,1,0,48,48A47.99612,47.99612,0,0,0,240,208Zm160,0a48,48,0,1,0,48,48A47.99612,47.99612,0,0,0,400,208ZM384,408h64V360H384Zm-96,0h64V360H288Z"></path>
          </svg>
      </button>
    </div>
  )
}


