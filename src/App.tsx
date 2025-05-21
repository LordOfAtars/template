import React, { useEffect, useState } from 'react';
import './index.css';

interface Image {
    '#text': string;
    size: string;
}

interface Artist {
    name: string;
    playcount: string;
    listeners: string;
    mbid: string;
    url: string;
    streamable: string;
    image: Image[];
}

interface Track {
    image: Image[];
    name: string;
    playcount: string;
    listeners: string;
    mbid: string;
    url: string;
    streamable: string;
    artist: {
        name: string;
        mbid: string;
        url: string;
    };
}

const App: React.FC = () => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const API_KEY = '141130a593cfedaf8911821bbb24d893';

    useEffect(() => {
        const fetchPopularArtists = async () => {
            try {
                const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json&limit=16`);
                if (!response.ok) {
                    throw new Error('Ошибка в сети');
                }
                const data = await response.json();
                console.log(data);
                setArtists(data.artists.artist);
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при загрузке данных');
            }
        };

        const fetchPopularTracks = async () => {
            try {
                const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${API_KEY}&format=json&limit=16`);
                if (!response.ok) {
                    throw new Error('Ошибка в сети');
                }
                const data = await response.json();
                console.log(data);
                setTracks(data.tracks.track);
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при загрузке данных');
            }
        };

        fetchPopularArtists();
        fetchPopularTracks();
    }, []);

    const getImage = (item: Artist | Track) => {
        const extralargeImage = item.image.find((img: Image) => img.size === 'extralarge');
        if (extralargeImage && extralargeImage['#text']) {
            return extralargeImage['#text'];
        }
        const firstAvailableImage = item.image.find((img: Image) => img['#text']);
        return firstAvailableImage ? firstAvailableImage['#text'] : 'https://via.placeholder.com/150';
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1 style={{ color: 'red' }}>last.fm</h1>
            </header>
            <main>
                <section className="music-section">
                    <h2 className="music-section-heading">Music</h2>
                    <div className="music-tags">
                        {artists.map((artist) => (
                            <div key={artist.name} className="music-featured-item">
                                <div className="music-featured-item-avatar artist">
                                    <img src={getImage(artist)} alt={artist.name} />
                                </div>
                                <h3 className="music-featured-item-heading">{artist.name}</h3>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="music-section">
                    <h2 className="music-section-heading">Popular tracks</h2>
                    <div className="music-tags tracks">
                        {tracks.map((track) => (
                            <div key={track.name} className="music-featured-item track">
                                <div className="music-featured-item-avatar track">
                                    <img src={getImage(track)} alt={track.name} />
                                </div>
                                <div className="music-featured-item-info">
                                    <h3 className="music-featured-item-heading">{track.name}</h3>
                                        <p>Исполнитель: {track.artist.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <footer className="App-footer">
                <p>© 2023 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;