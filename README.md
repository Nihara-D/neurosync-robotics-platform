# NeuroSync Robotics Platform

> Real-time neuromorphic robot control and monitoring platform with spiking neural networks and ROS2 integration

[![License: CC-BY-NC-4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38bdf8)](https://tailwindcss.com/)

## Overview

NeuroSync is an interactive real-time visualization and control portal for neuromorphic robot systems powered by spiking neural networks (SNNs). It bridges the gap between neuroscientific research and practical robotics, providing engineers and researchers with an intuitive interface to monitor, control, and analyze robot behavior driven by biologically-inspired neural controllers.

### Key Features

- **Real-Time Robot Monitoring** - Live telemetry from multiple robots with low-latency updates
- **Joint-Level Control** - Precise control over 6-DOF manipulators with feedback visualization
- **Command Console** - Advanced ROS2 command interface for expert users
- **Motion Library** - Predefined motion sequences for rapid deployment
- **Fleet Management** - Monitor and control multiple robots from a single dashboard
- **Neuromorphic Integration** - Seamless integration with SNN controller backends
- **Safety Features** - Emergency stop, connection monitoring, and failsafe controls
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## Architecture

```
┌─────────────────────────────────────────────────────┐
│              NeuroSync Visualization Portal          │
│            (Real-time React + Next.js 16)            │
└────────────────┬────────────────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
         ▼                ▼
    ┌─────────┐      ┌──────────┐
    │ ROS2    │      │ HTTP/REST│
    │ WebSocket       │ API      │
    └────┬────┘      └────┬─────┘
         │                │
         └───────┬────────┘
                 │
         ┌───────▼───────────┐
         │ Neuromorphic SNN   │
         │ Controller Backend │
         │  (Python/NumPy)    │
         └────────────────────┘
                 │
                 ▼
         ┌──────────────────┐
         │  Robot Hardware  │
         │  (Manipulator,   │
         │   Mobile Base)   │
         └──────────────────┘
```

## System Overview

```
Dashboard View
├── Fleet Overview
│   ├── Robot Status Cards (connection, battery, health)
│   ├── System Metrics (CPU, memory, temperature)
│   └── Quick Controls (emergency stop, enable/disable)
│
├── Individual Robot Control
│   ├── Joint Controllers (sliders + numeric inputs)
│   ├── Real-time Telemetry Stream
│   ├── Motion Library (predefined sequences)
│   └── Advanced Console (ROS2 command interface)
│
└── Status Indicators
    ├── Connection Quality
    ├── Network Latency
    └── System Health
```

## Installation & Setup

### Prerequisites

- **Node.js** 18+ and pnpm
- **Python** 3.10+ (for neuromorphic backend)
- **ROS2** (Humble or later) - optional, for real hardware
- **Git**

### Frontend Installation

```bash
# Clone the repository
git clone https://github.com/Nihara-D/neuromorphic-snn-controller-research-env.git
cd neuromorphic-snn-controller-research-env

# Install dependencies
pnpm install

# Start development server
pnpm dev
# → http://localhost:3000
```

### Backend Setup (Neuromorphic SNN Controller)

```bash
# Install Python dependencies
uv sync

# Run spike encoder
uv run python scripts/spike_encoder.py

# Train SNN with surrogate gradients
uv run python scripts/snn_surrogate_gradient.py

# Verify Lyapunov stability
uv run python scripts/lyapunov_stability.py
```

## Usage

### 1. Dashboard Overview

Navigate to `http://localhost:3000/dashboard` to view:
- All connected robots in real-time
- System health metrics
- Connection status and latency

### 2. Robot Control

Click on any robot to access the control panel:

```
Robot ID: robot-001
├── Status Indicators
│   ├── Battery Level: 87%
│   ├── Temperature: 35.2°C
│   └── Connection: 2.3ms latency
│
├── Joint Controllers
│   ├── Joint-1: 45.3° → 45.5° (target)
│   ├── Joint-2: 120.1° → 120.0°
│   └── [6 total DOF]
│
├── Motion Library
│   ├── Home Position
│   ├── Ready Position
│   └── Wave Motion
│
└── Command Console
    └── Send ROS2 commands directly
```

### 3. Joint Control

Use the slider or numeric input to control joint angles:

```typescript
// Example: Set joint to 90 degrees
Joint "manipulator_joint_1": 90.0° (position feedback: 89.8°)
```

### 4. Advanced Commands

In the Command Console, send JSON-formatted commands:

```json
{
  "type": "joint_control",
  "payload": {
    "joints": {
      "joint_1": 45,
      "joint_2": 90,
      "joint_3": 120
    }
  }
}
```

### 5. Motion Sequences

Execute predefined motions with a single button click:

- **Home Position** - Safe resting pose
- **Ready Position** - Operational stance
- **Wave Motion** - Demo sequence

## API Endpoints

### Command Execution

```bash
POST /api/robots/{robotId}/command
Content-Type: application/json

{
  "type": "joint_control" | "emergency_stop" | "motion",
  "payload": { ... }
}
```

### Motion Library

```bash
POST /api/robots/{robotId}/motions
Content-Type: application/json

{
  "motion": "home_position" | "ready_position" | "wave_motion",
  "duration": 5000  // milliseconds
}
```

### WebSocket ROS2 Bridge

```bash
WS ws://localhost:3000/api/ros/websocket?robot_id={robotId}
```

Maintains real-time connection to ROS2 nodes for:
- Joint state updates
- Sensor telemetry
- Motor feedback
- System health metrics

## Configuration

### Environment Variables

Create a `.env.local` file:

```bash
# ROS2 Bridge Configuration
ROS2_BRIDGE_HOST=localhost
ROS2_BRIDGE_PORT=8000
ROS2_NAMESPACE=/robot

# Robot Configuration
ROBOT_UPDATE_INTERVAL=500  # milliseconds
TELEMETRY_BUFFER_SIZE=1000

# Security
ENABLE_AUTH=false
JWT_SECRET=your-secret-key
```

### Supported Robots

The platform is tested with:
- 6-DOF Collaborative Manipulators (UR, ABB, KUKA)
- 2-DOF Mobile Bases
- Dual-Arm Systems

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16, React 19, TypeScript 5.7 | Web UI and visualization |
| **Styling** | Tailwind CSS 4, shadcn/ui | Component design system |
| **State** | Zustand | Real-time state management |
| **Charts** | Recharts | Telemetry visualization |
| **Backend** | Next.js API Routes | Command handling and ROS2 bridge |
| **Neuromorphic** | Python 3.10+, NumPy | SNN controller and training |
| **Communication** | WebSockets, HTTP/REST | Real-time data and commands |

## Project Structure

```
neurosync-robotics-platform/
│
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── dashboard/
│   │   ├── page.tsx                # Fleet overview
│   │   └── [robotId]/page.tsx      # Robot control panel
│   ├── robots/page.tsx             # Robot list view
│   └── api/
│       └── robots/
│           ├── [robotId]/
│           │   ├── command/route.ts    # Command execution
│           │   └── motions/route.ts    # Motion sequences
│           └── ros/websocket/route.ts  # WebSocket bridge
│
├── components/
│   ├── RobotStatus.tsx             # Status display
│   ├── JointController.tsx         # Joint control UI
│   ├── CommandConsole.tsx          # Advanced console
│   ├── PredefinedMotions.tsx       # Motion library
│   └── ui/                         # shadcn/ui components
│
├── lib/
│   ├── types.ts                    # TypeScript types
│   ├── mock-data.ts                # Demo data
│   ├── store.ts                    # Zustand store
│   └── useRosConnection.ts         # WebSocket hook
│
├── public/                         # Static assets
├── styles/                         # Global styles
│
├── package.json
├── tsconfig.json
├── next.config.mjs
├── ROS2_INTEGRATION.md            # ROS2 setup guide
└── DEPLOYMENT.md                  # Deployment guide
```

## ROS2 Integration

The platform includes a native WebSocket bridge to ROS2:

```python
# ROS2 Node Example
import rclpy
from std_msgs.msg import Float64MultiArray

def publish_joint_state(node):
    publisher = node.create_publisher(Float64MultiArray, '/robot/joint_state', 10)
    msg = Float64MultiArray()
    msg.data = [45.0, 90.0, 120.0, 0.0, 45.0, 90.0]  # 6 DOF values
    publisher.publish(msg)
```

For detailed integration instructions, see [ROS2_INTEGRATION.md](./ROS2_INTEGRATION.md).

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Self-Hosted Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Docker containerization
- Kubernetes orchestration
- Cloud provider setup (AWS, Azure, GCP)
- On-premise installation

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-idea`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-idea`
5. Open a Pull Request

## Research & References

This project integrates with the Neuromorphic SNN Controller research framework. Key research concepts:

- **Spiking Neural Networks (SNNs)** - Biologically-plausible neural computation
- **Surrogate Gradients** - Enable backpropagation through non-differentiable spike functions
- **Lyapunov Stability** - Formal guarantees on controller convergence
- **Neuromorphic Robotics** - Applying brain-inspired computing to real robots

### Background Reading

- [Leaky Integrate-and-Fire Neurons](https://en.wikipedia.org/wiki/Leaky_integrate-and-fire)
- [Surrogate Gradient Methods for SNN Learning](https://arxiv.org/abs/1901.09114)
- [Lyapunov Stability for Nonlinear Systems](https://en.wikipedia.org/wiki/Lyapunov_stability)
- [Neuromorphic Computing in Robotics](https://arxiv.org/search/?query=neuromorphic+robotics)

## Troubleshooting

### Connection Issues

```bash
# Check ROS2 bridge connectivity
curl http://localhost:3000/api/robots/robot-001/status

# Verify WebSocket
wscat -c ws://localhost:3000/api/ros/websocket?robot_id=robot-001
```

### Performance

- Increase `ROBOT_UPDATE_INTERVAL` if CPU usage is high
- Use network profiling tools to identify bottlenecks
- Deploy on hardware with sufficient compute (4+ cores, 8GB RAM recommended)

### Mock Data vs Real Robots

By default, the platform runs with mock data. To connect real robots:

1. Set `USE_MOCK_DATA=false` in `.env.local`
2. Configure `ROS2_BRIDGE_HOST` and `ROS2_BRIDGE_PORT`
3. Ensure ROS2 nodes are running and publishing joint states

## Performance Metrics

Typical latency when connected to real ROS2:
- **Command execution**: 50-200ms
- **Telemetry update**: 100-500ms
- **UI render**: <16ms (60 FPS)
- **Network latency**: 2-20ms (LAN)

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License** (CC-BY-NC-4.0).

You are free to:
- ✅ Share and adapt the work
- ✅ Use for non-commercial purposes
- ✅ Attribute to the original author

You may not:
- ❌ Use for commercial purposes
- ❌ Remove attribution

See [LICENSE](./LICENSE) for details.

## Citation

If you use NeuroSync in your research, please cite:

```bibtex
@software{neurosync2026,
  author = {Randini, Nihara},
  title = {NeuroSync Robotics Platform: Real-time Neuromorphic Robot Control and Visualization},
  year = {2026},
  url = {https://github.com/Nihara-D/neuromorphic-snn-controller-research-env},
  license = {CC-BY-NC-4.0}
}
```

## Contact & Support

- **Author**: Nihara Randini
- **Email**: shniharard@gmail.com
- **GitHub**: [@Nihara-D](https://github.com/Nihara-D)
- **Issues**: [GitHub Issues](https://github.com/Nihara-D/neuromorphic-snn-controller-research-env/issues)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/), [React](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Neuromorphic framework integrated with [NumPy](https://numpy.org/) and [Matplotlib](https://matplotlib.org/)

---

**Version**: 1.0.0 | **Last Updated**: May 2026 | **Status**: Active Development
