import spotipy
import pandas as pd
sp = spotipy.Spotify()
from spotipy.oauth2 import SpotifyClientCredentials

def song_search(spotify_url):

    client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    sp.trace = False

    features = sp.audio_features(spotify_url)
    features_df = pd.DataFrame(data=features, columns=features[0].keys())
    features_df['title'] = sp.track(spotify_url)['name']
    features_df['artist'] = sp.track(spotify_url)['artists'][0]['name']
    features_df = features_df[['id', 'title', 'artist', 'speechiness',
                               'danceability', 'energy', 'key', 'loudness',
                               'mode', 'acousticness', 'instrumentalness',
                               'liveness', 'valence', 'tempo',
                               'duration_ms', 'time_signature']]

    features_df.to_csv('searched_song.csv', index=False)

