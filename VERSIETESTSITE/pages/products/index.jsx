import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'

export default function ProductsPage() {
  const router = useRouter()
  const { category } = router.query
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [category])

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
    setCategories(data || [])
  }

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    if (category && category !== 'all') {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()

      if (categoryData) {
        query = query.eq('category_id', categoryData.id)
      }
    }

    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>All Projects - CodeWithTechDev</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-dark mb-8">All Projects</h1>

          {/* Category Filter */}
          <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
            <button
              onClick={() => router.push('/products')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                !category ? 'bg-accent text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Projects
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => router.push(`/products?category=${cat.slug}`)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                  category === cat.slug ? 'bg-accent text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.short_description || product.description.substring(0, 80)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-accent font-bold">${product.price}</span>
                      <Link 
                        href={`/products/${product.id}`}
                        className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-secondary transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No projects found</div>
              <button 
                onClick={() => router.push('/products')}
                className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition"
              >
                View All Projects
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}