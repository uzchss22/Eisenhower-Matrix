import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, ScrollView } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, Rect } from 'react-native-svg';
import { Task } from '../types';

interface MatrixVisualizationProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
}

export const MatrixVisualization: React.FC<MatrixVisualizationProps> = ({
  tasks,
  onTaskSelect
}) => {
  const width = Dimensions.get('window').width - 40;
  const height = width;
  const padding = 40;
  const quadrantWidth = (width - 2 * padding) / 2;
  const quadrantHeight = (height - 2 * padding) / 2;

  // NaN 체크 함수 추가
  const getValidNumber = (value: number): number => {
    return isNaN(value) ? 0 : value;
  };

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
          x={width - padding + 10}  // 오른쪽으로 이동
          y={height - padding + 25}  // y 위치 조정
          textAnchor="end"          // 텍스트 오른쪽 정렬
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

      {/* 태스크 점들 - NaN 체크 추가 */}
      {tasks.map((task) => {
        const x = padding + (getValidNumber(task.urgency) / 10) * (width - 2 * padding);
        const y = height - (padding + (getValidNumber(task.importance) / 10) * (height - 2 * padding));
        
        return (
          <React.Fragment key={task.id}>
            <Circle
              cx={x}
              cy={y}
              r={10}
              fill="rgba(0,0,0,0)"
              onPress={() => onTaskSelect(task)}
            />
            <Circle
              cx={x}
              cy={y}
              r={5}
              fill="blue"
            />
            <SvgText
              x={x}
              y={y - 10}
              textAnchor="middle"
              fontSize="10"
              fill="black"
            >
              {task.title}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );

  const renderTaskList = () => (
    <View style={styles.listContainer}>
      <Text style={styles.listTitle}>Task List</Text>
      {tasks.map((task) => (
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.graphContainer}>
        {renderGraph()}
      </View>
      {renderTaskList()}
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
});