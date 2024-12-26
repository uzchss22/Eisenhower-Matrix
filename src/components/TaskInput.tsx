import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Animated, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import NotificationService from '../services/NotificationService';
import { Task } from '../types';

interface TaskInputProps {
  onTaskCreate: (task: Task) => void;
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

export const TaskInput: React.FC<TaskInputProps> = ({ onTaskCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState(5);
  const [importance, setImportance] = useState(5);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notificationDate, setNotificationDate] = useState<Date | undefined>();
  const [selectedColor, setSelectedColor] = useState(COLORS[4].value); // Default: Blue
  const [toastOpacity] = useState(new Animated.Value(0));

  const showToast = () => {
    Animated.sequence([
      // 페이드 인
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      // 1초 대기
      Animated.delay(1000),
      // 페이드 아웃
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = () => {
    const taskTitle = title.trim() || 'Untitled';

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle,
      description,
      urgency: Math.round(urgency),
      importance: Math.round(importance),
      date: new Date(),
      notificationDate,
      color: selectedColor as string,
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
    showToast();
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          placeholder="Recommended are the task details and the due date"
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

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.toast,
            {
              opacity: toastOpacity
            }
          ]}
        >
          <Text style={styles.toastText}>Created successfully</Text>
        </Animated.View>
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
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
    backgroundColor: '#3B82F6',
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
    color: 'black',
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    minWidth: 200,
  },
  dateButtonText: {
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 16,
  },
  toast: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  toastText: {
    color: 'white',
    fontSize: 14,
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