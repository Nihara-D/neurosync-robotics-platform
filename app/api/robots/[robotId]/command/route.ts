import { NextRequest, NextResponse } from 'next/server';
import { RobotCommand } from '@/lib/types';

interface CommandParams {
  params: {
    robotId: string;
  };
}

/**
 * Execute robot commands via HTTP
 * 
 * POST /api/robots/[robotId]/command
 * Body: { type, payload }
 */
export async function POST(request: NextRequest, { params }: CommandParams) {
  const { robotId } = params;

  try {
    const body = await request.json();
    const { type, payload } = body;

    if (!type || !payload) {
      return NextResponse.json(
        { error: 'type and payload are required' },
        { status: 400 }
      );
    }

    // Validate robot exists
    // TODO: Check if robot is registered in database
    const validRobots = ['robot-001', 'robot-002', 'robot-003'];
    if (!validRobots.includes(robotId)) {
      return NextResponse.json(
        { error: `Robot ${robotId} not found` },
        { status: 404 }
      );
    }

    // Create command record
    const command: RobotCommand = {
      id: `cmd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type as RobotCommand['type'],
      targetRobotId: robotId,
      payload,
      timestamp: Date.now(),
    };

    // Route command based on type
    switch (type) {
      case 'joint_control':
        return handleJointControl(robotId, command);
      case 'predefined_motion':
        return handlePredefinedMotion(robotId, command);
      case 'ros_command':
        return handleRosCommand(robotId, command);
      case 'emergency_stop':
        return handleEmergencyStop(robotId, command);
      default:
        return NextResponse.json(
          { error: `Unknown command type: ${type}` },
          { status: 400 }
        );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

async function handleJointControl(
  robotId: string,
  command: RobotCommand
): Promise<NextResponse> {
  const { joints } = command.payload;

  if (!joints || typeof joints !== 'object') {
    return NextResponse.json(
      { error: 'joints object is required in payload' },
      { status: 400 }
    );
  }

  // TODO: Forward to ROS2 joint trajectory controller
  // rostopic pub /robot_{robotId}/joint_trajectory_controller/command trajectory_msgs/JointTrajectory ...

  console.log(`[Command] Joint control for ${robotId}:`, joints);

  return NextResponse.json({
    success: true,
    commandId: command.id,
    robotId,
    type: 'joint_control',
    message: 'Joint command accepted',
    executedAt: new Date().toISOString(),
    // In real implementation, include trajectory status/feedback
    status: 'queued',
  });
}

async function handlePredefinedMotion(
  robotId: string,
  command: RobotCommand
): Promise<NextResponse> {
  const { motionId, repeat } = command.payload;

  if (!motionId) {
    return NextResponse.json(
      { error: 'motionId is required in payload' },
      { status: 400 }
    );
  }

  // TODO: Lookup motion definition and execute
  // rostopic pub /robot_{robotId}/motion_executor std_msgs/String "data: {motionId}"

  console.log(`[Command] Predefined motion for ${robotId}:`, motionId, `repeat=${repeat || 1}`);

  return NextResponse.json({
    success: true,
    commandId: command.id,
    robotId,
    type: 'predefined_motion',
    motionId,
    message: 'Motion execution started',
    executedAt: new Date().toISOString(),
    status: 'executing',
  });
}

async function handleRosCommand(
  robotId: string,
  command: RobotCommand
): Promise<NextResponse> {
  const { topic, messageType, data } = command.payload;

  if (!topic || !data) {
    return NextResponse.json(
      { error: 'topic and data are required in payload' },
      { status: 400 }
    );
  }

  // TODO: Execute raw ROS command
  // rostopic pub {topic} {messageType} '{data}'

  console.log(`[Command] Raw ROS command for ${robotId}:`, topic, data);

  return NextResponse.json({
    success: true,
    commandId: command.id,
    robotId,
    type: 'ros_command',
    message: 'ROS command executed',
    executedAt: new Date().toISOString(),
    status: 'executed',
  });
}

async function handleEmergencyStop(
  robotId: string,
  command: RobotCommand
): Promise<NextResponse> {
  // Priority: execute immediately, no queueing
  // rostopic pub /robot_{robotId}/emergency_stop std_msgs/Bool "data: true"

  console.log(`[Command] EMERGENCY STOP for ${robotId}`);

  // TODO: Trigger immediate robot halt
  // - Stop all moving joints
  // - Clear motion queue
  // - Transition to safe state

  return NextResponse.json({
    success: true,
    commandId: command.id,
    robotId,
    type: 'emergency_stop',
    message: 'EMERGENCY STOP executed',
    executedAt: new Date().toISOString(),
    status: 'executed',
    priority: 'critical',
  });
}

/**
 * GET endpoint to check command status
 */
export async function GET(request: NextRequest, { params }: CommandParams) {
  const { robotId } = params;
  const { searchParams } = new URL(request.url);
  const commandId = searchParams.get('commandId');

  if (!commandId) {
    return NextResponse.json(
      { error: 'commandId query parameter is required' },
      { status: 400 }
    );
  }

  // TODO: Query command status from ROS2 action server
  return NextResponse.json({
    commandId,
    robotId,
    status: 'completed',
    executedAt: new Date().toISOString(),
    feedback: null,
  });
}
