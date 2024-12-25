/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskInput } from './components/TaskInput';
import { MatrixVisualization } from './components/MatrixVisualization';
import { CompletedTasksList } from './components/CompletedTasksList';
import { TaskDetail } from './components/TaskDetail';
import { Task, CompletedTask } from './types';
import NotificationService from './services/NotificationService';

const TASKS_STORAGE_KEY = '@eisenhower_tasks';
const COMPLETED_TASKS_KEY = '@eisenhower_completed_tasks';

type ViewType = 'input' | 'matrix' | 'completed' | 'detail';

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('input');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [savedTasks, savedCompletedTasks] = await Promise.all([
        AsyncStorage.getItem(TASKS_STORAGE_KEY),
        AsyncStorage.getItem(COMPLETED_TASKS_KEY)
      ]);

      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks.map((task: any) => ({
          ...task,
          date: new Date(task.date)
        })));
      }

      if (savedCompletedTasks) {
        const parsedCompletedTasks = JSON.parse(savedCompletedTasks);
        setCompletedTasks(parsedCompletedTasks.map((task: any) => ({
          ...task,
          date: new Date(task.date),
          completedDate: new Date(task.completedDate)
        }))
          .sort((a: CompletedTask, b: CompletedTask) =>
            b.completedDate.getTime() - a.completedDate.getTime())
          .slice(-30)); // Keep only last 30 items
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleTaskCreate = async (newTask: Task) => {
    const taskWithId = { ...newTask, id: Date.now().toString() };
    const updatedTasks = [...tasks, taskWithId];
    setTasks(updatedTasks);

    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setCurrentView('detail');
  };

  const handleTaskUpdate = async (updatedTask: Task) => {
    const updatedTasks = tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to save updated task:', error);
    }
    setCurrentView('matrix');
    setSelectedTask(null);
  };

  const handleTaskDelete = async (taskId: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to complete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            const taskToComplete = tasks.find(t => t.id === taskId);
            if (!taskToComplete) return;

            if (taskToComplete.notificationDate) {
              NotificationService.cancelNotification(taskId);
            }

            const completedTask: CompletedTask = {
              ...taskToComplete,
              completedDate: new Date()
            };

            const updatedTasks = tasks.filter(t => t.id !== taskId);
            const updatedCompletedTasks = [...completedTasks, completedTask]
              .sort((a, b) => b.completedDate.getTime() - a.completedDate.getTime())
              .slice(-30);

            setTasks(updatedTasks);
            setCompletedTasks(updatedCompletedTasks);

            try {
              await Promise.all([
                AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks)),
                AsyncStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updatedCompletedTasks))
              ]);
            } catch (error) {
              console.error('Failed to save after deletion:', error);
            }
            setCurrentView('matrix');
            setSelectedTask(null);
          }
        }
      ]
    );
  };

  const handleCompletedTaskDelete = async (taskId: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this completed task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedCompletedTasks = completedTasks.filter(task => task.id !== taskId);
            setCompletedTasks(updatedCompletedTasks);

            try {
              await AsyncStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updatedCompletedTasks));
            } catch (error) {
              console.error('Failed to save after deletion:', error);
            }
          }
        }
      ]
    );
  };

  const renderNavigationButtons = () => (
    <View style={styles.navigationContainer}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => setCurrentView('input')}
      >
        <Text style={styles.navButtonText}>Add Task</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => setCurrentView('matrix')}
      >
        <Text style={styles.navButtonText}>View Matrix</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => setCurrentView('completed')}
      >
        <Text style={styles.navButtonText}>Completed Tasks</Text>
      </TouchableOpacity>
    </View>
  );

  const handleAllCompletedTasksDelete = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete all completed tasks?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            setCompletedTasks([]);
            try {
              await AsyncStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify([]));
            } catch (error) {
              console.error('Failed to delete all completed tasks:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Eisenhower Matrix</Text>

      {renderNavigationButtons()}

      <View style={styles.container}>
        {currentView === 'input' && (
          <TaskInput onTaskCreate={handleTaskCreate} />
        )}

        {currentView === 'matrix' && (
          <MatrixVisualization
            tasks={tasks}
            onTaskSelect={handleTaskSelect}
          />
        )}

        {currentView === 'completed' && (
          <CompletedTasksList
            tasks={completedTasks}
            onDeleteTask={handleCompletedTaskDelete}
            onDeleteAll={handleAllCompletedTasksDelete}
          />
        )}



        {currentView === 'detail' && selectedTask && (
          <TaskDetail
            task={selectedTask}
            onUpdate={handleTaskUpdate}
            onDelete={handleTaskDelete}
            onClose={() => {
              setCurrentView('matrix');
              setSelectedTask(null);
            }}
          />
        )}
      </View>
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
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  navButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
  },
  navButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default App;