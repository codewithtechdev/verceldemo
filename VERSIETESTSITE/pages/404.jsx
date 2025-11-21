import Link from 'next/link'
import Head from 'next/head'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - CodeWithTechDev</title>
      </Head>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="text-9xl font-bold text-accent opacity-20">404</div>
            <h1 className="text-3xl font-bold text-dark mt-4 mb-2">Page Not Found</h1>
            <p className="text-gray-600 mb-8">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>
          
          <Link 
            href="/"
            className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-warning transition"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </>
  )
}