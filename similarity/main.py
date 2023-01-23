from song_search import *
from query import *
from extract import *

# Create "song_attributes.csv" from Spotify Playlist Share link
playlist_url = input("Spotify Playlist URL: ")
playlist_id = getPlaylistID(playlist_url)
extract(playlist_id)

dfSongs = pd.read_csv('song_attributes.csv')
rows, cols = dfSongs.shape

song_url = input("Spotify song URL: ")       # Spotify song URL
song = song_search(song_url)
simSong = pd.read_csv('searched_song.csv')
rows, cols = simSong.shape

k = int(input("Song recommendations: "))
print()

idx = 0
counter = 0
for i in range(len(dfSongs)):
    if simSong.loc[0]['id'] in dfSongs['id'][i]:
        idx = counter
        break
    else:
        counter += 1
else:
    dfSongs = pd.concat([dfSongs, simSong], ignore_index=True)
    idx = len(dfSongs)-1

columns = ['acousticness','danceability','energy','instrumentalness','liveness','tempo','valence', 'speechiness', 'mode', 'loudness']
func, param = knnQuery, k
response = querySimilars(dfSongs, columns, idx, func, param)

refSong = simSong.loc[0]
refSongInfo = refSong['artist'] + " - " + refSong['title']
sptfyLink = "http://open.spotify.com/track/" + refSong['id']
print(f"[Reference Song]\n{refSongInfo}\n{sptfyLink}\n")

print("[Similar songs]")
for idx in response:
    simSong = dfSongs.loc[idx]
    simartist = simSong['artist']
    simtitle = simSong['title']
    simSongInfo = simartist + " - " + simtitle
    sptfyLink = "http://open.spotify.com/track/" + simSong['id']
    print(f"{simSongInfo}\n{sptfyLink}\n------------------------------------")



