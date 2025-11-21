import { createContext, useContext, useReducer } from 'react'

const OrderContext = createContext()

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_ORDER':
      return {
        ...state,
        currentOrder: {
          id: `order_${Date.now()}`,
          items: action.payload.items,
          total: action.payload.total,
          customerInfo: action.payload.customerInfo,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      }
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          status: action.payload.status,
          transactionId: action.payload.transactionId
        }
      }
    
    case 'CLEAR_ORDER':
      return {
        ...state,
        currentOrder: null
      }
    
    case 'ADD_DOWNLOAD_ACCESS':
      return {
        ...state,
        downloadAccess: [...state.downloadAccess, action.payload]
      }
    
    default:
      return state
  }
}

const initialState = {
  currentOrder: null,
  downloadAccess: []
}

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState)

  const createOrder = (items, total, customerInfo) => {
    dispatch({
      type: 'CREATE_ORDER',
      payload: { items, total, customerInfo }
    })
  }

  const updateOrderStatus = (status, transactionId) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { status, transactionId }
    })
  }

  const clearOrder = () => {
    dispatch({ type: 'CLEAR_ORDER' })
  }

  const addDownloadAccess = (productId, downloadUrl, accessToken) => {
    dispatch({
      type: 'ADD_DOWNLOAD_ACCESS',
      payload: {
        productId,
        downloadUrl,
        accessToken,
        accessedAt: new Date().toISOString()
      }
    })
  }

  const value = {
    currentOrder: state.currentOrder,
    downloadAccess: state.downloadAccess,
    createOrder,
    updateOrderStatus,
    clearOrder,
    addDownloadAccess
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}