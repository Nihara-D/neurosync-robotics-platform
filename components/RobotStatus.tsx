'use client';

import { RobotState } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, WifiOff, Zap } from 'lucide-react';

interface RobotStatusProps {
  robot: RobotState;
}

export function RobotStatus({ robot }: RobotStatusProps) {
  const getStatusColor = () => {
    switch (robot.status) {
      case 'online':
      case 'active':
        return 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400';
      case 'idle':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400';
      case 'offline':
      case 'disconnected':
        return 'bg-gray-500/10 border-gray-500/20 text-gray-700 dark:text-gray-400';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-muted';
    }
  };

  const getStatusIcon = () => {
    switch (robot.status) {
      case 'online':
      case 'active':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'offline':
      case 'disconnected':
        return <WifiOff className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{robot.config.name}</span>
          <Badge className={`${getStatusColor()} border`} variant="outline">
            <span className="flex items-center gap-1">
              {getStatusIcon()}
              {robot.status.charAt(0).toUpperCase() + robot.status.slice(1)}
            </span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium">{robot.config.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">DOF</p>
              <p className="font-medium">{robot.config.dofCount}</p>
            </div>
          </div>

          {/* Sensor Data */}
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-3">System Health</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded p-2">
                <p className="text-xs text-muted-foreground">Battery</p>
                <p className="text-sm font-medium">{robot.sensors.batteryLevel.toFixed(0)}%</p>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <p className="text-xs text-muted-foreground">Temperature</p>
                <p className="text-sm font-medium">{robot.sensors.temperature.toFixed(1)}°C</p>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <p className="text-xs text-muted-foreground">CPU</p>
                <p className="text-sm font-medium">{robot.sensors.cpuUsage.toFixed(0)}%</p>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <p className="text-xs text-muted-foreground">Memory</p>
                <p className="text-sm font-medium">{robot.sensors.memoryUsage.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          {/* Connection Quality */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Connection Quality</p>
              <span className="text-sm font-medium">{robot.connectionQuality.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${robot.connectionQuality}%` }}
              />
            </div>
          </div>

          {/* Error Message */}
          {robot.lastErrorMessage && (
            <div className="pt-4 border-t bg-destructive/10 rounded p-2">
              <p className="text-xs text-destructive font-medium">
                {robot.lastErrorMessage}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
