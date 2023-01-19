import numpy as np

# K-query
def knnQuery(queryPoint, arrCharactPoints, k):
    tmp = arrCharactPoints.copy(deep=True)
    tmp['dist'] = tmp.apply(lambda x: np.linalg.norm(x-queryPoint), axis=1)
    tmp = tmp.sort_values('dist')
    return tmp.head(k).index

# Range query
def rangeQuery(queryPoint, arrCharactPoints, radius):
    tmp = arrCharactPoints.copy(deep=True)
    tmp['dist'] = tmp.apply(lambda x: np.linalg.norm(x-queryPoint), axis=1)
    tmp['radius'] = tmp.apply(lambda x: 1 if x['dist'] <= radius else 0, axis=1)
    return tmp.query('radius == 1').index

def querySimilars(df, columns, idx, func, param):
    arr = df[columns].copy(deep=True)
    queryPoint = arr.loc[idx]
    arr = arr.drop([idx])
    response = func(queryPoint, arr, param)
    return response

def getPlaylistID(playlist_link):
    start = 'playlist/'
    end = '?si='
    playlistID = (playlist_link.split(start))[1].split(end)[0]
    return playlistID