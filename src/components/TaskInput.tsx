import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import NotificationService from '../services/NotificationService';
import { Task } from '../types';

interface TaskInputProps {
  onTaskCreate: (task: Task) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onTaskCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState(5);
  const [importance, setImportance] = useState(5);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notificationDate, setNotificationDate] = useState<Date | undefined>();

  const handleSubmit = () => {
    if (title.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        description,
        urgency: Math.round(urgency),
        importance: Math.round(importance),
        date: new Date(),
        notificationDate,
      };

      if (notificationDate) {
        NotificationService.scheduleNotification({
          id: newTask.id,
          title: newTask.title,
          notificationDate,
        });
      }

      onTaskCreate(newTask);
      setTitle('');
      setDescription('');
      setUrgency(5);
      setImportance(5);
      setNotificationDate(undefined);
    }
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
    <View style={styles.container}>
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

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
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
    color: '#007AFF',
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
});