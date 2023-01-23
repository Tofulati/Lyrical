import pandas as pd
import spotipy
sp = spotipy.Spotify()
from spotipy.oauth2 import SpotifyClientCredentials

def extract(playlistID):

    client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    sp.trace = False

    results = sp.playlist_items(playlistID)
    tracks = results['items']
    while results['next']:
        results = sp.next(results)
        tracks.extend(results['items'])
    results = tracks

    playlist_tracks_id = []
    playlist_tracks_titles = []
    playlist_tracks_artists = []

    for i in range(len(results)):
        if i == 0:
            playlist_tracks_id = results[i]['track']['id']
            playlist_tracks_titles = results[i]['track']['name']

            artist_list = []
            for artist in results[i]['track']['artists']:
                artist_list = artist['name']
            playlist_tracks_artists = artist_list

            features = sp.audio_features(playlist_tracks_id)
            features_df = pd.DataFrame(data=features, columns=features[0].keys())
            features_df['title'] = playlist_tracks_titles
            features_df['artist'] = playlist_tracks_artists
            features_df = features_df[['id', 'title', 'artist', 'speechiness',
                                       'danceability', 'energy', 'key', 'loudness',
                                       'mode', 'acousticness', 'instrumentalness',
                                       'liveness', 'valence', 'tempo',
                                       'duration_ms', 'time_signature']]
            continue
        else:
            try:
                playlist_tracks_id = results[i]['track']['id']
                playlist_tracks_titles = results[i]['track']['name']
                artist_list = []
                for artist in results[i]['track']['artists']:
                    artist_list = artist['name']
                playlist_tracks_artists = artist_list
                features = sp.audio_features(playlist_tracks_id)
                new_row = {'id': [playlist_tracks_id],
                           'title': [playlist_tracks_titles],
                           'artist': [playlist_tracks_artists],
                           'speechiness': [features[0]['speechiness']],
                           'danceability': [features[0]['danceability']],
                           'energy': [features[0]['energy']],
                           'key': [features[0]['key']],
                           'loudness': [features[0]['loudness']],
                           'mode': [features[0]['mode']],
                           'acousticness': [features[0]['acousticness']],
                           'instrumentalness': [features[0]['instrumentalness']],
                           'liveness': [features[0]['liveness']],
                           'valence': [features[0]['valence']],
                           'tempo': [features[0]['tempo']],
                           'duration_ms': [features[0]['duration_ms']],
                           'time_signature': [features[0]['time_signature']]
                           }

                dfs = [features_df, pd.DataFrame(new_row)]
                features_df = pd.concat(dfs, ignore_index=True)
            except:
                continue
    features_df.to_csv('song_attributes.csv', index=False)
