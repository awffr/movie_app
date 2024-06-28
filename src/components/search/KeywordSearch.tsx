import React, { useState } from 'react'
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome } from '@expo/vector-icons'
import type { Movie } from '../../types/app'
import { LinearGradient } from 'expo-linear-gradient'
import { API_ACCESS_TOKEN } from '@env'

const KeywordSearch = (): JSX.Element => {
  const [keyword, setKeyword] = useState<string>('')
  const [movies, setMovies] = useState<any[]>([])
  const navigation = useNavigation()

  const searchMovies = async (): Promise<void> => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}`
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
        source={{
          uri: `https://image.tmdb.org/t/p/w500${(item as Movie).poster_path}`,
        }}
        style={styles.cardImage}
      >
        <LinearGradient
          colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
          locations={[0.6, 0.8]}
          style={styles.gradientStyle}
        >
          <View>
            <Text style={styles.cardTitle}>{(item as Movie).title}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="yellow" />
            <Text style={styles.rating}>
              {(item as Movie).vote_average.toFixed(1)}
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  )

  return (
    <View>
      <TextInput
        style={styles.input}
        value={keyword}
        onChangeText={setKeyword}
        placeholder="Search movies..."
        onSubmitEditing={searchMovies}
      />
      <FontAwesome
        name="search"
        size={20}
        color="gray"
        style={styles.searchIcon}
      />
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.resultsContainer}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 20,
    paddingLeft: 20,
  },
  searchIcon: {
    position: 'absolute',
    right: 18,
    top: 8,
  },
  resultsContainer: {
    padding: 8,
  },
  card: {
    flex: 1,
    margin: 4,
    height: 200,
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

export default KeywordSearch
