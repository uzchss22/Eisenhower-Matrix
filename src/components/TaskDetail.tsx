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

const COLORS = [
  { label: 'Red', value: '#FF3A2D' },
  { label: 'Orange', value: '#FF9500' },
  { label: 'Yellow', value: '#FFCC00' },
  { label: 'Green', value: '#4CD964' },
  { label: 'Blue', value: '#5AC8FA' },
  { label: 'Indigo', value: '#5856D6' },
  { label: 'Purple', value: '#9966CC' },
];

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
  const [selectedColor, setSelectedColor] = useState(task.color || '#0000FF'); // 기본 파란색

  const handleSave = () => {
    if (task.notificationId) {
      NotificationService.cancelNotification(task.notificationId);
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
      NotificationService.scheduleNotification({
        id: updatedTask.id,
        title: updatedTask.title,
        notificationDate,
      });
    }

    onUpdate(updatedTask);
  };

  const handleNumberInput = (text: string, setter: (value: number) => void) => {
    const num = parseInt(text);
    if (!isNaN(num) && num >= 0 && num <= 10) {
      setter(num);
    }
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
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Urgency: {Math.round(urgency)}</Text>
        <View style={styles.sliderContainer}>
          <TextInput
            style={styles.numberInput}
            value={String(Math.round(urgency))}
            onChangeText={(text) => handleNumberInput(text, setUrgency)}
            keyboardType="numeric"
          />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            value={urgency}
            onValueChange={setUrgency}
            step={1}
            minimumTrackTintColor="#3B82F6" 
            maximumTrackTintColor="#D3D3D3"
            thumbTintColor="#3B82F6"
          />
        </View>

        <Text style={styles.label}>Importance: {Math.round(importance)}</Text>
        <View style={styles.sliderContainer}>
          <TextInput
            style={styles.numberInput}
            value={String(Math.round(importance))}
            onChangeText={(text) => handleNumberInput(text, setImportance)}
            keyboardType="numeric"
          />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            value={importance}
            onValueChange={setImportance}
            step={1}
            minimumTrackTintColor="#3B82F6" 
            maximumTrackTintColor="#D3D3D3"
            thumbTintColor="#3B82F6"
          />
        </View>

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
          <View style={styles.colorContainer}>
            {COLORS.map((color) => (
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
          </View>
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
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40, // 하단 여백 추가
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  slider: {
    flex: 1,
    marginLeft: 10,
  },
  numberInput: {
    width: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    minWidth: 100,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
  },
  deleteButton: {
    backgroundColor: '#ff5047',
  },
  cancelButton: {
    backgroundColor: 'rgb(142,142,147)',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationSection: {
    marginTop: 30,
    marginBottom: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'black',
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    minWidth: 200,  // 버튼 최소 너비 설정
  },
  dateButtonText: {
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 16,
  },
  colorSection: {
    marginBottom: 20,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
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