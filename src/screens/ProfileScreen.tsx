import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/authContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const addOrUpdateNote = () => {
    if (note.trim() === '') return;

    if (editingNoteId) {
      // Update existing note
      setNotes((prev) =>
        prev.map((item) =>
          item.id === editingNoteId ? { ...item, text: note } : item
        )
      );
      setEditingNoteId(null);
    } else {
      // Add new note
      const newNote = {
        id: Date.now().toString(),
        text: note,
        time: new Date().toLocaleString(),
      };
      setNotes([newNote, ...notes]);
    }

    setNote('');
  };

  const editNote = (id) => {
    const noteToEdit = notes.find((item) => item.id === id);
    if (noteToEdit) {
      setNote(noteToEdit.text);
      setEditingNoteId(id);
    }
  };

  const deleteNote = (id) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setNotes((prev) => prev.filter((item) => item.id !== id));
          if (editingNoteId === id) {
            setNote('');
            setEditingNoteId(null);
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Profile Image */}
          <View style={styles.imageWrapper}>
            <Image
              source={require('../../assets/images/profile.png')}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>

          {/* User Info */}
          <Text style={styles.name}>{user?.name || user?.email || 'User Name'}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          {/* Input */}
          <TextInput
            style={styles.input}
            placeholder="Add a note about shop/customer"
            value={note}
            onChangeText={setNote}
            multiline
          />

          <TouchableOpacity style={styles.saveButton} onPress={addOrUpdateNote}>
            <Text style={styles.buttonText}>
              {editingNoteId ? 'Update Note' : 'Save Note'}
            </Text>
          </TouchableOpacity>

          {/* Notes List */}
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.noteItem}>
                <Text style={styles.noteText}>{item.text}</Text>
                <Text style={styles.noteTime}>{item.time}</Text>
                <View style={styles.noteActions}>
                  <TouchableOpacity onPress={() => editNote(item.id)}>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteNote(item.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            style={{ width: '100%' }}
            scrollEnabled={false}
          />

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  imageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  email: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderColor: '#94a3b8',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
    width: '100%',
  },
  logoutButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 16,
    marginBottom: 30,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  noteItem: {
    backgroundColor: '#e2e8f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  noteText: {
    color: '#1e293b',
    fontSize: 14,
    marginBottom: 4,
  },
  noteTime: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
  },
  editText: {
    color: '#2563eb',
    fontWeight: '500',
  },
  deleteText: {
    color: '#dc2626',
    fontWeight: '500',
  },
});
