import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Room = () => {
	const [ data, setData ] = useState({
		votesToSkip: 2,
		guestCanPause: false,
		isHost: false
	});
	const { roomCode } = useParams();

	useEffect(() => {
		fetch(`/api/get-room?code=${roomCode}`).then((response) => response.json()).then((data) => {
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

	return (
		<div>
			<h3>{roomCode}</h3>
			<p>Votes: {data.votesToSkip}</p>
			<p>Guest Can Pause: {data.guestCanPause.toString()}</p>
			<p>Host: {data.isHost.toString()}</p>
		</div>
	);
};

export default Room;
