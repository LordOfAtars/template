import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Image, Artist, Track } from './types_app';
import { API_KEY } from './const';
import Search from './Search';
import './index.css';

const App: React.FC = () => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);

    useEffect(() => {
        const fetchData = async (method: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
            try {
                const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=${method}&api_key=${API_KEY}&format=json&limit=16`);
                if (!response.ok) {
                    throw new Error('Ошибка в сети');
                }
                const data = await response.json();
                setter(data);
            } catch (error) {
                console.error('Ошибка:', error);
                const errorMessage = (error as Error).message || 'Неизвестная ошибка';
                alert('Произошла ошибка при загрузке данных: ' + errorMessage);
            }
        };

        fetchData('chart.gettopartists', (data: any) => setArtists(data.artists.artist));
        fetchData('chart.gettoptracks', (data: any) => setTracks(data.tracks.track));
    }, []);

    /**
     * Получает изображение для исполнителя или трека.
     * @param item исполнитель или трек, для которого нужно получить изображение.
     * @returns URL изображения.
     */
    const getImage = (item: Artist | Track): string => {
        const extralargeImage = item.image.find((img: Image) => img.size === 'extralarge');
        if (extralargeImage && extralargeImage['#text']) {
            return extralargeImage['#text'];
        }
        const firstAvailableImage = item.image.find((img: Image) => img['#text']);
        return firstAvailableImage ? firstAvailableImage['#text'] : 'https://via.placeholder.com/150';
    };

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1 className="header-title">last.fm</h1>
                    <Link to="/search">
                        <span className="search-link">Search</span>
                    </Link>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={
                            <>
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
                            </>
                        } />
                        <Route path="/search" element={<Search />} />
                    </Routes>
                </main>
                <footer className="App-footer">
                    <div className="footer-columns">
                        <div className="footer-column">
                            <h4>COMPANY</h4>
                            <p>About LastFm</p>
                        </div>
                        <div className="footer-column">
                            <h4>HELP</h4>
                            <p>Community Support</p>
                        </div>
                        <div className="footer-column">
                            <h4>ACCOUNT</h4>
                            <p>Settings</p>
                        </div>
                        <div className="footer-column">
                            <h4>FOLLOW US</h4>
                            <p>Instagram</p>
                        </div>
                    </div>
                    <p>© 2025 LastFM. All rights reserved.</p>
                </footer>
            </div>
        </Router>
    );
};

export default App;