const API_KEY = "539bb8f47578b16a94006e80958b4d83";
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async function() {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    return data.results;
};

export const searchMovies = async function(query) {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    return data.results;
};

export const getMovieDetails = async function(id) {
    const response = await fetch (`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`);
    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    return data;
};

export const getSimilarMovies = async function(id) {
    const response = await fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`);
    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    return data.results;
};