import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { CompletedTask } from '../types';

interface CompletedTasksListProps {
  tasks: CompletedTask[];
}

export const CompletedTasksList: React.FC<CompletedTasksListProps> = ({ tasks }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Tasks</Text>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
            <Text style={styles.taskMetrics}>
              Urgency: {Math.round(item.urgency)} | Importance: {Math.round(item.importance)}
            </Text>
            <Text style={styles.taskDate}>
              Completed: {item.completedDate.toLocaleDateString()}
            </Text>
          </View>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No completed tasks yet</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  taskItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  taskMetrics: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  taskDate: {
    fontSize: 12,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});