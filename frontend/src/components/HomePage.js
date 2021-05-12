import React from 'react';
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRomPage';
import Room from './Room';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

const HomePage = () => {
	return (
		<Router>
			<Switch>
				<Route path="/" exact>
					<p>this is the home page</p>
				</Route>
				<Route path="/join" component={RoomJoinPage} />
				<Route path="/create" component={CreateRoomPage} />
				<Route path="/room/:roomCode" component={Room} />
			</Switch>
		</Router>
	);
};

export default HomePage;
