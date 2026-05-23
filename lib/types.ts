// Robot Status Types
export type RobotStatus = 'online' | 'offline' | 'error' | 'idle' | 'active' | 'disconnected';

// Joint Types
export interface Joint {
  id: string;
  name: string;
  position: number; // Current angle/position in radians or mm
  velocity: number; // Current velocity
  effort: number; // Current effort/torque
  minPosition: number;
  maxPosition: number;
  maxEffort: number;
  maxVelocity: number;
}

// Sensor Data
export interface SensorData {
  temperature: number; // Celsius
  batteryLevel: number; // Percentage 0-100
  cpuUsage: number; // Percentage 0-100
  memoryUsage: number; // Percentage 0-100
  timestamp: number; // Unix timestamp
}

// Robot Configuration
export interface RobotConfig {
  id: string;
  name: string;
  type: string; // e.g., 'manipulator', 'mobile', 'humanoid'
  ros2Namespace: string;
  description?: string;
  imageUrl?: string;
  joints: Joint[];
  dofCount: number; // Degrees of freedom
  created_at?: string;
  owner_id?: string;
}

// Robot State (real-time)
export interface RobotState {
  id: string;
  config: RobotConfig;
  status: RobotStatus;
  joints: Joint[];
  sensors: SensorData;
  lastUpdate: number;
  connectionQuality: number; // 0-100
  isConnected: boolean;
  lastErrorMessage?: string;
}

// Command Types for ROS2
export interface RobotCommand {
  id: string;
  type: 'joint_control' | 'predefined_motion' | 'ros_command' | 'emergency_stop';
  targetRobotId: string;
  payload: Record<string, any>;
  timestamp: number;
  executed?: boolean;
  executedAt?: number;
}

// Predefined Motions
export interface PredefinedMotion {
  id: string;
  name: string;
  description: string;
  keyframes: Keyframe[];
}

export interface Keyframe {
  time: number; // Milliseconds
  joints: Record<string, number>; // Joint name -> position
}

// Telemetry Log Entry
export interface TelemetryEntry {
  timestamp: number;
  robotId: string;
  joints: Record<string, number>;
  sensors: SensorData;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: 'command' | 'telemetry' | 'status' | 'error' | 'ping' | 'pong';
  robotId: string;
  payload: any;
  timestamp: number;
}
