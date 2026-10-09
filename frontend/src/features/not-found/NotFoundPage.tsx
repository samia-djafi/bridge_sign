import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { HelpCircle, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-app-bg text-app-text">
      <div className="max-w-md w-full p-6 rounded-card bg-app-surface border border-app-border text-center space-y-4 shadow-2">
        <div className="w-14 h-14 rounded-full bg-app-surface-2 text-app-muted mx-auto flex items-center justify-center">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-app-text">Page introuvable (404)</h2>
        <p className="text-sm text-app-muted">
          La page que vous recherchez n’existe pas ou a été déplacée.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate('/app')}
          iconStart={<Home className="w-4 h-4" />}
        >
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};
