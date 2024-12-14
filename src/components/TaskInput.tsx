import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Task } from '../types';

interface TaskInputProps {
  onTaskCreate: (task: Task) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onTaskCreate }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [urgency, setUrgency] = useState<number>(5);
  const [importance, setImportance] = useState<number>(5);

  const handleSubmit = () => {
    if (title.trim()) {
      const newTask: Task = {
        title,
        description,
        urgency,
        importance,
        date: new Date(),
      };
      onTaskCreate(newTask);
      setTitle('');
      setDescription('');
      setUrgency(5);
      setImportance(5);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="할 일을 입력하세요"
      />

      <Text style={styles.label}>설명</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="상세 설명을 입력하세요"
      />

      <Text style={styles.label}>긴급도: {urgency.toFixed(1)}</Text>
      <View style={styles.sliderContainer}>
        <TextInput
          style={styles.numberInput}
          value={String(urgency)}
          onChangeText={(text) => {
            const num = parseFloat(text);
            if (!isNaN(num) && num >= 0 && num <= 10) {
              setUrgency(num);
            }
          }}
          keyboardType="numeric"
        />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          value={urgency}
          onValueChange={setUrgency}
          step={0.1}
        />
      </View>

      <Text style={styles.label}>중요도: {importance.toFixed(1)}</Text>
      <View style={styles.sliderContainer}>
        <TextInput
          style={styles.numberInput}
          value={String(importance)}
          onChangeText={(text) => {
            const num = parseFloat(text);
            if (!isNaN(num) && num >= 0 && num <= 10) {
              setImportance(num);
            }
          }}
          keyboardType="numeric"
        />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          value={importance}
          onValueChange={setImportance}
          step={0.1}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>추가하기</Text>
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