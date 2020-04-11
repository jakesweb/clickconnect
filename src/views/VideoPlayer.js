// src/views/VideoPlayer.js

import React, { useState } from "react";
import { useAuth0 } from "../react-auth0-spa";
import VideoRoom from "../components/VideoRoom";

const VideoPlayer = () => {
  const [apiMessage, setApiResponse] = useState("");
  const { getTokenSilently } = useAuth0();

  const startVideo = async () => {
    try {
      const token = await getTokenSilently();

      const response = await fetch("http://localhost:3001/api/token", {
        methdod: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApiResponse(await response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>External API</h1>
      <input id="roomName" placeholder="Name of the video room?"></input>
      <button onClick={startVideo}>Start Video</button>
      {setApiResponse && (
        <VideoRoom
          token={setApiResponse.token}
          identity={setApiResponse.identity}
        />
      )}
    </>
  );
};

export default VideoPlayer;
