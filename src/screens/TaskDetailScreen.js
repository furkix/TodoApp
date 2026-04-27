import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { saveTasks } from '../storage';

const PRIORITY_COLORS = {
  High: '#FF6B6B',
  Medium: '#FFB347',
  Low: '#4ECDC4',
};

export default function TaskDetailScreen({ route, navigation }) {
  const { task, tasks } = route.params;

  const handleToggle = async () => {
    const updated = tasks.map((t) =>
      t.id === task.id ? { ...t, completed: !t.completed } : t
    );
    await saveTasks(updated);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = tasks.filter((t) => t.id !== task.id);
          await saveTasks(updated);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={[styles.statusBadge, task.completed ? styles.badgeDone : styles.badgeActive]}>
        <Text style={styles.statusText}>
          {task.completed ? '✅ Completed' : '🔵 Active'}
        </Text>
      </View>

      <Text style={[styles.title, task.completed && styles.strikethrough]}>
        {task.title}
      </Text>

      <View style={styles.metaRow}>
        {task.category && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>📁 {task.category}</Text>
          </View>
        )}
        {task.priority && (
          <View style={[styles.tag, { backgroundColor: PRIORITY_COLORS[task.priority] + '33' }]}>
            <Text style={[styles.tagText, { color: PRIORITY_COLORS[task.priority] }]}>
              ⚡ {task.priority} Priority
            </Text>
          </View>
        )}
      </View>

      {task.description ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>
      ) : null}

      {task.dueDate ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Due Date</Text>
          <Text style={styles.detailText}>📅 {task.dueDate}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Created</Text>
        <Text style={styles.detailText}>🗓️ {task.createdAt}</Text>
      </View>

      <TouchableOpacity
        style={[styles.actionBtn, task.completed ? styles.undoBtn : styles.doneBtn]}
        onPress={handleToggle}
      >
        <Text style={styles.actionBtnText}>
          {task.completed ? '↩ Mark as Active' : '✓ Mark as Completed'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>🗑️ Delete Task</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  content: { padding: 20, paddingBottom: 40 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 14 },
  badgeDone: { backgroundColor: '#D4EDDA' },
  badgeActive: { backgroundColor: '#D0E8FF' },
  statusText: { fontSize: 13, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 12 },
  strikethrough: { textDecorationLine: 'line-through', color: '#aaa' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  tag: { backgroundColor: '#E8EEF7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  tagText: { fontSize: 13, color: '#555', fontWeight: '600' },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, elevation: 1 },
  sectionLabel: { fontSize: 12, color: '#999', fontWeight: '700', marginBottom: 6, textTransform: 'uppercase' },
  description: { fontSize: 15, color: '#444', lineHeight: 22 },
  detailText: { fontSize: 15, color: '#555' },
  actionBtn: { borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginBottom: 12, elevation: 2 },
  doneBtn: { backgroundColor: '#4A90D9' },
  undoBtn: { backgroundColor: '#95a5a6' },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  deleteBtn: { borderRadius: 12, paddingVertical: 15, alignItems: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#FF6B6B' },
  deleteBtnText: { color: '#FF6B6B', fontSize: 16, fontWeight: 'bold' },
});