import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Movie } from '../types/app';
import MovieList from '../components/movies/MovieList';

interface MovieDetailProps {
  route: {
    params: {
      id: number;
    };
  };
}

const MovieDetail: React.FC<MovieDetailProps> = ({ route }: MovieDetailProps): JSX.Element => {
  const { id } = route.params;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    getMovieDetail();
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async (): Promise<void> => {
    try {
      const favoriteMovies = await AsyncStorage.getItem('favoriteMovies');
      if (favoriteMovies) {
        const favoriteMoviesArray: Movie[] = JSON.parse(favoriteMovies);
        const isFavoriteMovie = favoriteMoviesArray.some((favMovie: Movie) => favMovie.id === id);
        setIsFavorite(isFavoriteMovie);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMovieDetail = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMovie(response);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };

  const toggleFavorite = async (): Promise<void> => {
    try {
      let favoriteMovies = await AsyncStorage.getItem('favoriteMovies');
      let favoriteMoviesArray: Movie[] = [];

      if (favoriteMovies) {
        favoriteMoviesArray = JSON.parse(favoriteMovies);
      }

      if (isFavorite) {
        favoriteMoviesArray = favoriteMoviesArray.filter((favMovie: Movie) => favMovie.id !== id);
        setIsFavorite(false);
      } else {
        favoriteMoviesArray.push(movie!); 
        setIsFavorite(true);
      }

      await AsyncStorage.setItem('favoriteMovies', JSON.stringify(favoriteMoviesArray));
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  const renderStars = (rating: number): JSX.Element[] => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FontAwesome key={i} name="star" size={14} color="yellow" />);
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(<FontAwesome key={i} name="star-half-empty" size={14} color="yellow" />);
      } else {
        stars.push(<FontAwesome key={i} name="star-o" size={14} color="yellow" />);
      }
    }
    return stars;
  };

  if (!movie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <ImageBackground
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
        }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <Text style={styles.title}>{movie.title}</Text>
          <View style={styles.ratingContainer}>
            {renderStars(movie.vote_average / 2)}
            <Text style={styles.ratingText}>
              {Math.round(movie.vote_average * 10) / 10}
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleFavorite}
            style={styles.favoriteIcon}
          >
            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={32}
              color="red"
            />
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
      <View style={styles.container}>
        <Text style={styles.overview}>{movie.overview}</Text>
        <View style={styles.detailRow}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Original Language</Text>
            <Text style={styles.detailValue}>{movie.original_language}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Popularity</Text>
            <Text style={styles.detailValue}>{Math.round(movie.popularity)}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Release Date</Text>
            <Text style={styles.detailValue}>{new Date(movie.release_date).toDateString()}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Vote Count</Text>
            <Text style={styles.detailValue}>{movie.vote_count}</Text>
          </View>
        </View>

        <MovieList
          title="Recommendations"
          path={`movie/${id}/recommendations?language=en-US&page=1`}
          coverType="poster"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',
  },
  gradient: {
    width: '100%',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'yellow',
    marginLeft: 8,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  container: {
    padding: 16,
  },
  overview: {
    fontSize: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    color: 'black',
  },
});

export default MovieDetail;
