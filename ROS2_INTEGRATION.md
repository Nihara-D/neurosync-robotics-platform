# NeuroSync ROS2 Integration Guide

## Architecture Overview

The NeuroSync platform uses a WebSocket bridge to communicate with ROS2 systems in real-time. This document describes the integration architecture and how to connect your robots.

## Components

### Frontend (Next.js)
- **useRosConnection hook** (`lib/useRosConnection.ts`): Client-side WebSocket connection management
- **Command Console** (`components/CommandConsole.tsx`): Interactive command interface
- **Joint Controllers**: Real-time joint position control with direct API calls

### Backend (API Routes)
- **`/api/ros/websocket`**: WebSocket upgrade endpoint (requires custom server)
- **`/api/robots/[robotId]/command`**: HTTP command execution endpoint
- **Command Router**: Routes commands to appropriate ROS2 handlers

## Setting Up ROS2 Bridge

### Option 1: WebSocket Bridge (Real-time, Recommended)

For live streaming telemetry and low-latency control:

```bash
# Install ROS2 bridge dependencies
pip install python-socketio python-engineio aiohttp

# Create ROS2 bridge node
python3 neuro_sync_bridge.py --robot-namespace /robot_alpha
```

### Option 2: HTTP API (Stateless, Simple)

For command-based interaction without live telemetry:

```bash
# All commands go through /api/robots/[robotId]/command
POST /api/robots/robot-001/command
{
  "type": "joint_control",
  "payload": {
    "joints": {
      "joint-1": 1.57,
      "joint-2": -0.78
    }
  }
}
```

## Command Types

### Joint Control
```json
{
  "type": "joint_control",
  "payload": {
    "joints": {
      "shoulder": 1.57,
      "elbow": -0.78,
      "wrist": 0.0
    }
  }
}
```

### Emergency Stop
```json
{
  "type": "emergency_stop",
  "payload": {}
}
```

### Predefined Motion
```json
{
  "type": "predefined_motion",
  "payload": {
    "motionId": "home_position",
    "repeat": 1
  }
}
```

### Raw ROS Command
```json
{
  "type": "ros_command",
  "payload": {
    "topic": "/robot_alpha/cmd_vel",
    "messageType": "geometry_msgs/Twist",
    "data": "{\"linear\":{\"x\":0.5},\"angular\":{\"z\":0.0}}"
  }
}
```

## ROS2 Topic Mapping

### Subscriptions (Telemetry from Robot)
```
/robot_{robotId}/joint_states         → Joint positions, velocities, efforts
/robot_{robotId}/imu/data             → Inertial measurement data
/robot_{robotId}/battery_status       → Battery level and temperature
/robot_{robotId}/system_monitor       → CPU, memory usage
```

### Publishers (Commands to Robot)
```
/robot_{robotId}/joint_trajectory_controller/follow_joint_trajectory  → Joint trajectories
/robot_{robotId}/emergency_stop                                       → Emergency stop
/robot_{robotId}/motion_executor                                      → Predefined motions
/robot_{robotId}/cmd_vel                                              → Velocity commands (mobile robots)
```

## Environment Variables

```env
# ROS2 configuration
ROS_DOMAIN_ID=0
ROS_DISTRO=humble
ROS_LOCALHOST_ONLY=0  # Allow remote connections

# NeuroSync configuration
NEUROSYNC_ROS_BRIDGE_HOST=localhost
NEUROSYNC_ROS_BRIDGE_PORT=9090
NEUROSYNC_TELEMETRY_RATE=50  # Hz
```

## Example ROS2 Bridge Implementation (Python)

```python
#!/usr/bin/env python3

import asyncio
import json
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState
from std_msgs.msg import Float64MultiArray
from socketio import AsyncServer, AsyncClient

class NeuroSyncBridge(Node):
    def __init__(self):
        super().__init__('neurosync_bridge')
        self.sio = AsyncServer(async_mode='aiohttp', cors_allowed_origins='*')
        
        # ROS2 subscriptions
        self.joint_state_sub = self.create_subscription(
            JointState,
            'joint_states',
            self.joint_state_callback,
            10
        )
        
        # ROS2 publishers
        self.joint_cmd_pub = self.create_publisher(
            Float64MultiArray,
            'joint_trajectory_controller/commands',
            10
        )
    
    def joint_state_callback(self, msg):
        # Broadcast to all connected WebSocket clients
        telemetry = {
            'type': 'telemetry',
            'robotId': self.get_parameter('robot_id').value,
            'joints': {
                name: {
                    'position': pos,
                    'velocity': vel,
                    'effort': eff
                }
                for name, pos, vel, eff in zip(
                    msg.name, msg.position, msg.velocity, msg.effort
                )
            },
            'timestamp': self.get_clock().now().nanoseconds
        }
        self.sio.emit('telemetry', telemetry, broadcast=True)
    
    async def handle_command(self, command):
        if command['type'] == 'joint_control':
            # Convert to ROS2 command
            joints = command['payload']['joints']
            msg = Float64MultiArray()
            msg.data = [joints.get(name, 0.0) for name in self.joint_names]
            self.joint_cmd_pub.publish(msg)

async def main():
    rclpy.init()
    bridge = NeuroSyncBridge()
    
    # Run ROS2 and WebSocket server
    executor = rclpy.executors.MultiThreadedExecutor()
    executor.add_node(bridge)
    executor.spin()

if __name__ == '__main__':
    asyncio.run(main())
```

## Deployment

### Local Development
```bash
# Terminal 1: Start ROS2 bridge
python3 ros2_bridge.py --robot-id robot-001

# Terminal 2: Start NeuroSync
pnpm dev
```

### Production (Vercel)

1. **Custom Server**: Use `@vercel/functions` with `serverless-http` for WebSocket support
2. **Alternative**: Deploy ROS2 bridge separately and use HTTP API
3. **Docker**: Package everything in a container for Vercel

## Troubleshooting

### WebSocket Connection Fails
- Check if ROS2 bridge is running
- Verify firewall allows connections on port 9090
- Check browser console for WebSocket errors

### Commands Not Executing
- Verify robot namespace matches configuration
- Check ROS2 node logs: `ros2 node list`
- Test with `ros2 topic pub` manually

### Telemetry Not Updating
- Verify joint_states topic is being published: `ros2 topic echo /robot_alpha/joint_states`
- Check subscription filtering in bridge code
- Increase `NEUROSYNC_TELEMETRY_RATE` if needed

## Next Steps

1. Implement actual ROS2 bridge for your robot
2. Configure topic mappings for your specific robot
3. Add authentication (JWT tokens for commands)
4. Implement data logging and history
5. Add 3D visualization with digital twin
6. Implement motion recording and playback

## References

- [ROS2 Official Documentation](https://docs.ros.org/)
- [WebSocket Bridge Examples](https://github.com/rosbridge-suite/rosbridge_suite)
- [NeuroSync API Reference](./API.md)
