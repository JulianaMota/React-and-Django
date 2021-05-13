import React, { useState } from 'react';
import { TextField, Button, Typography, Grid } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

const RoomJoinPage = () => {
	const [ data, setData ] = useState({
		roomCode: '',
		error: ''
	});
	const history = useHistory();

	const handleTextFieldChange = (e) => {
		setData((prevData) => {
			return {
				...prevData,
				roomCode: e.target.value
			};
		});
		console.log(data);
	};

	const roomButtonPressed = (e) => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				code: data.roomCode
			})
		};
		fetch('/api/join-room', requestOptions)
			.then((response) => {
				if (response.ok) {
					history.push(`/room/${data.roomCode}`);
				} else {
					setData((prevData) => {
						return {
							...prevData,
							error: 'Room not found.'
						};
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<Grid container spacing={1}>
			<Grid item xs={12} align="center">
				<Typography variant="h4" component="h4">
					Join a Room
				</Typography>
			</Grid>
			<Grid item xs={12} align="center">
				<TextField
					error={data.error}
					label="Code"
					placeholder="Enter a Room Code"
					value={data.roomCode}
					helperText={data.error}
					variant="outlined"
					onChange={handleTextFieldChange}
				/>
			</Grid>
			<Grid item xs={12} align="center">
				<Button variant="contained" color="primary" onClick={roomButtonPressed}>
					Enter Room
				</Button>
			</Grid>
			<Grid item xs={12} align="center">
				<Button variant="contained" color="secondary" to="/" component={Link}>
					Back
				</Button>
			</Grid>
		</Grid>
	);
};

export default RoomJoinPage;
