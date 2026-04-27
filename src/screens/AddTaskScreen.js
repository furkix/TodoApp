import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { loadTasks, saveTasks } from '../storage';

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

export default function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title.');
      return;
    }

    const existingTasks = await loadTasks();
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toLocaleDateString(),
    };

    await saveTasks([...existingTasks, newTask]);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>

        <Text style={styles.label}>Task Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="What do you need to do?"
          value={title}
          onChangeText={setTitle}
          maxLength={80}
        />

        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Add more details..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Due Date (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2026-04-29"
          value={dueDate}
          onChangeText={setDueDate}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipSelected]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextSelected]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Priority</Text>
        <View style={styles.chipRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.chip,
                priority === p && styles.chipSelected,
                priority === p && p === 'High' && { backgroundColor: '#FF6B6B' },
                priority === p && p === 'Medium' && { backgroundColor: '#FFB347' },
                priority === p && p === 'Low' && { backgroundColor: '#4ECDC4' },
              ]}
              onPress={() => setPriority(p)}
            >
              <Text style={[styles.chipText, priority === p && { color: '#fff' }]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Task</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  scroll: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '700', color: '#444', marginTop: 16, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 15, borderWidth: 1, borderColor: '#DDE3EC', color: '#333' },
  multiline: { height: 90, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#DDE3EC', marginRight: 8, marginBottom: 4 },
  chipSelected: { backgroundColor: '#4A90D9', borderColor: '#4A90D9' },
  chipText: { fontSize: 13, color: '#555', fontWeight: '600' },
  chipTextSelected: { color: '#fff' },
  saveBtn: { marginTop: 28, backgroundColor: '#4A90D9', borderRadius: 12, paddingVertical: 15, alignItems: 'center', elevation: 3 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelBtn: { marginTop: 12, alignItems: 'center', paddingVertical: 12 },
  cancelBtnText: { color: '#999', fontSize: 15 },
});