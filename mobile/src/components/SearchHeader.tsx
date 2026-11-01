import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';

interface SearchHeaderProps {
  onSearch: (query: string) => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [isInstallingUpdate, setIsInstallingUpdate] = useState(false);

  const handleUpdateInstall = async () => {
    try {
      setIsInstallingUpdate(true);
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch {
      Alert.alert('Update Install Failed', 'Unable to install the update. Please try again later.');
    } finally {
      setIsInstallingUpdate(false);
    }
  };

  const handleUpdateCheck = async () => {
    try {
      setIsCheckingUpdate(true);
      if (!Updates.isEnabled) {
        Alert.alert('Updates Unavailable', 'Updates are not enabled for this build.');
        return;
      }

      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(
          'Update Available',
          'A new version of the Road Collector is ready. Download and restart now?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Install Now',
              onPress: handleUpdateInstall,
            },
          ]
        );
      } else {
        Alert.alert('Up to Date', 'You are running the latest version of the app.');
      }
    } catch {
      Alert.alert('Update Check Failed', 'Unable to check for updates. Please try again later.');
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const handleChange = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search by area (e.g. Sowutuom, Anyaa)..."
          placeholderTextColor="#64748b"
          value={query}
          onChangeText={handleChange}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleChange('')}>
            <Ionicons name="close-circle" size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.installButton}
        onPress={handleUpdateCheck}
        disabled={isCheckingUpdate || isInstallingUpdate}
      >
        <Ionicons name="cloud-download-outline" size={18} color="#f59e0b" />
        <Text style={styles.installText}>
          {isCheckingUpdate ? 'Checking...' : isInstallingUpdate ? 'Installing...' : 'Sync'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 14,
  },
  installButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  installText: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '600',
  },
});