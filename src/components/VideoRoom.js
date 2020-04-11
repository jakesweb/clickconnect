// src/components/VideoRoom.js
import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { Card, CardText } from "material-ui/Card";
import Video from "twilio-video";

export default class VideoRoom extends Component {
  constructor(props) {
    super();
    this.state = {
      identity: null,
      roomName: "",
      roomNameErr: false,
      previewTracks: null,
      localMediaAvailable: false,
      hasJoinedRoom: false,
      activeRoom: null,
    };
    this.joinRoom = this.joinRoom.bind(this);
    this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
    this.roomJoined = this.roomJoined.bind(this);
  }

  handleRoomNameChange(e) {
    let roomName = e.target.value;
    this.setState({ roomName });
  }

  joinRoom() {
    if (!this.state.roomName.trim()) {
      this.setState({ roomNameErr: true });
      return;
    }

    console.log("Joining room '" + this.state.roomName + "'...");
    let connectOptions = {
      name: this.state.roomName,
    };

    if (this.state.previewTracks) {
      connectOptions.tracks = this.state.previewTracks;
    }

    Video.connect(this.props.token, connectOptions).then(
      this.roomJoined,
      (error) => {
        alert("Could not connect to Twilio: " + error.message);
      }
    );
  }

  attachTracks(tracks, container) {
    this.forEach((track) => {
      container.appendChild(track.attach());
    });
  }

  attachParticipantTracks(participant, container) {
    var tracks = Array.from(participant.tracks.value());
    this.attachTracks(tracks, container);
  }

  roomJoined(room) {
    console.log("Joined as '" + this.props.identity + "'");
    this.setState({
      activeRoom: room,
      localMediaAvailable: true,
      hasJoinedRoom: true,
    });

    var previewContainer = this.refs.localMedia;
    if (!previewContainer.querySelector("video")) {
      this.attachParticipantTracks(room.localParticipant, previewContainer);
    }
  }

  render() {
    let showLocalTrack = this.state.localMediaAvailable ? (
      <div className="flex-item">
        <div ref="localMedia" />
      </div>
    ) : (
      ""
    );

    let joinOrLeaveRoomButton = this.state.hasJoinedRoom ? (
      <RaisedButton
        label="Leave Room"
        secondary={true}
        onClick={() => alert("Leave Room")}
      />
    ) : (
      <RaisedButton lable="Join Room" primary={true} onClick={this.joinRoom} />
    );

    return (
      <Card>
        <CardText>
          <div className="flex-container">
            {showLocalTrack}
            <div className="flex-item">
              <TextField
                hintText="Room Name"
                onChange={this.handleRoomNameChange}
                errorText={
                  this.state.roomNameErr ? "Room Name is required" : undefined
                }
              />
              <br />
              {joinOrLeaveRoomButton}
            </div>
            <div className="flex-item" ref="remoteMedia" id="remote-media" />
          </div>
        </CardText>
      </Card>
    );
  }
}
