import { loadStripe, Stripe } from '@stripe/stripe-js'
import { APIClient } from './api'
import { stripeConfig, subscriptionTiers } from '../config'
import { 
  StripeCustomerCreateRequest,
  StripeCustomerResponse,
  StripeSubscriptionCreateRequest,
  StripeSubscriptionResponse,
  StripePaymentIntentCreateRequest,
  StripePaymentIntentResponse,
  APIResponse 
} from '../types/api'
import { User, Subscription, PaymentIntent } from '../types'

class StripeService {
  private client: APIClient
  private stripePromise: Promise<Stripe | null>

  constructor() {
    this.client = new APIClient({
      baseUrl: stripeConfig.baseUrl,
      defaultHeaders: {
        'Authorization': `Bearer ${stripeConfig.apiKey}`,
        'Stripe-Version': '2023-10-16'
      },
      timeout: stripeConfig.timeout,
      retryAttempts: stripeConfig.retryAttempts,
      retryDelay: stripeConfig.retryDelay
    })

    this.stripePromise = loadStripe(stripeConfig.publishableKey)
  }

  /**
   * Get Stripe instance for client-side operations
   */
  async getStripe(): Promise<Stripe | null> {
    return this.stripePromise
  }

  /**
   * Create a Stripe customer
   */
  async createCustomer(user: User): Promise<APIResponse<StripeCustomerResponse>> {
    try {
      const request: StripeCustomerCreateRequest = {
        email: user.email,
        metadata: {
          userId: user.userId,
          subscriptionTier: user.subscriptionTier
        }
      }

      const response = await this.client.post<StripeCustomerResponse>('/customers', request)

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_CUSTOMER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown create customer error',
          details: error
        }
      }
    }
  }

  /**
   * Create a subscription for a customer
   */
  async createSubscription(
    customerId: string,
    tier: 'pro' | 'artist'
  ): Promise<APIResponse<StripeSubscriptionResponse>> {
    try {
      const tierConfig = subscriptionTiers[tier]
      
      if (!tierConfig.priceId) {
        return {
          success: false,
          error: {
            code: 'MISSING_PRICE_ID',
            message: `Price ID not configured for tier: ${tier}`
          }
        }
      }

      const request: StripeSubscriptionCreateRequest = {
        customer: customerId,
        items: [
          {
            price: tierConfig.priceId
          }
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        expand: ['latest_invoice.payment_intent']
      }

      const response = await this.client.post<StripeSubscriptionResponse>('/subscriptions', request)

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_SUBSCRIPTION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown create subscription error',
          details: error
        }
      }
    }
  }

  /**
   * Update a subscription
   */
  async updateSubscription(
    subscriptionId: string,
    updates: {
      tier?: 'pro' | 'artist'
      cancelAtPeriodEnd?: boolean
    }
  ): Promise<APIResponse<StripeSubscriptionResponse>> {
    try {
      const updateData: any = {}

      if (updates.tier) {
        const tierConfig = subscriptionTiers[updates.tier]
        if (!tierConfig.priceId) {
          return {
            success: false,
            error: {
              code: 'MISSING_PRICE_ID',
              message: `Price ID not configured for tier: ${updates.tier}`
            }
          }
        }

        updateData.items = [
          {
            price: tierConfig.priceId
          }
        ]
      }

      if (updates.cancelAtPeriodEnd !== undefined) {
        updateData.cancel_at_period_end = updates.cancelAtPeriodEnd
      }

      const response = await this.client.post<StripeSubscriptionResponse>(
        `/subscriptions/${subscriptionId}`,
        updateData
      )

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_SUBSCRIPTION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown update subscription error',
          details: error
        }
      }
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<APIResponse<StripeSubscriptionResponse>> {
    try {
      const response = await this.client.delete<StripeSubscriptionResponse>(
        `/subscriptions/${subscriptionId}`
      )

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CANCEL_SUBSCRIPTION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown cancel subscription error',
          details: error
        }
      }
    }
  }

  /**
   * Create a payment intent for one-time payments
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    customerId?: string,
    metadata?: Record<string, string>
  ): Promise<APIResponse<StripePaymentIntentResponse>> {
    try {
      const request: StripePaymentIntentCreateRequest = {
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        customer: customerId,
        metadata: metadata || {},
        payment_method_types: ['card']
      }

      const response = await this.client.post<StripePaymentIntentResponse>('/payment_intents', request)

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_PAYMENT_INTENT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown create payment intent error',
          details: error
        }
      }
    }
  }

  /**
   * Retrieve a customer
   */
  async getCustomer(customerId: string): Promise<APIResponse<StripeCustomerResponse>> {
    try {
      const response = await this.client.get<StripeCustomerResponse>(`/customers/${customerId}`)

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_CUSTOMER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown get customer error',
          details: error
        }
      }
    }
  }

  /**
   * Retrieve a subscription
   */
  async getSubscription(subscriptionId: string): Promise<APIResponse<StripeSubscriptionResponse>> {
    try {
      const response = await this.client.get<StripeSubscriptionResponse>(`/subscriptions/${subscriptionId}`)

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_SUBSCRIPTION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown get subscription error',
          details: error
        }
      }
    }
  }

  /**
   * List customer subscriptions
   */
  async getCustomerSubscriptions(customerId: string): Promise<APIResponse<{ data: StripeSubscriptionResponse[] }>> {
    try {
      const response = await this.client.get<{ data: StripeSubscriptionResponse[] }>(
        '/subscriptions',
        { customer: customerId }
      )

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_CUSTOMER_SUBSCRIPTIONS_ERROR',
          message: error instanceof Error ? error.message : 'Unknown get customer subscriptions error',
          details: error
        }
      }
    }
  }

  /**
   * Create a billing portal session
   */
  async createBillingPortalSession(
    customerId: string,
    returnUrl: string
  ): Promise<APIResponse<{ url: string }>> {
    try {
      const response = await this.client.post<{ url: string }>('/billing_portal/sessions', {
        customer: customerId,
        return_url: returnUrl
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_BILLING_PORTAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown create billing portal error',
          details: error
        }
      }
    }
  }

  /**
   * Handle subscription upgrade/downgrade
   */
  async changeSubscriptionTier(
    subscriptionId: string,
    newTier: 'pro' | 'artist'
  ): Promise<APIResponse<StripeSubscriptionResponse>> {
    try {
      // First get the current subscription
      const currentSubResponse = await this.getSubscription(subscriptionId)
      
      if (!currentSubResponse.success || !currentSubResponse.data) {
        return currentSubResponse
      }

      const currentSub = currentSubResponse.data
      const newTierConfig = subscriptionTiers[newTier]

      if (!newTierConfig.priceId) {
        return {
          success: false,
          error: {
            code: 'MISSING_PRICE_ID',
            message: `Price ID not configured for tier: ${newTier}`
          }
        }
      }

      // Update the subscription with the new price
      const updateResponse = await this.client.post<StripeSubscriptionResponse>(
        `/subscriptions/${subscriptionId}`,
        {
          items: [
            {
              id: currentSub.items.data[0].id,
              price: newTierConfig.priceId
            }
          ],
          proration_behavior: 'create_prorations'
        }
      )

      return updateResponse
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CHANGE_SUBSCRIPTION_TIER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown change subscription tier error',
          details: error
        }
      }
    }
  }

  /**
   * Process one-time clearance report payment
   */
  async createClearanceReportPayment(
    sampleId: string,
    amount: number,
    customerId?: string
  ): Promise<APIResponse<PaymentIntent>> {
    try {
      const paymentIntentResponse = await this.createPaymentIntent(
        amount,
        'usd',
        customerId,
        {
          type: 'clearance_report',
          sampleId
        }
      )

      if (!paymentIntentResponse.success || !paymentIntentResponse.data) {
        return paymentIntentResponse
      }

      const paymentIntent: PaymentIntent = {
        id: paymentIntentResponse.data.id,
        amount: paymentIntentResponse.data.amount / 100, // Convert back from cents
        currency: paymentIntentResponse.data.currency,
        status: paymentIntentResponse.data.status,
        clientSecret: paymentIntentResponse.data.client_secret
      }

      return {
        success: true,
        data: paymentIntent
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_CLEARANCE_PAYMENT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown create clearance payment error',
          details: error
        }
      }
    }
  }

  /**
   * Get subscription tier from Stripe subscription
   */
  getSubscriptionTier(subscription: StripeSubscriptionResponse): 'free' | 'pro' | 'artist' {
    const priceId = subscription.items.data[0]?.price.id

    if (priceId === subscriptionTiers.pro.priceId) {
      return 'pro'
    } else if (priceId === subscriptionTiers.artist.priceId) {
      return 'artist'
    }

    return 'free'
  }

  /**
   * Map Stripe subscription to app subscription
   */
  mapStripeSubscription(stripeSubscription: StripeSubscriptionResponse, userId: string): Subscription {
    return {
      id: stripeSubscription.id,
      userId,
      tier: this.getSubscriptionTier(stripeSubscription),
      status: this.mapSubscriptionStatus(stripeSubscription.status),
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      stripeSubscriptionId: stripeSubscription.id
    }
  }

  /**
   * Map Stripe subscription status to app status
   */
  private mapSubscriptionStatus(
    stripeStatus: StripeSubscriptionResponse['status']
  ): Subscription['status'] {
    switch (stripeStatus) {
      case 'active':
      case 'trialing':
        return 'active'
      case 'past_due':
        return 'past_due'
      case 'canceled':
        return 'canceled'
      case 'unpaid':
        return 'unpaid'
      default:
        return 'canceled'
    }
  }
}

export const stripeService = new StripeService()
export default stripeService
