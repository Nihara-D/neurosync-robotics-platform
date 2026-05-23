# Contributing to NeuroSync Robotics Platform

First off, thank you for considering contributing to NeuroSync! This is a research-focused project combining neuromorphic computing with robotics, and we welcome contributions from researchers, engineers, and enthusiasts.

## Code of Conduct

- Be respectful and constructive in all interactions
- Acknowledge and attribute existing work and research
- Focus on scientific accuracy and practical utility
- Help others learn and improve their understanding

## How to Contribute

### Reporting Issues

Found a bug or have a feature request?

1. Check if the issue already exists on [GitHub Issues](https://github.com/Nihara-D/neuromorphic-snn-controller-research-env/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs. actual behavior
   - Your environment (OS, Node version, Python version)

### Submitting Changes

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/neuromorphic-snn-controller-research-env.git
   cd neuromorphic-snn-controller-research-env
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Write clear, commented code
   - Follow the existing code style
   - For Python: use type hints and docstrings
   - For TypeScript/React: follow the project's patterns

4. **Test your changes**
   ```bash
   # Frontend
   pnpm dev
   pnpm lint

   # Backend (Python)
   uv run python scripts/your_script.py
   python -m pytest tests/  # if tests exist
   ```

5. **Commit with descriptive messages**
   ```bash
   git commit -m "feature: Add [specific feature] to [component]"
   git commit -m "fix: Resolve [issue description] in [component]"
   git commit -m "docs: Update [section] with [information]"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Link to any related issues
   - Describe your changes clearly
   - Include screenshots or videos if applicable
   - Explain the motivation and testing approach

## Contribution Areas

We're particularly interested in contributions to:

### Frontend/Visualization
- Additional visualization types for neural firing patterns
- Improved 3D visualization of robot state
- Performance optimizations
- Accessibility improvements
- Mobile responsiveness enhancements

### Backend/ROS2 Integration
- Extended ROS2 message support
- Additional robot hardware drivers
- Real-time performance optimizations
- Network latency reduction strategies

### Neuromorphic/Research
- New SNN training algorithms
- Improved stability verification methods
- Novel encoding/decoding schemes
- Benchmark datasets and comparisons

### Documentation
- Tutorials and guides
- Video demonstrations
- API documentation
- Research paper references

### Testing
- Unit tests for components
- Integration tests for ROS2 bridge
- Performance benchmarks
- Stress testing with large robot fleets

## Development Setup

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.10+
- Git

### Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run linter
pnpm lint

# Build for production
pnpm build
```

### Project Structure

```
neurosync-robotics-platform/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utilities and hooks
├── scripts/                # Python neuromorphic backend
├── public/                 # Static assets
└── tests/                  # Test files (when added)
```

## Style Guidelines

### TypeScript/React

```typescript
// Use clear, descriptive names
const handleJointPositionChange = (jointId: string, position: number) => {
  // Implementation
}

// Prefer functional components
export const RobotStatus: React.FC<RobotStatusProps> = ({ robot }) => {
  return <div>{/* JSX */}</div>
}

// Use type safety
interface RobotControlProps {
  robotId: string
  onCommand: (cmd: Command) => Promise<void>
}
```

### Python

```python
"""Module docstring explaining purpose."""

from typing import List, Dict, Optional

def encode_spike_train(signal: float, max_rate: int = 500) -> List[int]:
    """
    Encode continuous signal as Poisson spike train.
    
    Args:
        signal: Input signal value (typically normalized -1 to 1)
        max_rate: Maximum firing rate in Hz
        
    Returns:
        Binary spike train [0, 1, 1, 0, ...]
    """
    # Implementation with clear comments
    pass
```

## Commit Message Guidelines

Follow conventional commits:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring without feature/fix changes
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Build process, dependencies, etc.

Example:
```
feat: Add 3D visualization of robot end-effector trajectory

- Implement Three.js-based 3D rendering
- Add real-time trajectory history buffer
- Include visual trail options (on/off)

Fixes #42
```

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Write a clear PR description
- Reference related issues with `Fixes #123` or `Related to #456`
- Request reviews from maintainers
- Be responsive to feedback and review comments

## Attribution

All contributions are valued and will be acknowledged:

- Significant contributions will be added to the project's CONTRIBUTORS.md
- Code authors are preserved in git history
- Research contributions may be mentioned in project documentation or papers

## License

By contributing to NeuroSync, you agree that your contributions will be licensed under the same CC-BY-NC-4.0 license as the project.

For commercial use inquiries, please contact the project maintainer.

## Questions?

- Open an issue for clarification
- Email: shniharard@gmail.com
- Check existing documentation and discussions

Thank you for making NeuroSync better! 🧠🤖
