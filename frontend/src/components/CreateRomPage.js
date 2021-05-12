import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { Link, useHistory } from 'react-router-dom';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const CreateRoomPage = () => {
	const defaultVotes = 2;
	const [ data, setData ] = useState({
		guestCanPause: true,
		votesToSkip: defaultVotes
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

	return (
		<Grid container spacing={1}>
			<Grid item xs={12} align="center">
				<Typography component="h4" variant="h4">
					Create a Room
				</Typography>
			</Grid>
			<Grid item xs={12} align="center">
				<FormControl component="fieldset">
					<FormHelperText>
						<div align="center">Guest Control of Playback State</div>
					</FormHelperText>
					<RadioGroup row defaultValue="true" onChange={handleGuestCanPause}>
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
						defaultValue={defaultVotes}
						inputProps={{ min: 1, style: { textAlign: 'center' } }}
						onChange={handelVotesChange}
					/>
					<FormHelperText>
						<div align="center">Votes required to skip song</div>
					</FormHelperText>
				</FormControl>
			</Grid>
			<Grid item xs={12} align="center">
				<Button
					color="primary"
					variant="contained"
					onClick={(e) => handleRoomButtonPressed(e)}
				>
					Create a Button
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

export default CreateRoomPage;
