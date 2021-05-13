import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
	Collapse,
	Grid,
	Typography,
	Button,
	TextField,
	FormHelperText,
	FormControl,
	RadioGroup,
	Radio,
	FormControlLabel
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const CreateRoomPage = (props) => {
	const [ successMsg, setSuccessMsg ] = useState('');
	const [ errorMsg, setErrorMsg ] = useState('');
	const [ data, setData ] = useState({
		guestCanPause: props.guestCanPause,
		votesToSkip: props.votesToSkip
	});
	const history = useHistory();

	const handelVotesChange = (e) => {
		setData((prevData) => {
			return {
				...prevData,
				votesToSkip: e.target.value
			};
		});
	};

	const handleGuestCanPause = (e) => {
		setData((prevData) => {
			return {
				...prevData,
				guestCanPause: e.target.value === 'true' ? true : false
			};
		});
	};

	const handleRoomButtonPressed = (e) => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				votes_to_skip: data.votesToSkip,
				guest_can_pause: data.guestCanPause
			})
		};

		fetch('/api/create-room', requestOptions)
			.then((response) => response.json())
			.then((data) => history.push(`/room/${data.code}`));
	};

	const handleUpdateButtonPressed = () => {
		const requestOptions = {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				votes_to_skip: data.votesToSkip,
				guest_can_pause: data.guestCanPause,
				code: props.roomCode
			})
		};

		fetch('/api/update-room', requestOptions).then((response) => {
			if (response.ok) {
				setSuccessMsg('Room updated successfully!');
			} else {
				setErrorMsg('Error updating room...');
			}
			props.updateCallback();
		});
	};

	const renderCreateButtons = () => {
		return (
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<Button
						color="primary"
						variant="contained"
						onClick={(e) => handleRoomButtonPressed(e)}
					>
						Create a Room
					</Button>
				</Grid>
				<Grid item xs={12} align="center">
					<Button color="secondary" variant="contained" to="/" component={Link}>
						Back
					</Button>
				</Grid>
			</Grid>
		);
	};

	const renderUpdateButtons = () => {
		return (
			<Grid item xs={12} align="center">
				<Button
					color="primary"
					variant="contained"
					onClick={(e) => handleUpdateButtonPressed(e)}
				>
					Update a Room
				</Button>
			</Grid>
		);
	};

	const title = props.update ? 'Update Room' : 'Create a Room';

	return (
		<Grid container spacing={1}>
			<Grid item xs={12} align="center">
				<Collapse in={errorMsg != '' || successMsg != ''}>
					{successMsg != '' ? (
						<Alert
							severity="success"
							onClose={() => {
								setSuccessMsg('');
							}}
						>
							{successMsg}
						</Alert>
					) : (
						<Alert
							severity="error"
							onClose={() => {
								setErrorMsg('');
							}}
						>
							{errorMsg}
						</Alert>
					)}
				</Collapse>
			</Grid>
			<Grid item xs={12} align="center">
				<Typography component="h4" variant="h4">
					{title}
				</Typography>
			</Grid>
			<Grid item xs={12} align="center">
				<FormControl component="fieldset">
					<FormHelperText>
						<div align="center">Guest Control of Playback State</div>
					</FormHelperText>
					<RadioGroup
						row
						defaultValue={props.guestCanPause.toString()}
						onChange={handleGuestCanPause}
					>
						<FormControlLabel
							value="true"
							control={<Radio color="primary" />}
							label="Paly/Pause"
							labelPlacement="bottom"
						/>
						<FormControlLabel
							value="false"
							control={<Radio color="secondary" />}
							label="No control"
							labelPlacement="bottom"
						/>
					</RadioGroup>
				</FormControl>
			</Grid>
			<Grid item xs={12} align="center">
				<FormControl>
					<TextField
						required={true}
						type="number"
						defaultValue={props.votesToSkip}
						inputProps={{ min: 1, style: { textAlign: 'center' } }}
						onChange={handelVotesChange}
					/>
					<FormHelperText>
						<div align="center">Votes required to skip song</div>
					</FormHelperText>
				</FormControl>
			</Grid>
			{props.update ? renderUpdateButtons() : renderCreateButtons()}
		</Grid>
	);
};

CreateRoomPage.defaultProps = {
	votesToSkip: 2,
	guestCanPause: true,
	update: false,
	roomCode: null,
	updateCallback: () => {}
};

export default CreateRoomPage;
