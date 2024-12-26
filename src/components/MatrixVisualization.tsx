import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, ScrollView, Modal, TextInput, Alert } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, Rect } from 'react-native-svg';
import { Trash2, MoreVertical } from 'lucide-react-native';
import { Task } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MatrixVisualizationProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  onDeleteAll: () => void;
}

interface TaskGroup {
  x: number;
  y: number;
  tasks: Task[];
}

export const MatrixVisualization: React.FC<MatrixVisualizationProps> = ({
  tasks,
  onTaskSelect,
  onDeleteAll
}) => {
  const SORT_PREFERENCE_KEY = '@eisenhower_sort_preference';
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'urgency' | 'importance'>('urgency');

  const width = Dimensions.get('window').width - 40;
  const height = width;
  const padding = 40;
  const quadrantWidth = (width - 2 * padding) / 2;
  const quadrantHeight = (height - 2 * padding) / 2;

  // NaN 체크 함수
  const getValidNumber = (value: number): number => {
    return isNaN(value) ? 0 : value;
  };

  // Task 그룹화 함수
  const groupTasks = (): TaskGroup[] => {
    const groups: { [key: string]: TaskGroup } = {};

    tasks.forEach(task => {
      const urgency = Math.round(getValidNumber(task.urgency));
      const importance = Math.round(getValidNumber(task.importance));
      const x = padding + (urgency / 10) * (width - 2 * padding);
      const y = height - (padding + (importance / 10) * (height - 2 * padding));
      const key = `${urgency}-${importance}`;

      if (!groups[key]) {
        groups[key] = { x, y, tasks: [] };
      }
      groups[key].tasks.push(task);
    });

    return Object.values(groups);
  };

  useEffect(() => {
    const loadSortPreference = async () => {
      try {
        const savedSortBy = await AsyncStorage.getItem(SORT_PREFERENCE_KEY);
        if (savedSortBy) {
          setSortBy(savedSortBy as 'urgency' | 'importance');
        }
      } catch (error) {
        console.error('Failed to load sort preference:', error);
      }
    };

    loadSortPreference();
  }, []);


  const handleDeleteAll = () => {
    if (tasks.length === 0) {
      Alert.alert('No Tasks', 'There are no tasks to delete.');
      return;
    }
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmText.toLowerCase() === 'delete all') {
      onDeleteAll();
      setDeleteModalVisible(false);
      setDeleteConfirmText('');
    } else {
      Alert.alert('Error', 'Please type "delete all" to confirm deletion');
    }
  };

  const handleTaskGroupPress = (group: TaskGroup) => {
    setSelectedTasks(group.tasks);
    setModalVisible(true);
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
          <Text style={styles.modalTitle}>Tasks</Text>
          <ScrollView style={styles.modalScrollView}>
            {selectedTasks.map(task => (
              <TouchableOpacity
                key={task.id}
                style={[
                  styles.modalItem,
                  {
                    borderLeftWidth: 4,
                    borderLeftColor: task.color || "#3B82F6"
                  }
                ]}
                onPress={() => {
                  setModalVisible(false);
                  onTaskSelect(task);
                }}
              >
                <Text style={styles.modalItemText}>{task.title}</Text>
                <View style={styles.modalItemMetrics}>
                  <Text style={styles.modalMetricText}>
                    Urgency: {Math.round(task.urgency)}
                  </Text>
                  <Text style={styles.modalMetricText}>
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

  const renderDeleteConfirmModal = () => (
    <Modal
      transparent={true}
      visible={deleteModalVisible}
      onRequestClose={() => setDeleteModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm Deletion</Text>
          <Text style={styles.modalText}>
            Are you sure you want to delete all tasks?{'\n\n'}
            Type 'delete all' below to confirm.
          </Text>
          <TextInput
            style={styles.confirmInput}
            value={deleteConfirmText}
            onChangeText={setDeleteConfirmText}
            placeholder="Type 'delete all' here"
            autoCapitalize="none"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setDeleteModalVisible(false);
                setDeleteConfirmText('');
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={handleDeleteConfirm}
            >
              <Text style={styles.modalButtonText}>Delete All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderGraph = () => (
    <Svg width={width} height={height}>
      {/* 사분면 배경 */}
      <Rect
        x={padding}
        y={padding}
        width={quadrantWidth}
        height={quadrantHeight}
        fill="#4ADE8020"  // 연한 초록색
      />
      <Rect
        x={padding + quadrantWidth}
        y={padding}
        width={quadrantWidth}
        height={quadrantHeight}
        fill="#FF634720"  // 연한 빨간색
      />
      <Rect
        x={padding}
        y={padding + quadrantHeight}
        width={quadrantWidth}
        height={quadrantHeight}
        fill="#94A3B820"  // 연한 회색
      />
      <Rect
        x={padding + quadrantWidth}
        y={padding + quadrantHeight}
        width={quadrantWidth}
        height={quadrantHeight}
        fill="#F6AD5520"  // 연한 주황색
      />


      {/* 축 */}
      <Line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#2C3E50"
        strokeWidth="1.5"
      />
      <Line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="#2C3E50"
        strokeWidth="1.5"
      />

      {/* 중간 분할선 */}
      <Line
        x1={padding + quadrantWidth}
        y1={padding}
        x2={padding + quadrantWidth}
        y2={height - padding}
        stroke="#E5E7EB"
        strokeWidth="1"
        strokeDasharray="5,5"
      />
      <Line
        x1={padding}
        y1={padding + quadrantHeight}
        x2={width - padding}
        y2={padding + quadrantHeight}
        stroke="#E5E7EB"
        strokeWidth="1"
        strokeDasharray="5,5"
      />

      {/* 축 레이블 */}
      <SvgText
        x={width - padding + 10}
        y={height - padding + 25}
        textAnchor="end"
        fontSize="12"
        fill="#6B7280"
      >
        Urgency
      </SvgText>

      <SvgText
        x={padding - 25}
        y={padding - 10}
        textAnchor="start"
        fontSize="12"
        fill="#6B7280"
      >
        Importance
      </SvgText>

      {/* 축 눈금 */}
      {[0, 2.5, 5, 7.5, 10].map((value) => (
        <React.Fragment key={value}>
          {/* X축 눈금 */}
          <Line
            x1={padding + (value / 10) * (width - 2 * padding)}
            y1={height - padding}
            x2={padding + (value / 10) * (width - 2 * padding)}
            y2={height - padding + 5}
            stroke="#6B7280"
            strokeWidth="1"
          />
          <SvgText
            x={padding + (value / 10) * (width - 2 * padding)}
            y={height - padding + 15}
            textAnchor="middle"
            fontSize="10"
            fill="#6B7280"
          >
            {Math.round(value)}
          </SvgText>

          {/* Y축 눈금 */}
          <Line
            x1={padding - 5}
            y1={height - (padding + (value / 10) * (height - 2 * padding))}
            x2={padding}
            y2={height - (padding + (value / 10) * (height - 2 * padding))}
            stroke="#6B7280"
            strokeWidth="1"
          />
          <SvgText
            x={padding - 10}
            y={height - (padding + (value / 10) * (height - 2 * padding))}
            textAnchor="end"
            fontSize="10"
            fill="#6B7280"
            alignmentBaseline="middle"
          >
            {Math.round(value)}
          </SvgText>
        </React.Fragment>
      ))}

      {/* Task 그룹 렌더링 */}
      {groupTasks().map((group, index) => {
        // 그룹의 대표 색상 결정 (첫 번째 태스크의 색상 또는 기본 파란색)
        const groupColor = group.tasks[0]?.color || "#3B82F6";

        return (
          <React.Fragment key={index}>
            <Circle
              cx={group.x}
              cy={group.y}
              r={8}
              fill="white"
              stroke={groupColor}
              strokeWidth="2"
            />
            <Circle
              cx={group.x}
              cy={group.y}
              r={6}
              fill={groupColor}
            />
            <Circle
              cx={group.x}
              cy={group.y}
              r={12}
              fill="rgba(0,0,0,0)"
              onPress={() => handleTaskGroupPress(group)}
            />
          </React.Fragment>
        );
      })}
    </Svg>
  );

  const getSortedTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      if (sortBy === 'urgency') {
        if (b.urgency === a.urgency) {
          return b.importance - a.importance;
        }
        return b.urgency - a.urgency;
      } else {
        if (b.importance === a.importance) {
          return b.urgency - a.urgency;
        }
        return b.importance - a.importance;
      }
    });
  };

  const handleSortChange = async (newSortBy: 'urgency' | 'importance') => {
    setSortBy(newSortBy);
    setSortMenuVisible(false);
    try {
      await AsyncStorage.setItem(SORT_PREFERENCE_KEY, newSortBy);
    } catch (error) {
      console.error('Failed to save sort preference:', error);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.graphContainer}>
        {renderGraph()}
        <Text style={styles.helperText}>Click a graph item to see details.</Text>
      </View>
<View style={styles.listContainer}>
  <View style={styles.listHeader}>
    <Text style={styles.listTitle}>Task List</Text>
    <TouchableOpacity
      style={styles.sortButton}
      onPress={() => setSortMenuVisible(!sortMenuVisible)}
    >
      <MoreVertical size={18} color="#6B7280" />
    </TouchableOpacity>
    {sortMenuVisible && (
      <View style={styles.sortMenu}>
        <TouchableOpacity
          style={[
            styles.sortMenuItem,
            sortBy === 'urgency' && styles.sortMenuItemActive
          ]}
          onPress={() => handleSortChange('urgency')}
        >
          <Text style={styles.sortMenuText}>Sort by Urgency</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortMenuItem,
            sortBy === 'importance' && styles.sortMenuItemActive
          ]}
          onPress={() => handleSortChange('importance')}
        >
          <Text style={styles.sortMenuText}>Sort by Importance</Text>
        </TouchableOpacity>
        <View style={styles.sortMenuDivider} />
        <TouchableOpacity
          style={styles.sortMenuItem}
          onPress={() => {
            setSortMenuVisible(false);
            handleDeleteAll();
          }}
        >
          <Text style={styles.deleteMenuText}>Delete All Tasks</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
        {getSortedTasks(tasks).map((task) => (
          <TouchableOpacity
            key={task.id}
            style={[
              styles.taskItem,
              {
                borderLeftWidth: 4,
                borderLeftColor: task.color || "#3B82F6"
              }
            ]}
            onPress={() => onTaskSelect(task)}
          >
            <Text style={styles.taskTitle}>{task.title}</Text>
            <View style={styles.taskMetrics}>
              <Text style={styles.metricText}>
                Urgency: {Math.round(task.urgency)}
              </Text>
              <Text style={styles.metricText}>
                Importance: {Math.round(task.importance)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {renderTaskModal()}
      {renderDeleteConfirmModal()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  graphContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    position: 'relative',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  deleteAllButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskItem: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 8,
  },
  taskMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricText: {
    fontSize: 14,
    color: '#6B7280',
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
  modalText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 24,
  },
  confirmInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginVertical: 15,
    fontSize: 16,
    color: '#2C3E50',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#6B7280',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  modalScrollView: {
    maxHeight: '90%',
  },
  modalItem: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalItemText: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 8,
  },
  modalItemMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalMetricText: {
    fontSize: 14,
    color: '#6B7280',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sortButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sortMenuItemActive: {
    backgroundColor: '#F3F4F6',
  },
  sortMenuText: {
    color: '#2C3E50',
    fontSize: 14,
  },
  sortMenu: {
    position: 'absolute',
    right: 0,
    top: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 5,
    minWidth: 180, // 추가
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    zIndex: 1,
  },
  sortMenuDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 5,
  },
  deleteMenuText: {
    color: '#FF3B30',
    fontSize: 14,
  },
});