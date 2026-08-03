import { Link } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";

function MovieCard({ movie }) {
    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext();
    const favorite = isFavorite(movie.id);

    const onFavoriteClick = function(e) {
        e.preventDefault();
        if (favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
    };

    return (
        <Link to={`/movie/${movie.id}`}>
            <div className="movie-card">
                <div className="movie-poster">
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                    <div className="movie-overlay">
                        <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>♥</button>
                    </div>
                </div>
                <div className="movie-details">
                    <h3>{movie.title}</h3>
                    <p>{movie.release_date?.split("-")[0]}</p>
                </div>
            </div>
        </Link>
    );
}

export default MovieCard;