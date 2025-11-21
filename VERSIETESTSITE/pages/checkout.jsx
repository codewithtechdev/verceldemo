import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { verifonePayment } from '../lib/verifone'
import { useOrder } from '../lib/order-context'
import Head from 'next/head'

export default function Checkout() {
  const router = useRouter()
  const { createOrder, updateOrderStatus } = useOrder()
  const [loading, setLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    zipCode: ''
  })

  // Mock cart items - in real app, this would come from cart context
  const [cartItems] = useState([
    {
      id: '1',
      name: 'Responsive Portfolio Template',
      price: 29.99,
      quantity: 1,
      file_url: '/downloads/portfolio-template.zip'
    }
  ])

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create order
      createOrder(cartItems, total, customerInfo)

      // Process payment with Verifone
      const paymentResult = await verifonePayment.processPayment({
        amount: total,
        cardDetails: {}, // In real app, collect card details via secure form
        customerInfo: customerInfo,
        products: cartItems
      })

      if (paymentResult.success) {
        updateOrderStatus('completed', paymentResult.transactionId)
        
        // Redirect to download page
        router.push('/download-access')
      } else {
        alert(`Payment failed: ${paymentResult.error}`)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('An error occurred during checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Checkout - CodeWithTechDev</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-dark mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div>
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Customer Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={customerInfo.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={customerInfo.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-sm font-bold">V</span>
                          </div>
                          <span className="font-semibold">Verifone Secure Payment</span>
                        </div>
                        <span className="text-green-600 text-sm font-semibold">Secure</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Your payment is processed securely through Verifone. We don't store your card details.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-white py-4 rounded-lg font-semibold hover:bg-warning transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </div>
                    ) : (
                      `Pay $${total.toFixed(2)} with Verifone`
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-600 text-xs">ZIP</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="text-gray-600 text-sm">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="text-accent font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Security Badges */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-center space-x-6 text-gray-400">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div className="text-xs">Secure Payment</div>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div className="text-xs">Instant Delivery</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}