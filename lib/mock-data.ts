import { RobotState, RobotConfig, Joint, SensorData } from './types';

// Mock Joint Data
const createMockJoint = (id: string, name: string): Joint => ({
  id,
  name,
  position: Math.random() * 3.14,
  velocity: (Math.random() - 0.5) * 2,
  effort: Math.random() * 50,
  minPosition: -3.14,
  maxPosition: 3.14,
  maxEffort: 100,
  maxVelocity: 2.0,
});

// Mock Sensor Data
export const createMockSensorData = (): SensorData => ({
  temperature: 35 + Math.random() * 10,
  batteryLevel: 75 + Math.random() * 20,
  cpuUsage: 30 + Math.random() * 40,
  memoryUsage: 40 + Math.random() * 30,
  timestamp: Date.now(),
});

// Mock Robot Configurations
export const mockRobotConfigs: RobotConfig[] = [
  {
    id: 'robot-001',
    name: 'Manipulator Alpha',
    type: 'manipulator',
    ros2Namespace: '/robot_alpha',
    description: '6-DOF collaborative manipulator',
    joints: [
      createMockJoint('joint-1', 'Base'),
      createMockJoint('joint-2', 'Shoulder'),
      createMockJoint('joint-3', 'Elbow'),
      createMockJoint('joint-4', 'Wrist 1'),
      createMockJoint('joint-5', 'Wrist 2'),
      createMockJoint('joint-6', 'Wrist 3'),
    ],
    dofCount: 6,
  },
  {
    id: 'robot-002',
    name: 'Mobile Base Beta',
    type: 'mobile',
    ros2Namespace: '/robot_beta',
    description: 'Wheeled mobile robot platform',
    joints: [
      createMockJoint('wheel-left', 'Left Wheel'),
      createMockJoint('wheel-right', 'Right Wheel'),
    ],
    dofCount: 2,
  },
  {
    id: 'robot-003',
    name: 'Dual-Arm Gamma',
    type: 'manipulator',
    ros2Namespace: '/robot_gamma',
    description: 'Dual-arm collaborative system',
    joints: [
      createMockJoint('left-1', 'Left Base'),
      createMockJoint('left-2', 'Left Shoulder'),
      createMockJoint('left-3', 'Left Elbow'),
      createMockJoint('right-1', 'Right Base'),
      createMockJoint('right-2', 'Right Shoulder'),
      createMockJoint('right-3', 'Right Elbow'),
    ],
    dofCount: 6,
  },
];

// Create mock robot states
export const createMockRobotState = (config: RobotConfig): RobotState => ({
  id: config.id,
  config,
  status: Math.random() > 0.1 ? 'online' : 'idle',
  joints: config.joints.map(j => ({
    ...j,
    position: Math.random() * (j.maxPosition - j.minPosition) + j.minPosition,
    velocity: (Math.random() - 0.5) * j.maxVelocity,
    effort: Math.random() * j.maxEffort,
  })),
  sensors: createMockSensorData(),
  lastUpdate: Date.now(),
  connectionQuality: 80 + Math.random() * 20,
  isConnected: true,
});

// Initial mock robot states
export const mockRobotStates: Record<string, RobotState> = {
  'robot-001': createMockRobotState(mockRobotConfigs[0]),
  'robot-002': createMockRobotState(mockRobotConfigs[1]),
  'robot-003': createMockRobotState(mockRobotConfigs[2]),
};

// Update mock state with slight variations
export function updateMockRobotState(state: RobotState): RobotState {
  return {
    ...state,
    joints: state.joints.map(j => ({
      ...j,
      position: j.position + (Math.random() - 0.5) * 0.1,
      velocity: (Math.random() - 0.5) * j.maxVelocity,
      effort: Math.random() * j.maxEffort,
    })),
    sensors: createMockSensorData(),
    lastUpdate: Date.now(),
    connectionQuality: Math.max(70, 90 + Math.random() * 10),
  };
}
