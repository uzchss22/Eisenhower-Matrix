// src/components/CalendarView.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Task } from '../types';

interface CalendarViewProps {
    tasks: Task[];
    onTaskSelect: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskSelect }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');

    const getUpcomingTasks = () => {
        const now = new Date();
        return tasks
            .filter(task => task.notificationDate && task.notificationDate > now)
            .sort((a, b) => {
                if (!a.notificationDate || !b.notificationDate) return 0;
                return a.notificationDate.getTime() - b.notificationDate.getTime();
            });
    };

    const markedDates = tasks.reduce((acc, task) => {
        if (task.notificationDate) {
            const dateStr = task.notificationDate.toISOString().split('T')[0];
            acc[dateStr] = {
                marked: true,
                dotColor: task.color || '#3B82F6',
                dots: acc[dateStr]?.dots
                    ? [...acc[dateStr].dots, { color: task.color || '#3B82F6' }]
                    : [{ color: task.color || '#3B82F6' }]
            };
        }
        return acc;
    }, {} as any);

    const handleDayPress = (day: DateData) => {
        const tasksForDay = tasks.filter(task => {
            if (!task.notificationDate) return false;
            return task.notificationDate.toISOString().split('T')[0] === day.dateString;
        });

        if (tasksForDay.length > 0) {
            setSelectedTasks(tasksForDay);
            setSelectedDate(day.dateString);
            setModalVisible(true);
        }
    };

    const renderTaskModal = () => (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setModalVisible(false)}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Tasks for {selectedDate}</Text>
                    <ScrollView style={styles.modalScrollView}>
                        {selectedTasks.map(task => (
                            <TouchableOpacity
                                key={task.id}
                                style={[
                                    styles.taskItem,
                                    { borderLeftColor: task.color || "#3B82F6" }
                                ]}
                                onPress={() => {
                                    setModalVisible(false);
                                    onTaskSelect(task);
                                }}
                            >
                                <Text style={styles.taskTitle}>{task.title}</Text>
                                <View style={styles.metricsContainer}>
                                    <Text style={styles.metricText}>
                                        Urgency: {Math.round(task.urgency)}
                                    </Text>
                                    <Text style={styles.metricText}>
                                        Importance: {Math.round(task.importance)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.calendarContainer}>
                    <Calendar
                        markingType={'multi-dot'}
                        markedDates={markedDates}
                        onDayPress={handleDayPress}
                        theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#2C3E50',
                            selectedDayBackgroundColor: '#3B82F6',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#3B82F6',
                            dayTextColor: '#2d4150',
                            textDisabledColor: '#d9e1e8',
                            dotColor: '#3B82F6',
                            selectedDotColor: '#ffffff',
                            arrowColor: '#3B82F6',
                            monthTextColor: '#2C3E50',
                            indicatorColor: '#3B82F6',
                        }}
                    />
                </View>
                <View style={styles.upcomingContainer}>
                    <Text style={styles.sectionTitle}>Upcoming Notifications</Text>
                    {getUpcomingTasks().map(task => (
                        <TouchableOpacity
                            key={task.id}
                            style={[
                                styles.taskItem,
                                { borderLeftColor: task.color || "#3B82F6" }
                            ]}
                            onPress={() => onTaskSelect(task)}
                        >
                            <Text style={styles.taskTitle}>{task.title}</Text>
                            <View style={styles.taskDetails}>
                                <Text style={styles.dateText}>
                                    {task.notificationDate?.toLocaleString()}
                                </Text>
                                <View style={styles.metricsContainer}>
                                    <Text style={styles.metricText}>
                                        Urgency: {Math.round(task.urgency)}
                                    </Text>
                                    <Text style={styles.metricText}>
                                        Importance: {Math.round(task.importance)}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {getUpcomingTasks().length === 0 && (
                        <Text style={styles.emptyText}>No upcoming notifications</Text>
                    )}
                </View>
            </View>
            {renderTaskModal()}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        padding: 15,
    },
    calendarContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 15,
    },
    upcomingContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 15,
    },
    taskItem: {
        backgroundColor: '#F8F9FA',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderLeftWidth: 4,
        borderColor: '#E5E7EB',
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2C3E50',
        marginBottom: 8,
    },
    taskDetails: {
        gap: 4,
    },
    dateText: {
        fontSize: 14,
        color: '#3B82F6',
        marginBottom: 4,
    },
    metricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metricText: {
        fontSize: 14,
        color: '#6B7280',
    },
    emptyText: {
        textAlign: 'center',
        color: '#6B7280',
        fontStyle: 'italic',
        marginTop: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxHeight: '60%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalScrollView: {
        maxHeight: '90%',
    },
});