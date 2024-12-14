/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { TaskInput } from './components/TaskInput';
import { MatrixVisualization } from './components/MatrixVisualization';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Task } from './types';

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showVisualization, setShowVisualization] = useState<boolean>(false);

  const handleTaskCreate = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <SafeAreaProvider>
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
            <MatrixVisualization tasks={tasks} />
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
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