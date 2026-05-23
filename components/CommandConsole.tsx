'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Trash2 } from 'lucide-react';

interface ConsoleMessage {
  id: string;
  type: 'input' | 'output' | 'error' | 'info';
  content: string;
  timestamp: number;
}

interface CommandConsoleProps {
  robotId: string;
}

export function CommandConsole({ robotId }: CommandConsoleProps) {
  const [messages, setMessages] = useState<ConsoleMessage[]>([
    {
      id: '0',
      type: 'info',
      content: `Connected to ${robotId}. Enter ROS2 commands or JSON payloads.`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const parseCommand = (cmd: string): { type: string; payload: any } | null => {
    try {
      // Try parsing as JSON first
      const parsed = JSON.parse(cmd);
      if (parsed.type && parsed.payload) {
        return parsed;
      }
    } catch {
      // Not JSON, try command format
    }

    // Parse as command string: "type:json_payload" or just "type"
    const [type, ...rest] = cmd.split(':');
    const payload = rest.length > 0 ? rest.join(':') : '{}';

    try {
      return {
        type: type.trim(),
        payload: JSON.parse(payload),
      };
    } catch {
      return null;
    }
  };

  const handleSendCommand = async () => {
    if (!input.trim()) return;

    const command = input.trim();
    setInput('');

    // Add input to console
    const inputMsg: ConsoleMessage = {
      id: `msg-${Date.now()}`,
      type: 'input',
      content: `$ ${command}`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, inputMsg]);

    // Parse command
    const parsed = parseCommand(command);
    if (!parsed) {
      const errorMsg: ConsoleMessage = {
        id: `msg-${Date.now()}-err`,
        type: 'error',
        content: 'Invalid command format. Use: type:{"key":"value"} or {"type":"...","payload":{...}}',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/robots/${robotId}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      const data = await response.json();
      const outputMsg: ConsoleMessage = {
        id: `msg-${Date.now()}-out`,
        type: response.ok ? 'output' : 'error',
        content: JSON.stringify(data, null, 2),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, outputMsg]);
    } catch (error) {
      const errorMsg: ConsoleMessage = {
        id: `msg-${Date.now()}-err`,
        type: 'error',
        content: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: '0',
        type: 'info',
        content: 'Console cleared',
        timestamp: Date.now(),
      },
    ]);
  };

  const getMessageColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'input':
        return 'text-blue-600 dark:text-blue-400 font-medium';
      case 'output':
        return 'text-green-600 dark:text-green-400 font-mono text-xs';
      case 'error':
        return 'text-red-600 dark:text-red-400 font-mono text-xs';
      case 'info':
        return 'text-muted-foreground text-xs italic';
      default:
        return '';
    }
  };

  return (
    <Card className="bg-card/50 border border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base">Command Console</CardTitle>
        <Button
          onClick={handleClear}
          size="sm"
          variant="ghost"
          disabled={messages.length <= 1}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Console Output */}
        <ScrollArea className="h-48 w-full rounded-md border border-input bg-muted/20 p-4">
          <div className="space-y-2" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={getMessageColor(msg.type)}>
                {msg.content}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Command Input */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Format: <code className="bg-muted px-1 rounded">type:{'{"key":"value"}'}</code>
          </p>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSendCommand();
                }
              }}
              placeholder={`e.g., emergency_stop:{} or joint_control:{"joints":{"joint-1":1.57}}`}
              disabled={isLoading}
              className="font-mono text-xs"
            />
            <Button
              onClick={handleSendCommand}
              disabled={!input.trim() || isLoading}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Help */}
        <div className="text-xs text-muted-foreground space-y-1 bg-muted/30 rounded p-2">
          <p className="font-medium">Available Commands:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li><code>joint_control:{'{...}'}</code> - Control robot joints</li>
            <li><code>predefined_motion:{'{...}'}</code> - Execute predefined motion</li>
            <li><code>emergency_stop:{'{}'}</code> - Emergency stop</li>
            <li><code>ros_command:{'{...}'}</code> - Raw ROS2 command</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
