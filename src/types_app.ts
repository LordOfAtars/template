export interface Image {
    '#text': string;
    size: string;
}

export interface Artist {
    name: string;
    playcount: string;
    listeners: string;
    mbid: string;
    url: string;
    streamable: string;
    image: Image[];
}

export interface Track {
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