import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, Rect } from 'react-native-svg';
import { Task } from '../types';

interface MatrixVisualizationProps {
  tasks: Task[];
  onTaskDelete: (index: number) => void;
}

export const MatrixVisualization: React.FC<MatrixVisualizationProps> = ({ tasks, onTaskDelete }) => {
  const width = Dimensions.get('window').width - 40;
  const height = width;
  const padding = 40;
  const quadrantWidth = (width - 2 * padding) / 2;
  const quadrantHeight = (height - 2 * padding) / 2;

  const getQuadrantColor = (x: number, y: number): string => {
    const isRightHalf = x > padding + quadrantWidth;
    const isTopHalf = y < padding + quadrantHeight;
    
    if (isRightHalf && isTopHalf) return 'rgba(255, 0, 0, 0.1)';  // 긴급 & 중요
    if (!isRightHalf && isTopHalf) return 'rgba(0, 255, 0, 0.1)'; // 중요 & 긴급하지 않음
    if (isRightHalf && !isTopHalf) return 'rgba(255, 165, 0, 0.1)'; // 긴급 & 중요하지 않음
    return 'rgba(128, 128, 128, 0.1)'; // 긴급하지 않음 & 중요하지 않음
  };

  return (
    <View style={styles.container}>
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
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          fontSize="12"
        >
          긴급도
        </SvgText>
        <SvgText
          x={15}
          y={height / 2}
          textAnchor="middle"
          fontSize="12"
          rotation="-90"
        >
          중요도
        </SvgText>

        {/* 사분면 레이블 */}
        <SvgText x={padding + quadrantWidth/4} y={padding + quadrantHeight/2} textAnchor="middle" fontSize="12">
          계획하기
        </SvgText>
        <SvgText x={padding + quadrantWidth*1.75} y={padding + quadrantHeight/2} textAnchor="middle" fontSize="12">
          지금하기
        </SvgText>
        <SvgText x={padding + quadrantWidth/4} y={padding + quadrantHeight*1.5} textAnchor="middle" fontSize="12">
          위임하기
        </SvgText>
        <SvgText x={padding + quadrantWidth*1.75} y={padding + quadrantHeight*1.5} textAnchor="middle" fontSize="12">
          그만하기
        </SvgText>

        {/* 태스크 점들 */}
        {tasks.map((task, index) => {
          const x = padding + (task.urgency / 10) * (width - 2 * padding);
          const y = height - (padding + (task.importance / 10) * (height - 2 * padding));
          
          return (
            <React.Fragment key={index}>
              <Circle
                cx={x}
                cy={y}
                r={10}
                fill="rgba(0,0,0,0)"
                onPress={() => onTaskDelete(index)}
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

        {/* 눈금 표시 */}
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
              {value}
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
              {value}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
});