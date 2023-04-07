import React from 'react'
import "../assets/chatbot_icon.png"
import { useState } from 'react'
import { Button } from '@mui/material'
import ChatMessages from './ChatMessages'
import { analyze } from './utils'


export const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      message: 'Hi, May I have your name ?'
    },
  ]);

  const [text, setText] = useState("")

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
          message: `Hi, ${text}, How can I help you?`,
        },
      ];
    }
    setMessages(list)
    setText("")
    setTimeout(() => {
      document.querySelector('#copyright').scrollIntoView();
    }, 1);
  }

  return (
    <div>
      <div className='d-flex align-items-center justify-content-center'>
        <img
        src={require('../assets/chatbot_icon.png')}
        alt="logo"
        height={200}
        width={200}
        />
        <h2 className='text-primary'>Chatbot</h2>
      </div>
      <div className='chat-message'>
        {
          messages.length > 0 && messages.map((data) => <ChatMessages {...data} />)
        }
        <div className="d-flex">
          <input type="text" className='form-control' value={text} onChange={(e) => setText(e.target.value)} />
          <Button type='primary' onClick={onSend}>Send</Button>
        </div>
        <div id='copyright'>
          Copyrights reserved EECS4413 Team L
        </div>
      </div>
    </div>
  )
}


