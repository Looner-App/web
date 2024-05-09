import React from 'react';
import './stronger/stronger.css';

export type StrongerProps = {
  message: string;
};

const Stronger = ({ message }: StrongerProps) => {
  // Function to modify the message content
  const modifyMessage = (message: string) => {
    const modifiedText = message.replace(
      /(<strong>)(.*?)(<\/strong>)/g,
      (__, _, p2) => {
        return `<strong class="strongfy"><span class="strongfy-container">${p2}</span></strong>`;
      },
    );

    return modifiedText;
  };

  return <div dangerouslySetInnerHTML={{ __html: modifyMessage(message) }} />;
};

export default Stronger;
