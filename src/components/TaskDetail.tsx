import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import NotificationService from '../services/NotificationService';
import { Task } from '../types';

interface TaskDetailProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onClose: () => void;
}

const THEME = {
  colors: {
    primary: '#3B82F6',
    danger: '#ff5047',
    neutral: 'rgb(142,142,147)',
    border: '#ccc',
    lightGray: '#f0f0f0',
    link: '#007AFF',
    borderLight: '#eee',
  },
  spacing: {
    xs: 5,
    sm: 10,
    md: 15,
    lg: 20,
    xl: 30,
  },
};

const TASK_COLORS = [
  { label: 'Red', value: '#FF3A2D' },
  { label: 'Orange', value: '#FF9500' },
  { label: 'Yellow', value: '#FFCC00' },
  { label: 'Green', value: '#4CD964' },
  { label: 'Blue', value: '#5AC8FA' },
  { label: 'Indigo', value: '#5856D6' },
  { label: 'Purple', value: '#9966CC' },
] as const;

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const SliderInput: React.FC<SliderInputProps> = ({ label, value, onChange }) => {
  const handleNumberInput = (text: string) => {
    const num = parseInt(text);
    if (!isNaN(num) && num >= 0 && num <= 10) {
      onChange(num);
    }
  };

  return (
    <>
      <Text style={styles.label}>{label}: {Math.round(value)}</Text>
      <View style={styles.sliderContainer}>
        <TextInput
          style={styles.numberInput}
          value={String(Math.round(value))}
          onChangeText={handleNumberInput}
          keyboardType="numeric"
        />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          value={value}
          onValueChange={onChange}
          step={1}
          minimumTrackTintColor={THEME.colors.primary}
          maximumTrackTintColor={THEME.colors.border}
          thumbTintColor={THEME.colors.primary}
        />
      </View>
    </>
  );
};

export const TaskDetail: React.FC<TaskDetailProps> = ({
  task,
  onUpdate,
  onDelete,
  onClose
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [urgency, setUrgency] = useState(task.urgency);
  const [importance, setImportance] = useState(task.importance);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notificationDate, setNotificationDate] = useState<Date | undefined>(task.notificationDate);
  const [selectedColor, setSelectedColor] = useState(task.color || TASK_COLORS[4].value);

  const handleSave = async () => {
    if (task.notificationId) {
      await NotificationService.cancelNotification(task.notificationId);
    }

    const updatedTask: Task = {
      ...task,
      title,
      description,
      urgency: Math.round(urgency),
      importance: Math.round(importance),
      notificationDate,
      color: selectedColor,
    };

    if (notificationDate) {
      await NotificationService.scheduleNotification({
        id: updatedTask.id,
        title: updatedTask.title,
        notificationDate,
      });
    }

    onUpdate(updatedTask);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNotificationDate(selectedDate);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Task Details</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Enter task description"
        />

        <SliderInput
          label="Urgency"
          value={urgency}
          onChange={setUrgency}
        />

        <SliderInput
          label="Importance"
          value={importance}
          onChange={setImportance}
        />

        <View style={styles.notificationSection}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {notificationDate
                ? notificationDate.toLocaleString()
                : 'Set Notification Time'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={notificationDate || new Date()}
              mode="datetime"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.colorSection}>
          <Text style={styles.label}>Task Color</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.colorContainer}
            contentContainerStyle={{ gap: THEME.spacing.sm }}
          >
            {TASK_COLORS.map((color) => (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.colorButton,
                  { backgroundColor: color.value },
                  selectedColor === color.value && styles.selectedColorButton,
                ]}
                onPress={() => setSelectedColor(color.value)}
              >
                {selectedColor === color.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => onDelete(task.id)}
          >
            <Text style={styles.buttonText}>Complete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xl,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.spacing.xs,
    padding: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  slider: {
    flex: 1,
    marginLeft: THEME.spacing.sm,
  },
  numberInput: {
    width: 50,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.spacing.xs,
    padding: THEME.spacing.xs,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  button: {
    padding: THEME.spacing.md,
    borderRadius: THEME.spacing.xs,
    minWidth: 100,
  },
  saveButton: {
    backgroundColor: THEME.colors.primary,
  },
  deleteButton: {
    backgroundColor: THEME.colors.danger,
  },
  cancelButton: {
    backgroundColor: THEME.colors.neutral,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationSection: {
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.lg,
    paddingTop: THEME.spacing.lg,
    paddingBottom: THEME.spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: THEME.colors.borderLight,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.md,
    color: 'black',
  },
  dateButton: {
    backgroundColor: THEME.colors.lightGray,
    padding: THEME.spacing.md,
    borderRadius: THEME.spacing.xs,
    marginBottom: THEME.spacing.md,
    minWidth: 200,
  },
  dateButtonText: {
    textAlign: 'center',
    color: THEME.colors.link,
    fontSize: 16,
  },
  colorSection: {
    marginBottom: THEME.spacing.lg,
  },
  colorContainer: {
    flexDirection: 'row',
    marginTop: THEME.spacing.sm,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorButton: {
    borderColor: '#000',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});