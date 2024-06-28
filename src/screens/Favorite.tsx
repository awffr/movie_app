import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Movie } from '../types/app';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 12;

const Favorite = (): JSX.Element => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const navigation = useNavigation();

  const getFavoriteMovies = async (): Promise<void> => {
    try {
      const storedMovies = await AsyncStorage.getItem('favoriteMovies');
      if (storedMovies !== null) {
        setFavoriteMovies(JSON.parse(storedMovies));
      }
    } catch (error) {
      console.log('Error fetching favorite movies:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getFavoriteMovies();
    }, [])
  );

  useEffect(() => {
    if (favoriteMovies.length > 0 && favoriteMovies.length % 2 !== 0) {
      const fillEmpty = Array(2 - (favoriteMovies.length % 2)).fill({});
      setFavoriteMovies([...favoriteMovies, ...fillEmpty]);
    }
  }, [favoriteMovies]);

  const renderMovieItem = ({ item }: { item: Movie | {} }): JSX.Element =>
    'id' in item ? (
      <TouchableOpacity
        key={(item as Movie).id.toString()} 
        style={styles.card}
        onPress={() =>
          navigation.navigate('MovieDetail', { id: (item as Movie).id })
        }
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
    ) : (
      <View key={`empty-${Math.random()}`} style={[styles.card, styles.emptyCard]} /> 
    );

  if (favoriteMovies.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorite movies found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Favorites</Text>
      </View>
      <FlatList
        data={favoriteMovies}
        renderItem={renderMovieItem}
        keyExtractor={(item, index) =>
          'id' in item ? (item as Movie).id.toString() : `empty-${index}`
        }
        numColumns={2}
        contentContainerStyle={styles.container}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FDEDEC',
  },
  container: {
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F', 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#D32F2F', 
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    margin: 4,
    height: cardWidth * 1.5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  emptyCard: {
    backgroundColor: 'transparent',
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
});

export default Favorite;
