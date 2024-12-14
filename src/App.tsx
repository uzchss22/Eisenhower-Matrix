/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskInput } from './components/TaskInput';
import { MatrixVisualization } from './components/MatrixVisualization';
import { Task } from './types';

const TASKS_STORAGE_KEY = '@eisenhower_tasks';

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showVisualization, setShowVisualization] = useState<boolean>(false);

  // 앱 시작시 저장된 데이터 불러오기
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // Date 객체 복원
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          date: new Date(task.date)
        }));
        setTasks(tasksWithDates);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const handleTaskCreate = async (newTask: Task) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  // 태스크 삭제 기능 추가
  const handleTaskDelete = async (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to save tasks after deletion:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>아이젠하워 매트릭스</Text>
        
        {!showVisualization && (
          <TaskInput onTaskCreate={handleTaskCreate} />
        )}
        
        <TouchableOpacity
          style={styles.visualizeButton}
          onPress={() => setShowVisualization(!showVisualization)}
        >
          <Text style={styles.visualizeButtonText}>
            {showVisualization ? '입력 폼 보기' : '매트릭스 보기'}
          </Text>
        </TouchableOpacity>

        {showVisualization && (
          <MatrixVisualization 
            tasks={tasks}
            onTaskDelete={handleTaskDelete} // 삭제 기능 전달
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  visualizeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    margin: 20,
  },
  visualizeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;