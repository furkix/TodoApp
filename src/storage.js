import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = '@todo_tasks';

// Görevleri telefondan yükle
export const loadTasks = async () => {
  try {
    const json = await AsyncStorage.getItem(TASKS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Görevler yüklenemedi', e);
    return [];
  }
};

// Görevleri telefona kaydet
export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Görevler kaydedilemedi', e);
  }
};