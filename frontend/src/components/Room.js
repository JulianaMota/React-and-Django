import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core';
import CreateRoomPage from './CreateRomPage';
import MusicPlayer from './MusicPlayer';

const Room = (props) => {
	const [ data, setData ] = useState({
		votesToSkip: 2,
		guestCanPause: false,
		isHost: false,
		showSettings: false
	});
	const [ spotifyAuthenticated, setSpotifyAuthenticated ] = useState(false);
	const [ song, setSong ] = useState({});
	const { roomCode } = useParams();
	const history = useHistory();

	const getRoomDetails = () => {
		// console.log('get data');
		return fetch(`/api/get-room?code=${roomCode}`)
			.then((response) => {
				if (!response.ok) {
					props.leaveRoomCallback();
					history.push('/');
				}
				return response.json();
			})
			.then((data) => {
				// console.log(data);
				setData((prevData) => {
					return {
						...prevData,
						votesToSkip: data.votes_to_skip,
						guestCanPause: data.guest_can_pause,
						isHost: data.is_host
					};
				});
				if (data.is_host) {
					authenticateSpotify();
				}
			});
	};

	const authenticateSpotify = () => {
		fetch('/spotify/is-authenticated').then((response) => response.json()).then((data) => {
			setSpotifyAuthenticated(data.status);
			if (!data.status) {
				fetch('/spotify/get-auth-url').then((response) => response.json()).then((data) => {
					window.location.replace(data.url);
				});
			}
		});
	};

	const leaveButtonPressed = () => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		};
		fetch('/api/leave-room', requestOptions).then((_response) => {
			props.leaveRoomCallback();
			history.push('/');
		});
	};

	const updateShowSettings = (value) => {
		setData((prevData) => {
			return {
				...prevData,
				showSettings: value
			};
		});
	};

	const renderSettings = () => {
		return (
			<Grid container spacing={1} className="create-container">
				<Grid item xs={12} align="center">
					<CreateRoomPage
						update={true}
						votesToSkip={data.votesToSkip}
						guestCanPause={data.guestCanPause}
						roomCode={roomCode}
						updateCallback={getRoomDetails}
					/>
				</Grid>
				<Grid item xs={12} align="center">
					<Button
						color="secondary"
						variant="contained"
						onClick={() => updateShowSettings(false)}
						className="close-btn"
					>
						Close
					</Button>
				</Grid>
			</Grid>
		);
	};

	const renderSettingsButton = () => {
		return (
			<Grid item xs={12} align="center">
				<Button
					variant="contained"
					color="primary"
					onClick={() => updateShowSettings(true)}
					className="settings-btn"
				>
					Settings
				</Button>
			</Grid>
		);
	};

	const getCurrentSong = () => {
		fetch('/spotify/current-song')
			.then((response) => {
				if (!response.ok) {
					return {};
				} else {
					return response.json();
				}
			})
			.then((data) => setSong(data));
	};

	useEffect(() => {
		getRoomDetails();
		getCurrentSong();
		const interval = setInterval(() => {
			getCurrentSong();
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			{data.showSettings ? (
				renderSettings()
			) : (
				<Grid container spacing={1} className="room-container">
					<Grid item xs={12} align="center">
						<Typography variant="h4" component="h4">
							<span>Code:</span> {roomCode}
						</Typography>
					</Grid>
					<MusicPlayer {...song} />
					{data.isHost ? renderSettingsButton() : null}
					<Grid item xs={12} align="center">
						<Button
							variant="contained"
							color="secondary"
							className="leave-btn"
							onClick={leaveButtonPressed}
						>
							Leave Room
						</Button>
					</Grid>
				</Grid>
			)}
		</div>
	);
};

export default Room;
