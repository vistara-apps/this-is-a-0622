import React from 'react'
import { Check, Star, Zap } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'

export default function Pricing() {
  const { tier, upgradeTier } = useSubscription()

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started with sample clearance',
      features: [
        '10 sample searches per month',
        '3 clearance requests',
        'Basic license templates',
        'Community support',
        'Basic DMCA guidance'
      ],
      limitations: [
        'Limited search history',
        'No priority support',
        'Basic documentation storage'
      ],
      current: tier === 'free',
      recommended: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'For serious remix artists and producers',
      features: [
        'Unlimited sample searches',
        'Unlimited clearance requests',
        'Advanced AI-powered templates',
        'Priority email support',
        'Complete DMCA protection tools',
        'Secure document storage (IPFS)',
        'Advanced analytics & reporting',
        'Pre-vetted sample library access'
      ],
      limitations: [],
      current: tier === 'pro',
      recommended: true
    },
    {
      id: 'artist',
      name: 'Artist Bundle',
      price: '$49',
      period: '/month',
      description: 'Complete solution for professional artists',
      features: [
        'Everything in Pro',
        'Legal consultation credits (2 hours/month)',
        'Dedicated account manager',
        '24/7 priority support',
        'Custom license negotiation assistance',
        'Industry contact database access',
        'Advanced dispute resolution support',
        'White-label licensing tools'
      ],
      limitations: [],
      current: tier === 'artist',
      recommended: false
    }
  ]

  const handleUpgrade = async (planId: string) => {
    if (planId !== 'free') {
      await upgradeTier(planId as 'pro' | 'artist')
    }
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Clear sample rights effortlessly with tools designed for every level of music creation.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-surface/50 rounded-xl p-8 border transition-all ${
              plan.recommended
                ? 'border-primary shadow-2xl shadow-primary/20 scale-105'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>Most Popular</span>
                </div>
              </div>
            )}

            {plan.current && (
              <div className="absolute -top-4 right-4">
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-4xl font-bold text-text-primary">{plan.price}</span>
                <span className="text-text-secondary ml-1">{plan.period}</span>
              </div>
              <p className="text-text-secondary">{plan.description}</p>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-text-primary">Features included:</h4>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.limitations.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-semibold text-text-secondary text-sm mb-2">Limitations:</h4>
                  <ul className="space-y-2">
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="text-text-secondary text-sm opacity-75">
                        • {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={plan.current}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                plan.current
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : plan.recommended
                  ? 'bg-primary hover:bg-primary/80 text-white shadow-lg hover:shadow-xl'
                  : 'bg-white/10 hover:bg-white/20 text-text-primary'
              }`}
            >
              {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-6">
          <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
            <h3 className="font-semibold text-text-primary mb-2">
              What happens to my data if I downgrade?
            </h3>
            <p className="text-text-secondary">
              Your data remains safe and accessible. You'll just have usage limits based on your new plan tier.
            </p>
          </div>

          <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
            <h3 className="font-semibold text-text-primary mb-2">
              Do you offer refunds?
            </h3>
            <p className="text-text-secondary">
              Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.
            </p>
          </div>

          <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
            <h3 className="font-semibold text-text-primary mb-2">
              Can I change my plan anytime?
            </h3>
            <p className="text-text-secondary">
              Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>

          <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
            <h3 className="font-semibold text-text-primary mb-2">
              Is my payment information secure?
            </h3>
            <p className="text-text-secondary">
              Yes, we use Stripe for payment processing, which is PCI DSS compliant and bank-level secure.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Ready to Clear Samples Like a Pro?
          </h2>
          <p className="text-text-secondary mb-6">
            Join thousands of artists who've streamlined their sample clearance process with SampleFlow.
          </p>
          <button className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  )
}