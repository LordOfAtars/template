import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Search.css';

const API_KEY = '141130a593cfedaf8911821bbb24d893';

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
    listeners: string;
    mbid: string;
    url: string;
    artist: string;
}

interface Album {
    image: Image[];
    name: string;
    mbid: string;
    url: string;
    artist: string;
}

const Search: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Top Results');
    const [results, setResults] = useState<{
        artists: Artist[];
        albums: Album[];
        tracks: Track[];
    }>({
        artists: [],
        albums: [],
        tracks: [],
    });
    const [error, setError] = useState<string | null>(null);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    /**
     * Обрабатывает ввод поиска и запускает поиск при нажатии клавиши Enter.
     * @param e - Событие клавиатуры.
     */
    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchTerm.trim() === '') {
                alert('Введите текст для поиска');
            } else {
                await fetchResults();
            }
        }
    };

    /**
     * Получает результаты поиска из API Last.fm.
     */
    const fetchResults = async () => {
        try {
            const artistResponse = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(searchTerm)}&api_key=${API_KEY}&format=json&limit=12`
            );
            const trackResponse = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(searchTerm)}&api_key=${API_KEY}&format=json&limit=12`
            );
            const albumResponse = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(searchTerm)}&api_key=${API_KEY}&format=json&limit=12`
            );

            if (!artistResponse.ok || !trackResponse.ok || !albumResponse.ok) {
                throw new Error('Ошибка при получении данных с сервера');
            }

            const artistData = await artistResponse.json();
            const trackData = await trackResponse.json();
            const albumData = await albumResponse.json();

            setResults({
                artists: artistData.results.artistmatches.artist || [],
                albums: albumData.results.albummatches.album || [],
                tracks: trackData.results.trackmatches.track || [],
            });
            setError(null); // Сброс ошибки, если данные успешно получены
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
        }
    };

    /**
     * Отображает результаты в зависимости от активной вкладки.
     * @returns JSX.Element
     */
    const renderResults = (type: 'artists' | 'albums' | 'tracks', title: string) => (
        <div>
            <h3>{title}</h3>
            <div className="results-block">
                {results[type].length > 0 ? (
                    results[type].map((item, index) => (
                        <div key={item.mbid || `${type}-${index}`} className="result-item">
                            <img src={item.image[2]['#text']} alt={item.name} />
                            <div>
                                <h4>{item.name}</h4>
                                {type === 'albums' && 'artist' in item && (
                                    <p>Автор: {item.artist}</p>
                                )}
                                {type === 'tracks' && (
                                    <>
                                        {'artist' in item && <p>Исполнитель: {item.artist}</p>}
                                        {'listeners' in item && <p>Прослушиваний: {item.listeners}</p>}
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>The search results will be displayed here</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="search-page">
            <nav className="search-nav">
                <button onClick={() => handleTabClick('Top Results')}>Top Results</button>
                <button onClick={() => handleTabClick('Artists')}>Artists</button>
                <button onClick={() => handleTabClick('Albums')}>Albums</button>
                <button onClick={() => handleTabClick('Tracks')}>Tracks</button>
            </nav>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="search-input"
            />
            {error && <p className="error-message">{error}</p>}
            <div className="results-container">
                {activeTab === 'Top Results' && (
                    <>
                        {renderResults('artists', 'Artists')}
                        {renderResults('albums', 'Albums')}
                        {renderResults('tracks', 'Tracks')}
                    </>
                )}
                {activeTab === 'Artists' && renderResults('artists', 'Artists')}
                {activeTab === 'Albums' && renderResults('albums', 'Albums')}
                {activeTab === 'Tracks' && renderResults('tracks', 'Tracks')}
            </div>
            <Link to="/" className="search-back-button">Back</Link>
        </div>
    );
};

export default Search;