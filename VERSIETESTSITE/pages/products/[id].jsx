import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Head from 'next/head'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark mb-4">Product Not Found</h1>
          <button 
            onClick={() => router.push('/')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{product.name} - CodeWithTechDev</title>
        <meta name="description" content={product.short_description || product.description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex mb-6 text-sm text-gray-600">
            <a href="/" className="hover:text-accent transition">Home</a>
            <span className="mx-2">/</span>
            <a href="/products" className="hover:text-accent transition">Products</a>
            <span className="mx-2">/</span>
            <span className="text-dark font-semibold">{product.name}</span>
          </nav>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Product Image */}
              <div className="md:w-1/2 p-6">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              
              {/* Product Info */}
              <div className="md:w-1/2 p-6">
                <div className="mb-4">
                  <span className="inline-block bg-secondary bg-opacity-20 text-secondary px-3 py-1 rounded-full text-sm font-semibold mb-2">
                    {product.categories.name}
                  </span>
                  <h1 className="text-3xl font-bold text-dark mb-2">{product.name}</h1>
                  <p className="text-gray-600 text-lg">{product.short_description}</p>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-accent">${product.price}</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-xl text-gray-400 line-through">${product.original_price}</span>
                    )}
                  </div>
                  {product.price === 0 && (
                    <div className="text-green-600 font-semibold text-lg">FREE Download</div>
                  )}
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="font-semibold text-dark mb-2">What's Included:</h3>
                  <ul className="grid grid-cols-1 gap-2">
                    {product.features?.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    )) || [
                      'Complete source code',
                      'Detailed documentation',
                      'Lifetime updates',
                      'Technical support',
                      'MIT License',
                      'Responsive design'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-accent text-white py-4 rounded-lg font-semibold hover:bg-warning transition">
                    Buy Now - ${product.price}
                  </button>
                  <button 
  onClick={() => router.push('/checkout')}
  className="w-full bg-accent text-white py-4 rounded-lg font-semibold hover:bg-warning transition"
>
  Buy Now - ${product.price}
</button>
                  <button className="w-full bg-secondary text-white py-4 rounded-lg font-semibold hover:bg-primary transition">
                    Add to Cart
                  </button>

                  {product.has_live_demo && product.live_demo_url && (
                    <a 
                      href={product.live_demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-dark text-white py-4 rounded-lg font-semibold text-center hover:bg-gray-800 transition"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t p-6">
              <h2 className="text-2xl font-bold text-dark mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}