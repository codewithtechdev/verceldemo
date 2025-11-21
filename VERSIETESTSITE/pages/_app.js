import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { OrderProvider } from '../lib/order-context'

function MyApp({ Component, pageProps }) {
  return (
    <OrderProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-16">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </OrderProvider>
  )
}

export default MyApp