import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, IconButton } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';
import { Link } from 'react-router-dom';

const pages = {
	JOIN: 'pages.join',
	CREATE: 'pages.create'
};

export default function Info(props) {
	const [ page, setPage ] = useState(pages.JOIN);

	function joinInfo() {
		return (
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<Typography component="h6" variant="h6">
						Join Music Room
					</Typography>
				</Grid>
				<Grid item xs={12} align="left">
					<Typography variant="body1">
						Use the code of a friend room, to listen his Sotify playlist. You are also
						able to pause and skip songs, if he gives you permission.
					</Typography>
				</Grid>
			</Grid>
		);
	}

	function createInfo() {
		return (
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<Typography component="h6" variant="h6">
						Create Music Room
					</Typography>
				</Grid>
				<Grid item xs={12} align="left">
					<Typography variant="body1">
						Create your own Room to listen with friends your Sotify playlist. You are
						able to give permission, in your room, to pause and skip song.
					</Typography>
				</Grid>
			</Grid>
		);
	}

	return (
		<Grid container spacing={1} className="info-container">
			<Grid item xs={12} align="center">
				<Typography component="h4" variant="h4">
					What is Music Share?
				</Typography>
			</Grid>

			{page === pages.JOIN ? joinInfo() : createInfo()}

			<Grid item xs={12} align="center">
				<IconButton
					onClick={() =>
						page === pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE)}
				>
					{page === pages.CREATE ? <NavigateBeforeIcon /> : <NavigateNext />}
				</IconButton>
			</Grid>
			<Grid item xs={12} align="center">
				<Button color="secondary" variant="contained" to="/" component={Link}>
					Back
				</Button>
			</Grid>
		</Grid>
	);
}
