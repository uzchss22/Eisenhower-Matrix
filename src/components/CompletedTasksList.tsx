import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { CompletedTask } from '../types';

interface CompletedTasksListProps {
  tasks: CompletedTask[];
  onDeleteTask: (taskId: string) => void;
  onDeleteAll: () => void;
}

export const CompletedTasksList: React.FC<CompletedTasksListProps> = ({
  tasks,
  onDeleteTask,
  onDeleteAll
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Completed Tasks</Text>
        {tasks.length > 0 && (
          <TouchableOpacity
            style={styles.deleteAllButton}
            onPress={onDeleteAll}
          >
            <Text style={styles.deleteAllButtonText}>Delete All</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDeleteTask(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
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
        ListFooterComponent={() => (
          <Text style={styles.footerText}>Display the last 30 completed tasks.</Text>
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
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  footerText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 12,
    fontStyle: 'italic',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  deleteAllButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 5,
  },
  deleteAllButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});