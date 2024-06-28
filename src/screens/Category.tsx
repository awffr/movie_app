import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { API_ACCESS_TOKEN } from '@env'
import { FontAwesome } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import type { Movie } from '../types/app'

const Category = (): JSX.Element => {
  const route = useRoute()
  const navigation = useNavigation()
  const { genreId } = route.params as { genreId: number }
  const [movies, setMovies] = useState<Movie[]>([])
  const [genreName, setGenreName] = useState<string>('')

  useEffect(() => {
    fetchGenreName()
    fetchMoviesByGenre()
  }, [])

  const fetchGenreName = async (): Promise<void> => {
    const url = `https://api.themoviedb.org/3/genre/movie/list`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      const genre = data.genres.find((g: { id: number }) => g.id === genreId)
      if (genre) {
        setGenreName(genre.name)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchMoviesByGenre = async (): Promise<void> => {
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      setMovies(data.results)
    } catch (error) {
      console.log(error)
    }
  }

  const renderMovieItem = ({ item }: { item: Movie }): JSX.Element => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MovieDetail', { id: item.id })}
    >
      <ImageBackground
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.cardImage}
      >
        <LinearGradient
          colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
          locations={[0.6, 0.8]}
          style={styles.gradientStyle}
        >
          <View>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="yellow" />
            <Text style={styles.rating}>{item.vote_average.toFixed(1)}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Category: {genreName}</Text>
        <Text style={styles.subHeaderText}>{movies.length} Movies</Text>
      </View>
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.resultsContainer}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
    color: 'gray',
  },
  resultsContainer: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 4,
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  gradientStyle: {
    padding: 8,
    height: '100%',
    width: '100%',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    color: 'yellow',
    fontWeight: '700',
  },
})

export default Category
