import React, { useEffect, useState } from 'react';
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRomPage';
import Room from './Room';
import Info from './Info';
import { Grid, Button, ButtonGroup, Typography, IconButton } from '@material-ui/core';
import { Help } from '@material-ui/icons';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

const HomePage = () => {
	const [ roomCode, setRoomCode ] = useState(null);
	useEffect(async () => {
		fetch('/api/user-in-room').then((response) => response.json()).then((data) => {
			setRoomCode(data.code);
		});
	}, []);

	const renderHomePage = () => {
		return (
			<Grid container spacing={3} className="homepage">
				<Grid item xs={12} align="center">
					<Typography variant="h2" compact="h2">
						Music Share
					</Typography>
					<img src="../../static/images/music-illustration2.png" alt="illustration" />
				</Grid>
				<Grid item xs={12} align="center">
					<ButtonGroup disableElevation variant="contained" color="primary">
						<Button color="primary" to="/join" component={Link} className="join-btn">
							Join a Room
						</Button>

						<Button
							color="secondary"
							to="/create"
							component={Link}
							className="create-btn"
						>
							Create a Room
						</Button>
					</ButtonGroup>
				</Grid>

				<IconButton color="default" to="/info" component={Link} className="question-mark">
					<Help />
				</IconButton>
			</Grid>
		);
	};

	const clearRoomCode = () => {
		setRoomCode(null);
	};

	return (
		<Router>
			<Switch>
				<Route
					path="/"
					exact
					render={() => {
						return roomCode ? <Redirect to={`/room/${roomCode}`} /> : renderHomePage();
					}}
				/>

				<Route path="/join" component={RoomJoinPage} />
				<Route path="/info" component={Info} />
				<Route path="/create" component={CreateRoomPage} />
				<Route
					path="/room/:roomCode"
					render={(props) => {
						return <Room {...props} leaveRoomCallback={clearRoomCode} />;
					}}
				/>
			</Switch>
		</Router>
	);
};

export default HomePage;
