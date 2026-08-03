import { useEffect, useState } from "react";
import { getMovieDetails, getSimilarMovies } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";

function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext();
    const [movie, setMovie] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMovieDetails = async function() {
            try {
                setLoading(true);
                const movieDetails = await getMovieDetails(id);
                setMovie(movieDetails);
            } catch(err) {
                console.log(err);
                setError("Failed to load movie details...");
            } finally {
                setLoading(false);
            }
        }
        loadMovieDetails();
    }, [id]);

    useEffect(() => {
        if (!id) return;
        const loadSimilarMovies = async function() {
            try {
                const similarMovies = await getSimilarMovies(id);
                setSimilar(similarMovies);
            } catch(err) {
                console.log(err);
                setError("Failed to load similar movies...");
            }
        }
        loadSimilarMovies();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>
    if (!movie) return null;

    const favorite = isFavorite(movie.id);
    const director = movie.credits?.crew?.find(p => p.job === "Director");
    const cast = movie.credits?.cast?.slice(0, 12) || [];
    const trailer = movie.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");

    const onFavoriteClick = function(e) {
        e.preventDefault();
        if (favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
    };

    return (
        <div className="details-page">
            <section className="details-content">
                <button className="back-button" onClick={() => navigate(-1)}>←</button>
                <div className="details-poster">
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                </div>
                <div className="details-info">
                    <div className="details-info-list">
                        <h1 className="details-title">{movie.title}</h1>
                        <p className="details-tagline">{movie.tagline}</p>
                        <ul className="details-list">
                            <li className="details-info-list">{movie.release_date}</li>
                            <li className="details-info-list">·</li>
                            <li className="details-info-list">{movie.runtime}</li>
                            <li className="details-info-list">·</li>
                            {movie.genres?.map(g => (
                                <li  className="details-info-list genres" key={g.id}>{g.name}</li>
                            ))}
                        </ul>
                        <div className="details-rating">
                            <span className="details-rating-average">{movie.vote_average.toFixed(1)}</span>
                            <span className="details-rating-label">/ 10</span>
                            <p className="details-tmdb">TMBD Rating</p>
                        </div>
                        <p className="details-overview">{movie.overview}</p>
                        <div className="details-credits">Directed by <span className="crew">{director?.name}</span></div>
                        <button className="details-favorite" onClick={onFavoriteClick}>
                            {favorite ? "Added to favorites" : "Add to favorites"}
                        </button>
                    </div>
                </div>
            </section>

            <section className="details-video">
                <h1 className="details-title-trailer">Trailer</h1>
                <div className="trailer">
                    <iframe width="100%" height="450" src={`https://www.youtube.com/embed/${trailer?.key}`} 
                        title="Fight Club (1999) Trailer #1 | Movieclips Classic Trailers" frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>                 
                    </iframe>
                </div>
            </section>

            <section className="details-cast">
                <h1 className="details-title-cast">Cast</h1>
                <div className="cast">
                    {cast.map(actor => (
                        <div className="cast-card" key={actor.id}>
                            <img src={
                                actor.profile_path 
                                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                : "/placeholder.jpg"
                            }  
                            alt={actor.name} />
                            <p className="actor-name">{actor.name}</p>
                            <p className="actor-character">{actor.character}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="details-similar">
                <h1 className="details-title-similar">Similar</h1>
                <p className="details-similar-sub">If you liked <span className="similar-title">{movie.title}</span>, you might also like...</p>
                <div className="similar-grid">
                    {similar.map((movie) => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            </section>
        </div>
    );
}

export default MovieDetails;