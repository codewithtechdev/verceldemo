import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Head from 'next/head'

export default function Admin() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
    setCategories(data || [])
  }

  return (
    <>
      <Head>
        <title>Admin Panel - CodeWithTechDev</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-dark mb-8">Admin Panel</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-2xl font-bold text-primary mb-2">{products.length}</div>
              <div className="text-gray-600">Total Products</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-2xl font-bold text-secondary mb-2">
                {products.filter(p => p.is_active).length}
              </div>
              <div className="text-gray-600">Active Products</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-2xl font-bold text-accent mb-2">
                {products.filter(p => p.is_featured).length}
              </div>
              <div className="text-gray-600">Featured Products</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-2xl font-bold text-warning mb-2">
                {products.filter(p => p.price === 0).length}
              </div>
              <div className="text-gray-600">Free Products</div>
            </div>
          </div>

          {/* Products List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Products ({products.length})</h2>
              <button className="bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-warning transition">
                Add New Product
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-gray-600">${product.price}</p>
                        <div className="flex space-x-2 mt-1">
                          {!product.is_active && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Inactive</span>
                          )}
                          {product.is_featured && (
                            <span className="bg-accent text-white px-2 py-1 rounded text-xs">Featured</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-2 transition">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-2 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}