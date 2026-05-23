import { NextRequest, NextResponse } from 'next/server';

interface MotionParams {
  params: {
    robotId: string;
  };
}

interface PredefinedMotion {
  id: string;
  name: string;
  description: string;
  duration: number; // milliseconds
  joints: Record<string, number[]>;
}

// Sample predefined motions for different robot types
const PREDEFINED_MOTIONS: Record<string, PredefinedMotion[]> = {
  'robot-001': [
    {
      id: 'home_position',
      name: 'Home Position',
      description: 'Return robot to neutral home position',
      duration: 2000,
      joints: {
        'joint-1': [0.0],
        'joint-2': [0.0],
        'joint-3': [0.0],
        'joint-4': [0.0],
        'joint-5': [0.0],
        'joint-6': [0.0],
      },
    },
    {
      id: 'ready_position',
      description: 'Position robot for grasping tasks',
      name: 'Ready Position',
      duration: 1500,
      joints: {
        'joint-1': [0.0],
        'joint-2': [-1.57],
        'joint-3': [1.57],
        'joint-4': [0.0],
        'joint-5': [0.0],
        'joint-6': [0.0],
      },
    },
    {
      id: 'wave',
      name: 'Wave Motion',
      description: 'Make the robot wave its end effector',
      duration: 3000,
      joints: {
        'joint-1': [0.0, 0.5, 1.0, 0.5, 0.0],
        'joint-2': [-1.57, -1.57, -1.57, -1.57, -1.57],
        'joint-3': [1.57, 1.57, 1.57, 1.57, 1.57],
        'joint-4': [0.0, 0.2, 0.4, 0.2, 0.0],
        'joint-5': [0.0, 0.0, 0.0, 0.0, 0.0],
        'joint-6': [0.0, 0.0, 0.0, 0.0, 0.0],
      },
    },
  ],
};

/**
 * GET /api/robots/[robotId]/motions
 * List available predefined motions for a robot
 */
export async function GET(request: NextRequest, { params }: MotionParams) {
  const { robotId } = params;

  const motions = PREDEFINED_MOTIONS[robotId] || PREDEFINED_MOTIONS['robot-001'];

  return NextResponse.json({
    robotId,
    motions: motions.map(({ joints, ...motion }) => motion), // Exclude joint data from list
  });
}

/**
 * POST /api/robots/[robotId]/motions
 * Execute a predefined motion or create a custom one
 */
export async function POST(request: NextRequest, { params }: MotionParams) {
  const { robotId } = params;

  try {
    const { motionId, customJoints, repeat } = await request.json();

    if (!motionId) {
      return NextResponse.json(
        { error: 'motionId is required' },
        { status: 400 }
      );
    }

    // Find predefined motion
    const motions = PREDEFINED_MOTIONS[robotId] || PREDEFINED_MOTIONS['robot-001'];
    const motion = motions.find((m) => m.id === motionId);

    if (!motion && !customJoints) {
      return NextResponse.json(
        {
          error: `Motion ${motionId} not found`,
          availableMotions: motions.map((m) => m.id),
        },
        { status: 404 }
      );
    }

    const joints = customJoints || motion!.joints;
    const repeatCount = repeat || 1;

    // TODO: Send motion to ROS2 trajectory executor
    console.log(`[Motion API] Executing motion ${motionId} for ${robotId}:`, {
      joints,
      repeatCount,
      duration: motion?.duration,
    });

    return NextResponse.json({
      success: true,
      robotId,
      motionId,
      motion: motion ? { ...motion, joints } : { id: motionId, joints },
      repetitions: repeatCount,
      message: `Motion ${motionId} queued for execution`,
      executedAt: new Date().toISOString(),
      estimatedDuration: (motion?.duration || 2000) * repeatCount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/robots/[robotId]/motions?motionId=...
 * Cancel a motion execution
 */
export async function DELETE(request: NextRequest, { params }: MotionParams) {
  const { robotId } = params;
  const { searchParams } = new URL(request.url);
  const motionId = searchParams.get('motionId');

  if (!motionId) {
    return NextResponse.json(
      { error: 'motionId query parameter is required' },
      { status: 400 }
    );
  }

  // TODO: Cancel motion execution on ROS2
  console.log(`[Motion API] Cancelling motion ${motionId} for ${robotId}`);

  return NextResponse.json({
    success: true,
    robotId,
    motionId,
    message: `Motion ${motionId} cancelled`,
    cancelledAt: new Date().toISOString(),
  });
}
