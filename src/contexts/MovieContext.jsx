import { createContext, useContext, useEffect, useRef, useState } from "react";

const MovieContext = createContext();

export const useMovieContext = function() {
    return useContext(MovieContext);
};

export const MovieProvider = function({ children }) {
    const [favorites, setFavorites] = useState([]);
    const isFirstRender = useRef(true);

    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites");
        if (storedFavs) setFavorites(JSON.parse(storedFavs));
    }, []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = function(movie) {
        setFavorites(prev => [...prev, movie]);
    };

    const removeFromFavorites = function(movieId) {
        setFavorites(prev => prev.filter(movie => movie.id !== movieId));
    };

    const isFavorite = function(movieId) {
        return favorites.some(movie => movie.id === movieId);
    };

    return (
        <MovieContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
            {children}
        </MovieContext.Provider>
    );
};