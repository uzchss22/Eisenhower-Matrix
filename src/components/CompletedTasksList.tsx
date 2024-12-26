import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { CompletedTask } from '../types';
import { Trash2 } from 'lucide-react-native';


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
          <View style={[
            styles.taskItem,
            {
              borderLeftWidth: 4,
              borderLeftColor: item.color || "#3B82F6"
            }
          ]}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDeleteTask(item.id)}
              >
                <Trash2 size={16} color="white" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            <Text style={styles.taskDescription}>{item.description}</Text>
            <Text style={styles.taskMetrics}>
              Urgency: {Math.round(item.urgency)} | Importance: {Math.round(item.importance)}
            </Text>
            <Text style={styles.taskDate}>
              Completed: {item.completedDate.toLocaleString()}
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
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    backgroundColor: '#ff5047',
    padding: 6,
    borderRadius: 6,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#ff5047',
    padding: 8,
    borderRadius: 5,
  },
  deleteAllButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});