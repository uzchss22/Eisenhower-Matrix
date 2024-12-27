import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Animated, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import NotificationService from '../services/NotificationService';
import { Task } from '../types';

interface TaskInputProps {
  onTaskCreate: (task: Task) => void;
}

const THEME = {
  colors: {
    primary: '#3B82F6',
    border: '#ccc',
    borderLight: '#eee',
    background: '#f0f0f0',
    link: '#007AFF',
  },
  spacing: {
    xs: 5,
    sm: 10,
    md: 15,
    lg: 20,
    xl: 30,
  },
};

type TaskColor = typeof TASK_COLORS[number]['value'];

// TASK_COLORS 배열 정의
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
  inputValue: string;
  onInputChange: (text: string) => void;
  onInputBlur: () => void;
  onSliderChange: (value: number) => void;
}

const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  inputValue,
  onInputChange,
  onInputBlur,
  onSliderChange,
}) => (
  <>
    <Text style={styles.label}>{label}: {Math.round(value)}</Text>
    <View style={styles.sliderContainer}>
      <TextInput
        style={styles.numberInput}
        value={inputValue}
        onChangeText={onInputChange}
        onBlur={onInputBlur}
        keyboardType="number-pad"
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10}
        value={value}
        onValueChange={onSliderChange}
        step={1}
        minimumTrackTintColor={THEME.colors.primary}
        maximumTrackTintColor={THEME.colors.border}
        thumbTintColor={THEME.colors.primary}
      />
    </View>
  </>
);

interface ToastProps {
  opacity: Animated.Value;
}

const Toast: React.FC<ToastProps> = ({ opacity }) => (
  <Animated.View style={[styles.toast, { opacity }]}>
    <Text style={styles.toastText}>Created successfully</Text>
  </Animated.View>
);

export const TaskInput: React.FC<TaskInputProps> = ({ onTaskCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState(5);
  const [importance, setImportance] = useState(5);
  const [urgencyInput, setUrgencyInput] = useState('5');
  const [importanceInput, setImportanceInput] = useState('5');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notificationDate, setNotificationDate] = useState<Date | undefined>();
const [selectedColor, setSelectedColor] = useState<TaskColor>(TASK_COLORS[4].value);
  const [toastOpacity] = useState(new Animated.Value(0));

  const showToast = () => {
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = async () => {
    const taskTitle = title.trim() || 'Untitled';

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle,
      description,
      urgency: Math.round(urgency),
      importance: Math.round(importance),
      date: new Date(),
      notificationDate,
      color: selectedColor,
    };

    if (notificationDate) {
      await NotificationService.scheduleNotification({
        id: newTask.id,
        title: newTask.title,
        notificationDate,
      });
    }

    onTaskCreate(newTask);
    resetForm();
    showToast();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setUrgency(5);
    setImportance(5);
    setUrgencyInput('5');
    setImportanceInput('5');
    setNotificationDate(undefined);
  };

  const handleNumberInput = (text: string, type: 'urgency' | 'importance') => {
    if (text === '' || /^\d+$/.test(text)) {
      const setter = type === 'urgency' ? setUrgencyInput : setImportanceInput;
      const valueSetter = type === 'urgency' ? setUrgency : setImportance;
      
      setter(text);
      if (text !== '') {
        const num = parseInt(text);
        if (num >= 0 && num <= 10) {
          valueSetter(num);
        }
      }
    }
  };

  const handleInputBlur = (type: 'urgency' | 'importance') => {
    const input = type === 'urgency' ? urgencyInput : importanceInput;
    const setter = type === 'urgency' ? setUrgencyInput : setImportanceInput;
    const valueSetter = type === 'urgency' ? setUrgency : setImportance;

    let num = parseInt(input || '0');
    num = Math.max(0, Math.min(10, num));
    setter(num.toString());
    valueSetter(num);
  };

  const handleSliderChange = (value: number, type: 'urgency' | 'importance') => {
    const roundedValue = Math.round(value).toString();
    if (type === 'urgency') {
      setUrgency(value);
      setUrgencyInput(roundedValue);
    } else {
      setImportance(value);
      setImportanceInput(roundedValue);
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

        <SliderInput
          label="Urgency"
          value={urgency}
          inputValue={urgencyInput}
          onInputChange={(text) => handleNumberInput(text, 'urgency')}
          onInputBlur={() => handleInputBlur('urgency')}
          onSliderChange={(value) => handleSliderChange(value, 'urgency')}
        />

        <SliderInput
          label="Importance"
          value={importance}
          inputValue={importanceInput}
          onInputChange={(text) => handleNumberInput(text, 'importance')}
          onInputBlur={() => handleInputBlur('importance')}
          onSliderChange={(value) => handleSliderChange(value, 'importance')}
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

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>

        <Toast opacity={toastOpacity} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xl,
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
  button: {
    backgroundColor: THEME.colors.primary,
    padding: THEME.spacing.md,
    borderRadius: THEME.spacing.xs,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
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
    backgroundColor: THEME.colors.background,
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
  toast: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
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