'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Loader2 } from 'lucide-react';

interface Motion {
  id: string;
  name: string;
  description: string;
  duration: number;
}

interface PredefinedMotionsProps {
  robotId: string;
  onMotionStarted?: (motionId: string) => void;
}

export function PredefinedMotions({ robotId, onMotionStarted }: PredefinedMotionsProps) {
  const [motions, setMotions] = useState<Motion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load available motions
  useEffect(() => {
    const loadMotions = async () => {
      try {
        const response = await fetch(`/api/robots/${robotId}/motions`);
        if (response.ok) {
          const data = await response.json();
          setMotions(data.motions);
        } else {
          setError('Failed to load motions');
        }
      } catch (err) {
        console.error('[v0] Error loading motions:', err);
        setError('Error loading motions');
      } finally {
        setIsLoading(false);
      }
    };

    loadMotions();
  }, [robotId]);

  const handleExecuteMotion = async (motionId: string) => {
    setIsExecuting(motionId);
    try {
      const response = await fetch(`/api/robots/${robotId}/motions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motionId }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('[v0] Motion executed:', result);
        onMotionStarted?.(motionId);
      } else {
        setError('Failed to execute motion');
      }
    } catch (err) {
      console.error('[v0] Error executing motion:', err);
      setError('Error executing motion');
    } finally {
      setIsExecuting(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card/50 border border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Predefined Motions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border border-border/50">
      <CardHeader>
        <CardTitle className="text-base">Predefined Motions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 rounded px-3 py-2">
            {error}
          </div>
        )}

        {motions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No predefined motions available for this robot
          </p>
        ) : (
          <div className="space-y-2">
            {motions.map((motion) => (
              <div
                key={motion.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{motion.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {motion.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Duration: {motion.duration}ms
                  </p>
                </div>
                <Button
                  onClick={() => handleExecuteMotion(motion.id)}
                  disabled={isExecuting !== null}
                  size="sm"
                  className="ml-2 flex-shrink-0"
                >
                  {isExecuting === motion.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
