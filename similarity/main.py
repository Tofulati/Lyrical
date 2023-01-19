from song_search import *
from query import *
from extract import *

# Create "song_attributes.csv" from Spotify Playlist Share link
playlist_url = input("Spotify Playlist URL: ")
playlist_id = getPlaylistID(playlist_url)
extract(playlist_id)

dfSongs = pd.read_csv('song_attributes.csv')
rows, cols = dfSongs.shape

# song_url = input("Spotify song URL: ")       # Spotify song URL
# song = song_search(song_url)
# songName = song['name']

songIndex = 324
columns = ['acousticness','danceability','energy','instrumentalness','liveness','tempo','valence']
func, param = knnQuery, 10
response = querySimilars(dfSongs, columns, songIndex, func, param)

anySong = dfSongs.loc[songIndex]
anySongInfo = anySong['artist'] + " - " + anySong['title']
sptfyLink = "http://open.spotify.com/track/" + anySong['id']
print(f"[Reference Song]\n{anySongInfo}\n{sptfyLink}\n")

print("[Similar songs]")
for idx in response:
    anySong = dfSongs.loc[idx]
    anySongInfo = anySong['artist'] + " - " + anySong['title']
    sptfyLink = "http://open.spotify.com/track/" + anySong['id']
    print(f"{anySongInfo}\n{sptfyLink}\n------------------------------------")

