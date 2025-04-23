// src/pages/ProServ.tsx
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useParams } from "react-router-dom"
import axios from "axios"
import Sidebar from "@/components/Sidebar"
import { Plus } from "lucide-react"

export default function ProServ() {
  const { vendorID } = useParams()
  const [products, setProducts] = useState<any[]>([])
  const [formData, setFormData] = useState({
    classID: "",
    detailID: "",
    productName: "",
    price: "",
    distributorID: "",
    nutrition: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    // Mock data
    const mockProducts = [
      {
        ProductName: "Blueberry Shake",
        Price: "6.99",
        ClassID: "FB",
        DetailID: "0001",
        DistributorID: "D123",
        Nutrition: { calories: 220, protein: "20g", sugar: "10g" }
      },
      {
        ProductName: "Protein Bar",
        Price: "2.99",
        ClassID: "FB",
        DetailID: "0002",
        DistributorID: "D456",
        Nutrition: { calories: 180, protein: "15g", sugar: "5g" }
      }
    ]
    setProducts(mockProducts)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAddProduct = async () => {
    setIsSubmitting(true)
    try {
      const newProduct = {
        ProductName: formData.productName,
        Price: formData.price,
        ClassID: formData.classID,
        DetailID: formData.detailID,
        DistributorID: formData.distributorID,
        Nutrition: formData.nutrition ? JSON.parse(formData.nutrition) : {}
      }

      const payload = {
        vendorID,
        classID: formData.classID,
        detailID: formData.detailID,
        items: [newProduct]
      }

      await axios.post("/api/products/add", payload)
      setProducts(prev => [...prev, newProduct])
      setFormData({
        classID: "", detailID: "", productName: "", price: "", distributorID: "", nutrition: ""
      })
      setShowAddForm(false)
    } catch (err) {
      console.error("Failed to add product:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-md">
        <Sidebar />
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 space-y-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-3xl font-bold text-slate-800">Products & Services</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>

        {/* Add Product Form (toggle) */}
        {showAddForm && (
          <Card className="p-6 border border-slate-200 shadow-sm bg-white">
            <h2 className="text-lg font-semibold mb-4 text-slate-700">Add New Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Class ID", name: "classID" },
                { label: "Detail ID", name: "detailID" },
                { label: "Product Name", name: "productName" },
                { label: "Price", name: "price" },
                { label: "Distributor ID", name: "distributorID" },
                { label: "Nutrition (JSON)", name: "nutrition" }
              ].map(({ label, name }) => (
                <div key={name}>
                  <Label>{label}</Label>
                  <Input
                    name={name}
                    value={formData[name as keyof typeof formData]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
            <Button onClick={handleAddProduct} disabled={isSubmitting} className="mt-6">
              {isSubmitting ? "Adding..." : "Submit Product"}
            </Button>
          </Card>
        )}

        {/* Spreadsheet View */}
        <Card className="p-0 border border-slate-200 shadow-sm bg-white overflow-x-auto">
          <table className="min-w-full text-sm text-left table-auto border-collapse">
            <thead className="bg-slate-100 text-slate-600 uppercase text-xs border-b">
              <tr>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Class ID</th>
                <th className="px-6 py-3">Detail ID</th>
                <th className="px-6 py-3">Distributor</th>
                <th className="px-6 py-3">Calories</th>
                <th className="px-6 py-3">Protein</th>
                <th className="px-6 py-3">Sugar</th>
              </tr>
            </thead>
            <tbody className="text-slate-800">
              {products.map((item, i) => (
                <tr key={i} className="border-t hover:bg-slate-50">
                  <td className="px-6 py-3">{item.ProductName}</td>
                  <td className="px-6 py-3">${item.Price}</td>
                  <td className="px-6 py-3">{item.ClassID}</td>
                  <td className="px-6 py-3">{item.DetailID}</td>
                  <td className="px-6 py-3">{item.DistributorID}</td>
                  <td className="px-6 py-3">{item.Nutrition?.calories || "-"}</td>
                  <td className="px-6 py-3">{item.Nutrition?.protein || "-"}</td>
                  <td className="px-6 py-3">{item.Nutrition?.sugar || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  )
}
