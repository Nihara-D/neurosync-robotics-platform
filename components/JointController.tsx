'use client';

import { useState } from 'react';
import { Joint } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, RotateCcw } from 'lucide-react';

interface JointControllerProps {
  joint: Joint;
  onCommandSent?: (jointId: string, position: number) => void;
}

export function JointController({ joint, onCommandSent }: JointControllerProps) {
  const [targetPosition, setTargetPosition] = useState(joint.position);
  const [isCommandPending, setIsCommandPending] = useState(false);

  const handleSliderChange = (value: number[]) => {
    setTargetPosition(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      const clamped = Math.max(joint.minPosition, Math.min(joint.maxPosition, value));
      setTargetPosition(clamped);
    }
  };

  const handleSendCommand = async () => {
    setIsCommandPending(true);
    try {
      // Send joint control command to API
      const response = await fetch(`/api/robots/${joint.id.split('-')[0]}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'joint_control',
          payload: {
            joints: { [joint.id]: targetPosition },
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('[v0] Command sent successfully:', result);
        onCommandSent?.(joint.id, targetPosition);
      } else {
        console.error('[v0] Command failed:', await response.text());
      }
    } catch (error) {
      console.error('[v0] Error sending command:', error);
    } finally {
      setIsCommandPending(false);
    }
  };

  const handleReset = () => {
    setTargetPosition(joint.position);
  };

  const positionDiff = Math.abs(targetPosition - joint.position);
  const isDifferent = positionDiff > 0.01;

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>{joint.name}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {joint.id}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Position */}
          <div className="bg-muted/30 rounded p-3">
            <p className="text-xs text-muted-foreground mb-1">Current Position</p>
            <p className="text-lg font-semibold">{joint.position.toFixed(2)} rad</p>
          </div>

          {/* Slider Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Target Position</Label>
              <span className="text-xs font-medium">
                {targetPosition.toFixed(2)} rad
              </span>
            </div>
            <Slider
              value={[targetPosition]}
              onValueChange={handleSliderChange}
              min={joint.minPosition}
              max={joint.maxPosition}
              step={0.01}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{joint.minPosition.toFixed(2)}</span>
              <span>{joint.maxPosition.toFixed(2)}</span>
            </div>
          </div>

          {/* Direct Input */}
          <div className="space-y-2">
            <Label htmlFor={`input-${joint.id}`} className="text-xs">
              Direct Input
            </Label>
            <Input
              id={`input-${joint.id}`}
              type="number"
              value={targetPosition.toFixed(3)}
              onChange={handleInputChange}
              min={joint.minPosition}
              max={joint.maxPosition}
              step={0.01}
              className="h-8 text-sm"
            />
          </div>

          {/* Joint Limits */}
          <div className="text-xs text-muted-foreground space-y-1 bg-muted/20 rounded p-2">
            <p>
              <strong>Max Velocity:</strong> {joint.maxVelocity.toFixed(2)} rad/s
            </p>
            <p>
              <strong>Current Velocity:</strong> {joint.velocity.toFixed(2)} rad/s
            </p>
            <p>
              <strong>Current Effort:</strong> {joint.effort.toFixed(1)}/{joint.maxEffort.toFixed(0)} Nm
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSendCommand}
              disabled={!isDifferent || isCommandPending}
              size="sm"
              className="flex-1"
            >
              <Send className="w-3 h-3 mr-1" />
              Send
            </Button>
            <Button
              onClick={handleReset}
              disabled={!isDifferent}
              size="sm"
              variant="outline"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>

          {isDifferent && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Δ {positionDiff.toFixed(2)} rad change pending
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
