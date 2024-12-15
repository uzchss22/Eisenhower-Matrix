import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Task } from '../types';

interface TaskInputProps {
  onTaskCreate: (task: Task) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onTaskCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState(5);
  const [importance, setImportance] = useState(5);

  const handleSubmit = () => {
    if (title.trim()) {
      onTaskCreate({
        id: Date.now().toString(),
        title,
        description,
        urgency: Math.round(urgency),
        importance: Math.round(importance),
        date: new Date(),
      });
      setTitle('');
      setDescription('');
      setUrgency(5);
      setImportance(5);
    }
  };

  const handleNumberInput = (text: string, setter: (value: number) => void) => {
    const num = parseInt(text);
    if (!isNaN(num) && num >= 0 && num <= 10) {
      setter(num);
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
});