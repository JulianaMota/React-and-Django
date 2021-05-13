import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core';
import CreateRoomPage from './CreateRomPage';

const Room = (props) => {
	const [ data, setData ] = useState({
		votesToSkip: 2,
		guestCanPause: false,
		isHost: false,
		showSettings: false
	});
	const { roomCode } = useParams();
	const history = useHistory();

	useEffect(() => {
		fetch(`/api/get-room?code=${roomCode}`)
			.then((response) => {
				if (!response.ok) {
					props.leaveRoomCallback();
					history.push('/');
				}
				return response.json();
			})
			.then((data) => {
				setData((prevData) => {
					return {
						...prevData,
						votesToSkip: data.votes_to_skip,
						guestCanPause: data.guest_can_pause,
						isHost: data.is_host
					};
				});
			});
	}, []);

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
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<CreateRoomPage
						update={true}
						votesToSkip={data.votesToSkip}
						guestCanPause={data.guestCanPause}
						roomCode={data.roomCode}
						// updateCallback={}
					/>
				</Grid>
				<Grid item xs={12} align="center">
					<Button
						color="secondary"
						variant="contained"
						onClick={() => updateShowSettings(false)}
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
				>
					Settings
				</Button>
			</Grid>
		);
	};

	return (
		<div>
			{data.showSettings ? (
				renderSettings()
			) : (
				<Grid container spacing={1}>
					<Grid item xs={12} align="center">
						<Typography variant="h4" component="h4">
							Code: {roomCode}
						</Typography>
					</Grid>
					<Grid item xs={12} align="center">
						<Typography variant="h6" component="h6">
							Votes: {data.votesToSkip}
						</Typography>
					</Grid>
					<Grid item xs={12} align="center">
						<Typography variant="h6" component="h6">
							Guest Can Pause: {data.guestCanPause.toString()}
						</Typography>
					</Grid>
					<Grid item xs={12} align="center">
						<Typography variant="h6" component="h6">
							Host: {data.isHost.toString()}
						</Typography>
					</Grid>
					{data.isHost ? renderSettingsButton() : null}
					<Grid item xs={12} align="center">
						<Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
							Leave Room
						</Button>
					</Grid>
				</Grid>
			)}
		</div>
	);
};

export default Room;
