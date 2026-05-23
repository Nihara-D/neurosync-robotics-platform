'use client';

import Link from 'next/link';
import { useRobotStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Cpu } from 'lucide-react';

export default function RobotsPage() {
  const { robots, setSelectedRobot } = useRobotStore();
  const robotsList = Object.values(robots);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
        return 'bg-green-500 text-white';
      case 'idle':
        return 'bg-blue-500 text-white';
      case 'offline':
      case 'disconnected':
        return 'bg-gray-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-muted text-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Robot Fleet</h1>
              <p className="text-muted-foreground mt-1">
                Overview of all available robots in your fleet
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Table View */}
        <Card className="mb-8 bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Fleet Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">Robot Name</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Battery</th>
                    <th className="text-left py-3 px-4 font-medium">Connection</th>
                    <th className="text-left py-3 px-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {robotsList.map((robot) => (
                    <tr key={robot.id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{robot.config.name}</p>
                          <p className="text-xs text-muted-foreground">{robot.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">
                          {robot.config.type.charAt(0).toUpperCase() + robot.config.type.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(robot.status)}>
                          {robot.status.charAt(0).toUpperCase() + robot.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ width: `${robot.sensors.batteryLevel}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {robot.sensors.batteryLevel.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${robot.connectionQuality}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {robot.connectionQuality.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/dashboard/${robot.id}`}>
                          <Button
                            onClick={() => setSelectedRobot(robot.id)}
                            size="sm"
                            variant="ghost"
                          >
                            Control
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Grid */}
        <div>
          <h2 className="text-xl font-bold mb-4">Detailed Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {robotsList.map((robot) => (
              <Card key={robot.id} className="bg-card/50 backdrop-blur border-border/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{robot.config.name}</span>
                    <Badge className={getStatusColor(robot.status)}>
                      {robot.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Config Info */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Type</p>
                      <p className="font-medium">{robot.config.type}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Degrees of Freedom</p>
                      <p className="font-medium">{robot.config.dofCount}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">ROS2 Namespace</p>
                      <p className="font-mono text-xs bg-muted rounded p-2">
                        {robot.config.ros2Namespace}
                      </p>
                    </div>

                    {/* Sensors Grid */}
                    <div className="pt-4 border-t">
                      <p className="text-xs font-medium mb-3">System Status</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-xs text-muted-foreground">Battery</p>
                          <p className="font-medium">{robot.sensors.batteryLevel.toFixed(0)}%</p>
                        </div>
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-xs text-muted-foreground">Temperature</p>
                          <p className="font-medium">{robot.sensors.temperature.toFixed(1)}°C</p>
                        </div>
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-xs text-muted-foreground">CPU</p>
                          <p className="font-medium">{robot.sensors.cpuUsage.toFixed(0)}%</p>
                        </div>
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-xs text-muted-foreground">Signal</p>
                          <p className="font-medium">{robot.connectionQuality.toFixed(0)}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Control Button */}
                    <Link href={`/dashboard/${robot.id}`} className="block pt-2">
                      <Button
                        onClick={() => setSelectedRobot(robot.id)}
                        className="w-full"
                      >
                        Open Control Panel
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
