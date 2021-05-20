import React from 'react';
import { Grid, Typography, Card, IconButton, LinearProgress } from '@material-ui/core';
import { PlayArrow, SkipNext, Pause } from '@material-ui/icons';

const MusicPlayer = (props) => {
	const songProgress = props.time / props.duration * 100;

	const pauseSong = () => {
		const requestOptions = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' }
		};
		fetch('/spotify/pause', requestOptions);
	};

	const playSong = () => {
		const requestOptions = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' }
		};
		fetch('/spotify/play', requestOptions);
	};

	const skipSong = () => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		};
		fetch('/spotify/skip', requestOptions);
	};

	return (
		<Card className="music-container">
			<Grid container alignItems="center">
				<Grid item align="center" xs={4}>
					<img
						src={
							props.image_url ? (
								props.image_url
							) : (
								'../../static/images/song-placeholder.png'
							)
						}
						height="100%"
						width="100%"
					/>
				</Grid>
				<Grid item align="center" xs={8}>
					<Typography component="h5" variant="h5">
						{props.title ? props.title : 'Music Title'}
					</Typography>
					<Typography color="textSecondary" variant="subtitle1">
						{props.artist ? props.artist : 'Artist Name'}
					</Typography>
					<Grid item align="center" xs={12} className="controls">
						<IconButton
							onClick={() => {
								props.is_playing ? pauseSong() : playSong();
							}}
						>
							{props.is_playing ? <Pause /> : <PlayArrow />}
						</IconButton>

						<IconButton onClick={() => skipSong()}>
							<SkipNext />
						</IconButton>
						<Typography>
							Votes to Skip {props.votes ? props.votes : 0}/{props.votes_required ? props.votes_required : 0}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			<LinearProgress variant="determinate" value={songProgress} />
		</Card>
	);
};

export default MusicPlayer;
