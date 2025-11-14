/**
 * Mock payment processing for client-side checkout
 * Deterministic mode for testing, random mode for demo
 */

function generateUUID(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${randomPart}`
}

export interface PaymentPayload {
  amount: number
  deterministic?: boolean
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
}

/**
 * Process a mock payment
 * @param payload - Payment details with amount and optional deterministic flag
 * @returns Promise resolving to payment result with transaction ID
 */
export async function processPayment(
  payload: PaymentPayload
): Promise<PaymentResult> {
  const { amount, deterministic } = payload

  if (amount <= 0) {
    return {
      success: false,
      error: 'Invalid amount',
    }
  }

  if (deterministic === true || process.env.NODE_ENV === 'test') {
    return {
      success: true,
      transactionId: generateUUID(),
    }
  }

  await new Promise(resolve => setTimeout(resolve, 200))

  return {
    success: true,
    transactionId: generateUUID(),
  }
}
