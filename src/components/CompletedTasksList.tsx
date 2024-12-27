import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { CompletedTask } from '../types';
import { Trash2 } from 'lucide-react-native';

interface CompletedTasksListProps {
  tasks: CompletedTask[];
  onDeleteTask: (taskId: string) => void;
  onDeleteAll: () => void;
}

const THEME = {
  colors: {
    primary: '#3B82F6',
    danger: '#ff5047',
    white: '#ffffff',
    border: '#E5E7EB',
    text: {
      primary: '#000000',
      secondary: '#666666',
      tertiary: '#888888',
      metrics: '#444444',
    },
  },
  spacing: {
    xs: 5,
    sm: 8,
    md: 10,
    lg: 15,
    xl: 20,
  },
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
  },
};

interface TaskItemProps {
  task: CompletedTask;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete }) => (
  <View style={[
    styles.taskItem,
    { borderLeftWidth: 4, borderLeftColor: task.color || THEME.colors.primary }
  ]}>
    <View style={styles.taskHeader}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
      >
        <Trash2 size={16} color={THEME.colors.white} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
    <Text style={styles.taskDescription}>{task.description}</Text>
    <Text style={styles.taskMetrics}>
      Urgency: {Math.round(task.urgency)} | Importance: {Math.round(task.importance)}
    </Text>
    <Text style={styles.taskDate}>
      Completed: {task.completedDate.toLocaleString()}
    </Text>
  </View>
);

const EmptyListMessage = () => (
  <Text style={styles.emptyText}>No completed tasks yet</Text>
);

const ListFooter = () => (
  <Text style={styles.footerText}>Display the last 30 completed tasks.</Text>
);

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
          <TaskItem task={item} onDelete={onDeleteTask} />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={EmptyListMessage}
        ListFooterComponent={ListFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: THEME.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.lg,
  },
  deleteAllButton: {
    backgroundColor: THEME.colors.danger,
    padding: THEME.spacing.sm,
    borderRadius: THEME.spacing.xs,
  },
  deleteAllButtonText: {
    color: THEME.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskItem: {
    backgroundColor: THEME.colors.white,
    padding: THEME.spacing.lg,
    borderRadius: THEME.spacing.xs,
    marginBottom: THEME.spacing.md,
    borderColor: THEME.colors.border,
    ...THEME.shadow.small,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xs,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: THEME.colors.text.primary,
  },
  deleteButton: {
    backgroundColor: THEME.colors.danger,
    padding: THEME.spacing.xs,
    borderRadius: THEME.spacing.xs,
    marginLeft: THEME.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskDescription: {
    fontSize: 14,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.xs,
  },
  taskMetrics: {
    fontSize: 14,
    color: THEME.colors.text.metrics,
    marginBottom: THEME.spacing.xs,
  },
  taskDate: {
    fontSize: 12,
    color: THEME.colors.text.tertiary,
  },
  emptyText: {
    textAlign: 'center',
    color: THEME.colors.text.secondary,
    marginTop: THEME.spacing.xl,
  },
  footerText: {
    textAlign: 'center',
    color: THEME.colors.text.secondary,
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.xl,
    fontSize: 12,
    fontStyle: 'italic',
  },
});