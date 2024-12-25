import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, ScrollView, Modal } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, Rect } from 'react-native-svg';
import { Task } from '../types';

interface MatrixVisualizationProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
}

interface TaskGroup {
  x: number;
  y: number;
  tasks: Task[];
}

export const MatrixVisualization: React.FC<MatrixVisualizationProps> = ({
  tasks,
  onTaskSelect
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);

  const width = Dimensions.get('window').width - 40;
  const height = width;
  const padding = 40;
  const quadrantWidth = (width - 2 * padding) / 2;
  const quadrantHeight = (height - 2 * padding) / 2;

  // NaN 체크 함수
  const getValidNumber = (value: number): number => {
    return isNaN(value) ? 0 : value;
  };

  //
  // 제목 표시 안함 (그래프에 제목이 겹쳐서 보기 안 좋음)
  //
  // const truncateTitle = (title: string): string => {
  //   if (title.length <= 10) return title;
  //   return title.slice(0, 10) + '...';
  // };

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

  // 제목 표시안함
  // const getGroupDisplayText = (group: TaskGroup): string => {
  //   const firstTask = group.tasks[0];
  //   const truncatedTitle = truncateTitle(firstTask.title);

  //   if (group.tasks.length > 1) {
  //     return `${truncatedTitle} (${group.tasks.length - 1})more`;
  //   }
  //   return truncatedTitle;
  // };

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
                style={styles.modalItem}
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

  const renderGraph = () => (
    <Svg width={width} height={height}>
      {/* 사분면 배경 */}
      <Rect
        x={padding}
        y={padding}
        width={quadrantWidth}
        height={quadrantHeight}
        fill="rgba(0, 255, 0, 0.1)"
      />
      <Rect
        x={padding + quadrantWidth}
        y={padding}
        width={quadrantWidth}
        height={quadrantHeight}
        fill="rgba(255, 0, 0, 0.1)"
      />
      <Rect
        x={padding}
        y={padding + quadrantHeight}
        width={quadrantWidth}
        height={quadrantHeight}
        fill="rgba(128, 128, 128, 0.1)"
      />
      <Rect
        x={padding + quadrantWidth}
        y={padding + quadrantHeight}
        width={quadrantWidth}
        height={quadrantHeight}
        fill="rgba(255, 165, 0, 0.1)"
      />

      {/* 축 */}
      <Line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="black"
        strokeWidth="2"
      />
      <Line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="black"
        strokeWidth="2"
      />

      {/* 중간 분할선 */}
      <Line
        x1={padding + quadrantWidth}
        y1={padding}
        x2={padding + quadrantWidth}
        y2={height - padding}
        stroke="black"
        strokeWidth="1"
        strokeDasharray="5,5"
      />
      <Line
        x1={padding}
        y1={padding + quadrantHeight}
        x2={width - padding}
        y2={padding + quadrantHeight}
        stroke="black"
        strokeWidth="1"
        strokeDasharray="5,5"
      />

      {/* 축 레이블 */}
      <SvgText
        x={width - padding + 10}
        y={height - padding + 25}
        textAnchor="end"
        fontSize="12"
      >
        Urgency
      </SvgText>

      <SvgText
        x={padding - 25}
        y={padding - 10}
        textAnchor="start"
        fontSize="12"
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
            stroke="black"
            strokeWidth="1"
          />
          <SvgText
            x={padding + (value / 10) * (width - 2 * padding)}
            y={height - padding + 15}
            textAnchor="middle"
            fontSize="10"
          >
            {Math.round(value)}
          </SvgText>

          {/* Y축 눈금 */}
          <Line
            x1={padding - 5}
            y1={height - (padding + (value / 10) * (height - 2 * padding))}
            x2={padding}
            y2={height - (padding + (value / 10) * (height - 2 * padding))}
            stroke="black"
            strokeWidth="1"
          />
          <SvgText
            x={padding - 10}
            y={height - (padding + (value / 10) * (height - 2 * padding))}
            textAnchor="end"
            fontSize="10"
            alignmentBaseline="middle"
          >
            {Math.round(value)}
          </SvgText>
        </React.Fragment>
      ))}

      {/* Task 그룹 렌더링 */}
      {groupTasks().map((group, index) => (
        <React.Fragment key={index}>
          <Circle
            cx={group.x}
            cy={group.y}
            r={6}
            fill="blue"
          />
          <Circle
            cx={group.x}
            cy={group.y}
            r={7}
            fill="rgba(0,0,0,0)"
            onPress={() => handleTaskGroupPress(group)}
          />
          {/* <SvgText
              x={group.x}
              y={group.y - 10}
              textAnchor="middle"
              fontSize="10"
              fill="black"
            >
              {getGroupDisplayText(group)}
            </SvgText> 제목 표시 안함 */}
        </React.Fragment>
      ))}
    </Svg>
  );

  const renderTaskList = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (b.urgency === a.urgency) {
        return b.importance - a.importance;
      }
      return b.urgency - a.urgency;
    });

    return (
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Task List</Text>
        {sortedTasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskItem}
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
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.graphContainer}>
        {renderGraph()}
        <Text style={styles.helperText}>Click a graph item to see details.</Text>
      </View>
      {renderTaskList()}
      {renderTaskModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  graphContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  listContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  taskMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricText: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollView: {
    maxHeight: '90%',  // 모달 내부 스크롤 영역의 최대 높이 설정
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',  // 모달 전체의 최대 높이 설정
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalItemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalItemMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalMetricText: {
    fontSize: 14,
    color: '#666',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});