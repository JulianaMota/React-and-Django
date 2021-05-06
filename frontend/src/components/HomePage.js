import React from 'react';
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRomPage';
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
			</Switch>
		</Router>
	);
};

export default HomePage;
