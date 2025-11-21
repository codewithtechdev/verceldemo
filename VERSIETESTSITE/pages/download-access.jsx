import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useOrder } from '../lib/order-context'
import Head from 'next/head'

export default function DownloadAccess() {
  const router = useRouter()
  const { currentOrder, addDownloadAccess } = useOrder()
  const [downloads, setDownloads] = useState([])

  useEffect(() => {
    if (!currentOrder || currentOrder.status !== 'completed') {
      router.push('/')
      return
    }

    // Generate download access for purchased items
    const generatedDownloads = currentOrder.items.map(item => {
      const downloadToken = `dl_${Math.random().toString(36).substr(2, 16)}`
      const downloadUrl = `${item.file_url}?token=${downloadToken}`
      
      addDownloadAccess(item.id, downloadUrl, downloadToken)
      
      return {
        ...item,
        downloadUrl,
        downloadToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    })

    setDownloads(generatedDownloads)
  }, [currentOrder, router, addDownloadAccess])

  const handleDownload = (downloadUrl, productName) => {
    // Track download in analytics
    console.log(`Download started: ${productName}`)
    
    // Create temporary link for download
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = productName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatExpiry = (date) => {
    return new Date(date).toLocaleDateString() + ' at ' + new Date(date).toLocaleTimeString()
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Download Your Products - CodeWithTechDev</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-dark mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-600 mb-2">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <p className="text-gray-600">
              Order ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{currentOrder.id}</span>
            </p>
          </div>

          {/* Download Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-accent text-white p-6">
                <h2 className="text-2xl font-bold">Download Your Products</h2>
                <p className="text-accent-100 mt-2">
                  Your files are ready for download. Links expire in 24 hours.
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {downloads.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-gray-600 text-sm">
                            File size: ~5MB • Expires: {formatExpiry(item.expiresAt)}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                              Ready to download
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDownload(item.downloadUrl, item.name)}
                        className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-warning transition flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Additional Information */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    What's Next?
                  </h3>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>• Extract the ZIP file after downloading</li>
                    <li>• Read the README.md file for setup instructions</li>
                    <li>• Check the documentation folder for detailed guides</li>
                    <li>• Contact support if you need help with setup</li>
                  </ul>
                </div>

                {/* Support Section */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-dark mb-2">Need Help?</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Our support team is here to help you with any questions.
                    </p>
                    <button className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-secondary transition">
                      Contact Support
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-dark mb-2">Explore More</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Check out our other premium code projects.
                    </p>
                    <button 
                      onClick={() => router.push('/products')}
                      className="bg-dark text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition"
                    >
                      Browse Projects
                    </button>
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