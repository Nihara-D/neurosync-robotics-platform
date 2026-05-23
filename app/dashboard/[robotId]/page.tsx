'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRobotStore } from '@/lib/store';
import { RobotStatus } from '@/components/RobotStatus';
import { JointController } from '@/components/JointController';
import { CommandConsole } from '@/components/CommandConsole';
import { PredefinedMotions } from '@/components/PredefinedMotions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ChevronLeft, Power, ShieldAlert } from 'lucide-react';

export default function RobotControlPage() {
  const params = useParams();
  const router = useRouter();
  const robotId = params.robotId as string;
  const { robots, simulateUpdate } = useRobotStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      simulateUpdate();
    }, 500);

    return () => clearInterval(interval);
  }, [simulateUpdate]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  const robot = robots[robotId];

  if (!robot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Robot Not Found</h1>
            <p className="text-muted-foreground mt-2">
              Could not find robot with ID: {robotId}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
        return 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400';
      case 'offline':
      case 'disconnected':
        return 'bg-gray-500/10 border-gray-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <Power className="w-4 h-4 mr-2" />
                Start
              </Button>
              <Button variant="destructive" size="sm">
                <ShieldAlert className="w-4 h-4 mr-2" />
                Emergency Stop
              </Button>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{robot.config.name}</h1>
              <p className="text-muted-foreground mt-1">{robot.config.description}</p>
            </div>
            <Badge className={`${getStatusColor(robot.status)} border`}>
              {robot.status.charAt(0).toUpperCase() + robot.status.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Status Panel */}
          <div className="lg:col-span-1">
            <RobotStatus robot={robot} />
          </div>

          {/* Right: Joint Controllers */}
          <div className="lg:col-span-2">
            <div>
              <h2 className="text-xl font-bold mb-4">Joint Control</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Drag sliders or enter values to control robot joints. Click "Send" to execute commands.
              </p>

              {/* Info Box */}
              {!robot.isConnected && (
                <Card className="mb-4 border-yellow-500/20 bg-yellow-500/5">
                  <CardContent className="pt-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-yellow-700 dark:text-yellow-400">
                        Connection Lost
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400/70 mt-1">
                        Robot is offline. Commands will be queued when connection is restored.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Joint Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {robot.joints.map((joint) => (
                  <JointController
                    key={joint.id}
                    joint={joint}
                    onCommandSent={(jointId, position) => {
                      console.log(`Command sent: ${jointId} -> ${position}`);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Predefined Motions */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Motion Library</h2>
              <PredefinedMotions robotId={robot.id} />
            </div>

            {/* Command Console */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Advanced Control Console</h2>
              <CommandConsole robotId={robot.id} />
            </div>

            {/* Telemetry Section */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Real-Time Telemetry</h2>
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-base">Joint States</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left py-2 font-medium">Joint</th>
                          <th className="text-right py-2 font-medium">Position</th>
                          <th className="text-right py-2 font-medium">Velocity</th>
                          <th className="text-right py-2 font-medium">Effort</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {robot.joints.map((joint) => (
                          <tr key={joint.id} className="hover:bg-muted/50">
                            <td className="py-2 font-medium">{joint.name}</td>
                            <td className="text-right py-2 font-mono text-xs">
                              {joint.position.toFixed(3)} rad
                            </td>
                            <td className="text-right py-2 font-mono text-xs">
                              {joint.velocity.toFixed(2)} rad/s
                            </td>
                            <td className="text-right py-2 font-mono text-xs">
                              {joint.effort.toFixed(2)} Nm
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
