import spotipy
import pandas as pd
sp = spotipy.Spotify()
from spotipy.oauth2 import SpotifyClientCredentials

def song_search(spotify_url):

    client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    sp.trace = False

    song = sp.track(spotify_url)

    return song
