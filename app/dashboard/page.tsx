'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRobotStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, AlertCircle, WifiOff } from 'lucide-react';

export default function DashboardPage() {
  const { robots, setSelectedRobot, simulateUpdate } = useRobotStore();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      simulateUpdate();
    }, 500);

    return () => clearInterval(interval);
  }, [simulateUpdate]);

  const robotsList = Object.values(robots);
  const onlineCount = robotsList.filter(r => r.isConnected).length;
  const activeCount = robotsList.filter(r => r.status === 'active').length;

  const getStatusBadge = (status: string) => {
    const badgeConfig: Record<string, { bg: string; text: string; icon: any }> = {
      'online': { bg: 'bg-green-500/10', text: 'text-green-700 dark:text-green-400', icon: Zap },
      'idle': { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', icon: Zap },
      'active': { bg: 'bg-blue-600/10', text: 'text-blue-700 dark:text-blue-400', icon: Zap },
      'offline': { bg: 'bg-gray-500/10', text: 'text-gray-700 dark:text-gray-400', icon: WifiOff },
      'error': { bg: 'bg-red-500/10', text: 'text-red-700 dark:text-red-400', icon: AlertCircle },
    };

    const config = badgeConfig[status] || badgeConfig['offline'];
    const Icon = config.icon;

    return (
      <Badge className={`${config.bg} border-none`} variant="secondary">
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Robot Fleet Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Monitor and control your robots in real-time
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Robots</p>
                  <p className="text-2xl font-bold mt-2">{robotsList.length}</p>
                </div>
                <Zap className="w-5 h-5 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Online</p>
                  <p className="text-2xl font-bold mt-2">{onlineCount}</p>
                </div>
                <Zap className="w-5 h-5 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold mt-2">{activeCount}</p>
                </div>
                <Zap className="w-5 h-5 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Connection Quality</p>
                  <p className="text-2xl font-bold mt-2">
                    {(
                      robotsList.reduce((sum, r) => sum + r.connectionQuality, 0) /
                      robotsList.length
                    ).toFixed(0)}
                    %
                  </p>
                </div>
                <Zap className="w-5 h-5 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Robot Grid */}
        <div>
          <h2 className="text-xl font-bold mb-4">Connected Robots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {robotsList.map((robot) => (
              <Card key={robot.id} className="hover:shadow-lg transition-shadow bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{robot.config.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {robot.config.type.charAt(0).toUpperCase() + robot.config.type.slice(1)} • {robot.config.dofCount} DOF
                      </p>
                    </div>
                    {getStatusBadge(robot.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-xs text-muted-foreground">Battery</p>
                        <p className="font-medium text-sm">{robot.sensors.batteryLevel.toFixed(0)}%</p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-xs text-muted-foreground">Temp</p>
                        <p className="font-medium text-sm">{robot.sensors.temperature.toFixed(1)}°C</p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-xs text-muted-foreground">CPU</p>
                        <p className="font-medium text-sm">{robot.sensors.cpuUsage.toFixed(0)}%</p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-xs text-muted-foreground">Signal</p>
                        <p className="font-medium text-sm">{robot.connectionQuality.toFixed(0)}%</p>
                      </div>
                    </div>

                    {/* Connection Quality Bar */}
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium">Connection</p>
                        <span className="text-xs">{robot.connectionQuality.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${robot.connectionQuality}%` }}
                        />
                      </div>
                    </div>

                    {/* Control Button */}
                    <Link href={`/dashboard/${robot.id}`}>
                      <Button
                        onClick={() => setSelectedRobot(robot.id)}
                        className="w-full mt-4"
                        variant="default"
                      >
                        Control
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
