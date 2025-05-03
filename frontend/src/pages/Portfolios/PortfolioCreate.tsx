
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import { usePortfolio } from '@/context/PortfolioContext';

const PortfolioCreate = () => {
  const navigate = useNavigate();
  const { createPortfolio, isLoading } = usePortfolio();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [initialInvestment, setInitialInvestment] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    initialInvestment?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      name?: string;
      initialInvestment?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Portfolio name is required';
    }

    const investment = parseFloat(initialInvestment);
    if (isNaN(investment) || investment <= 0) {
      newErrors.initialInvestment = 'Initial investment must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validate()) {
      try {
        await createPortfolio(
          name,
          description,
          parseFloat(initialInvestment)
        );
        navigate('/portfolios');
      } catch (error) {
        console.error('Error creating portfolio:', error);
      }
    }
  };

  return (
    <div>
      <PageHeader
        title="Create Portfolio"
        description="Set up a new investment portfolio"
        action={
          <Button variant="outline" onClick={() => navigate('/portfolios')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Portfolios
          </Button>
        }
      />

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Details</CardTitle>
            <CardDescription>
              Enter information about your new portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Portfolio Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Tech Growth Strategy"
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your investment strategy and goals..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialInvestment">Initial Investment</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="initialInvestment"
                    className="pl-7"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(e.target.value)}
                    placeholder="10000"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.initialInvestment && (
                  <p className="text-destructive text-sm mt-1">{errors.initialInvestment}</p>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Portfolio'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioCreate;
