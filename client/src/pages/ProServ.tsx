// src/pages/ProServ.tsx
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import Sidebar from "@/components/Sidebar"
import { useNavigate, useParams } from "react-router-dom"
import { Plus } from "lucide-react"
import axios from "axios"
import { Dialog } from "@headlessui/react"

export default function ProServ() {
  const { vendorID } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [expandedClasses, setExpandedClasses] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [classNames, setClassNames] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        console.log('Fetching products for vendor:', vendorID)
        const response = await axios.get(`/api/proserv/vendor/${vendorID}`)
        console.log('Raw response:', response)
        console.log('Response data:', response.data)
        if (response.data && response.data.products) {
          setProducts(response.data.products)
          setClassNames(response.data.classNames || {})
        } else {
          console.log('No products found in response')
          setProducts([])
          setClassNames({})
        }
        setError(null)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (vendorID) {
      fetchProducts()
    }
  }, [vendorID])

  const groupedProducts = products.reduce((acc: any, product) => {
    const classID = product.ClassID
    if (!acc[classID]) acc[classID] = []
    acc[classID].push(product)
    return acc
  }, {})

  console.log('Products state:', products)
  console.log('Class names state:', classNames)
  console.log('Grouped products:', groupedProducts)

  const toggleClass = (classID: string) => {
    if (expandedClasses.includes(classID)) {
      setExpandedClasses(expandedClasses.filter(c => c !== classID))
    } else {
      setExpandedClasses([...expandedClasses, classID])
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100 text-gray-900">
        <aside className="w-64 bg-white border-r border-slate-200 shadow-md">
          <Sidebar />
        </aside>
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <p>Loading products...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-slate-100 text-gray-900">
        <aside className="w-64 bg-white border-r border-slate-200 shadow-md">
          <Sidebar />
        </aside>
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#181f2a] text-white">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 shadow-md">
        <Sidebar />
      </aside>

      <main className="flex-1 p-8 space-y-6 overflow-auto">
        <div className="flex justify-between items-center border-b border-slate-700 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Products & Services</h1>
            <p className="text-slate-400 mt-1">Manage your business's products and services</p>
          </div>
          <button
            onClick={() => navigate(`/dashboard/vendor/${vendorID}/products-services/new`)}
            className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors duration-200"
          >
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        </div>

        {Object.entries(groupedProducts).map(([classID, items]: any) => (
          <Card key={classID} className="p-6 bg-[#232b3e] border border-slate-700 shadow-sm hover:shadow-lg transition-shadow duration-200 rounded-2xl mb-4">
            <div
              onClick={() => toggleClass(classID)}
              className="flex justify-between items-center cursor-pointer select-none group"
            >
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                  {classNames[classID] || classID}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {items.length} {items.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <span className="text-slate-500 text-xl group-hover:text-blue-400 transition-colors duration-200">
                {expandedClasses.includes(classID) ? "↑" : "↓"}
              </span>
            </div>

            {expandedClasses.includes(classID) && (
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-sm text-left border-collapse">
                  <thead className="bg-[#232b3e] text-slate-400 uppercase text-xs border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-3 font-medium">Product Name</th>
                      <th className="px-6 py-3 font-medium">Price</th>
                      <th className="px-6 py-3 font-medium">Detail ID</th>
                      <th className="px-6 py-3 font-medium">Distributor ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {items.map((product: any, i: number) => (
                      <tr
                        key={i}
                        onClick={() => setSelectedProduct(product)}
                        className="hover:bg-slate-800 cursor-pointer transition-colors duration-150"
                      >
                        <td className="px-6 py-4 font-medium text-white">{product.ProductName}</td>
                        <td className="px-6 py-4 text-blue-400">${product.Price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-slate-300">{product.DetailID}</td>
                        <td className="px-6 py-4 text-slate-300">{product.DistributorID || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        ))}

        {/* Modal */}
        {selectedProduct && (
          <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)} className="relative z-50">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-[#232b3e] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
                <Dialog.Title className="text-2xl font-bold text-white mb-6">Product Details</Dialog.Title>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Product Name</p>
                      <p className="font-medium text-white">{selectedProduct.ProductName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Price</p>
                      <p className="font-medium text-blue-400">${selectedProduct.Price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Class</p>
                      <p className="font-medium text-white">{classNames[selectedProduct.ClassID] || selectedProduct.ClassID}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Detail ID</p>
                      <p className="font-medium text-slate-300">{selectedProduct.DetailID}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Distributor ID</p>
                      <p className="font-medium text-slate-300">{selectedProduct.DistributorID || '-'}</p>
                    </div>
                  </div>

                  {selectedProduct.Nutrition && (
                    <div className="mt-6 pt-6 border-t border-slate-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Nutrition Facts</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-slate-400">Calories</p>
                          <p className="font-medium text-white">{selectedProduct.Nutrition.calories || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Protein</p>
                          <p className="font-medium text-white">{selectedProduct.Nutrition.protein || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Sugar</p>
                          <p className="font-medium text-white">{selectedProduct.Nutrition.sugar || '-'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
      </main>
    </div>
  )
}



