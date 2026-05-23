import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Cpu, Gauge, AlertCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30">
              <Cpu className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">NeuroSync</h1>
              <p className="text-xs text-muted-foreground">Neuromorphic Robotics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/Nihara-D/neuromorphic-snn-controller-research-env" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition">
              GitHub
            </a>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left: Hero Text */}
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-purple-600/10 border border-purple-500/30 rounded-full">
                <p className="text-sm text-purple-600 font-medium">Powered by Spiking Neural Networks</p>
              </div>
              <h2 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Neuromorphic Robot Control
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Real-time visualization and control of neuromorphic robot systems. Biologically-inspired control powered by spiking neural networks, Lyapunov stability, and ROS2 integration.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  <Zap className="mr-2 w-4 h-4" />
                  Launch Dashboard
                </Button>
              </Link>
              <Link href="/robots">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Fleet
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Connected Robots</p>
              </div>
              <div>
                <p className="text-2xl font-bold">Live</p>
                <p className="text-sm text-muted-foreground">Platform Status</p>
              </div>
              <div>
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>

          {/* Right: Feature Cards */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 backdrop-blur border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-purple-600" />
                  <CardTitle>Real-Time Control</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sub-500ms latency joint control with live telemetry feedback
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 backdrop-blur border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-600" />
                  <CardTitle>SNN-Powered</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Neuromorphic control with spiking neural networks and Lyapunov stability
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 backdrop-blur border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <CardTitle>Safety First</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Emergency stop, failsafe controls, and system health monitoring
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 pt-20 border-t">
          <h3 className="text-3xl font-bold mb-4">Platform Capabilities</h3>
          <p className="text-muted-foreground mb-12">
            Comprehensive toolkit for neuromorphic robot control and visualization
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Fleet Dashboard', desc: 'Manage multiple robots from a unified interface with real-time status' },
              { title: 'Joint Control', desc: 'Precise control over 6+ DOF manipulators with slider and numeric input' },
              { title: 'Telemetry Streams', desc: 'Real-time sensor data, motor feedback, and performance metrics' },
              { title: 'Command Console', desc: 'Advanced ROS2 command interface for expert users' },
              { title: 'Motion Library', desc: 'Predefined motion sequences for rapid deployment' },
              { title: 'Scalable Design', desc: 'Architected for growth from single robot to multi-robot operations' },
            ].map((feature, i) => (
              <Card key={i} className="bg-gradient-to-br from-background to-purple-600/5 border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Author & Credits */}
        <div className="mt-20 pt-20 border-t">
          <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">About This Project</h3>
            <p className="text-muted-foreground mb-6">
              NeuroSync is part of the Neuromorphic SNN Controller research environment, integrating real-time visualization with spiking neural network-based robot control systems. Built with Next.js 16, React 19, and TypeScript for modern, interactive web-based robotics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-sm font-semibold text-purple-600 mb-2">Author</p>
                <p className="text-foreground font-medium">Nihara Randini</p>
                <a href="mailto:shniharard@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition">
                  shniharard@gmail.com
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-600 mb-2">License</p>
                <p className="text-foreground font-medium">CC-BY-NC-4.0</p>
                <p className="text-sm text-muted-foreground">
                  Creative Commons Attribution-NonCommercial
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-600 mb-2">Repository</p>
                <a 
                  href="https://github.com/Nihara-D/neuromorphic-snn-controller-research-env" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium transition"
                >
                  View on GitHub →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-sm text-muted-foreground">
                © 2026 Nihara Randini. NeuroSync Robotics Platform.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Part of the Neuromorphic SNN Controller Research Environment
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://github.com/Nihara-D" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition">
                GitHub
              </a>
              <a href="mailto:shniharard@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition">
                Contact
              </a>
              <a href="https://github.com/Nihara-D/neuromorphic-snn-controller-research-env/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition">
                License
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
