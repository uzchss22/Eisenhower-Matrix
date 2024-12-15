import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Task } from '../types';

interface TaskDetailProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onClose: () => void;
}

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

  const handleSave = () => {
    onUpdate({
      ...task,
      title,
      description,
      urgency: Math.round(urgency),
      importance: Math.round(importance),
    });
  };

  return (
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
          onChangeText={(text) => {
            const num = parseInt(text);
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
          step={1}
        />
      </View>

      <Text style={styles.label}>Importance: {Math.round(importance)}</Text>
      <View style={styles.sliderContainer}>
        <TextInput
          style={styles.numberInput}
          value={String(Math.round(importance))}
          onChangeText={(text) => {
            const num = parseInt(text);
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
          step={1}
        />
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
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  },
  button: {
    padding: 15,
    borderRadius: 5,
    minWidth: 100,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});