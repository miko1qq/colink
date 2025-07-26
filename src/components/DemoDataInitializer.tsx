import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, Database } from 'lucide-react';
import { initializeDemoData } from '@/lib/demoData';

const DemoDataInitializer = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleInitialize = async () => {
    setIsInitializing(true);
    setStatus('idle');
    setMessage('');

    try {
      await initializeDemoData();
      setStatus('success');
      setMessage('Demo data has been successfully initialized! You can now use the demo login buttons.');
      sessionStorage.setItem('demoDataInitialized', 'true');
    } catch (error) {
      setStatus('error');
      setMessage(`Failed to initialize demo data: ${error}`);
      console.error('Demo data initialization error:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const isInitialized = sessionStorage.getItem('demoDataInitialized') === 'true';

  if (isInitialized && status !== 'error') {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Demo data is ready! You can use the demo login buttons above.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
          <Database className="h-4 w-4" />
          Demo Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Initialize demo accounts and sample data for testing the platform.
        </p>
        
        {status === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-xs">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-xs">
              {message}
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleInitialize}
          disabled={isInitializing}
          size="sm"
          variant="outline"
          className="w-full"
        >
          {isInitializing ? (
            <>
              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              Setting up...
            </>
          ) : (
            <>
              <Database className="h-3 w-3 mr-2" />
              Initialize Demo Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DemoDataInitializer;