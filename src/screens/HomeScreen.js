import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadTasks, saveTasks } from '../storage';

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  useFocusEffect(
    useCallback(() => {
      loadTasks().then(setTasks);
    }, [])
  );

  const toggleTask = async (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    await saveTasks(updated);
  };

  const deleteTask = (id) => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = tasks.filter((t) => t.id !== id);
          setTasks(updated);
          await saveTasks(updated);
        },
      },
    ]);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => navigation.navigate('TaskDetail', { task: item, tasks })}
      onLongPress={() => deleteTask(item.id)}
    >
      <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.checkbox}>
        <View style={[styles.checkboxInner, item.completed && styles.checkboxChecked]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, item.completed && styles.strikethrough]}>
          {item.title}
        </Text>
        {item.category ? (
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        ) : null}
        {item.dueDate ? (
          <Text style={styles.dueDate}>📅 {item.dueDate}</Text>
        ) : null}
      </View>
      <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      

      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          {completedCount} / {tasks.length} tasks completed
        </Text>
      </View>

      <View style={styles.filterRow}>
        {['all', 'active', 'completed'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No tasks here!</Text>
          <Text style={styles.emptySubtext}>Tap + to add a new task.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const getCategoryColor = (cat) => {
  const colors = {
    Work: '#FF6B6B',
    Personal: '#4ECDC4',
    Shopping: '#FFE66D',
    Health: '#95E1D3',
    Other: '#C3A6FF',
  };
  return colors[cat] || '#C3A6FF';
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  summaryBar: { backgroundColor: '#4A90D9', paddingVertical: 8, paddingHorizontal: 16 },
  summaryText: { color: '#fff', fontSize: 13, textAlign: 'center' },
  filterRow: { flexDirection: 'row', margin: 12, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', elevation: 2 },
  filterBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  filterBtnActive: { backgroundColor: '#4A90D9' },
  filterText: { color: '#666', fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  list: { paddingHorizontal: 12, paddingBottom: 90 },
  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, elevation: 2 },
  checkbox: { marginRight: 12 },
  checkboxInner: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#4A90D9', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#4A90D9' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 16, color: '#333', fontWeight: '500' },
  strikethrough: { textDecorationLine: 'line-through', color: '#aaa' },
  categoryBadge: { marginTop: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, alignSelf: 'flex-start' },
  categoryText: { fontSize: 11, color: '#333', fontWeight: '600' },
  dueDate: { fontSize: 12, color: '#999', marginTop: 2 },
  deleteBtn: { padding: 4 },
  deleteText: { fontSize: 18 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 60, marginBottom: 12 },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#555' },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 6 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#4A90D9', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  fabText: { color: '#fff', fontSize: 32, lineHeight: 36 },
});