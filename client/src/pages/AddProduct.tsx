import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import { ArrowLeft, Plus, X } from "lucide-react"
import { Quantum } from 'ldrs/react'
import 'ldrs/react/Quantum.css'
import axios from "axios"

interface ClassOption {
  id: string;
  name: string;
}

interface DetailClassifier {
  id: string;
  description: string;
}

export default function AddProduct() {
  const { vendorID } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [classOptions, setClassOptions] = useState<ClassOption[]>([])
  const [detailClassifiers, setDetailClassifiers] = useState<DetailClassifier[]>([])
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [showNutrition, setShowNutrition] = useState(false)
  const [formData, setFormData] = useState({
    ProductName: "",
    Price: "",
    ClassID: "",
    DetailID: "",
    DistributorID: "",
    Nutrition: {
      calories: "",
      protein: "",
      sugar: ""
    }
  })

  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        console.log('Fetching class options...');
        const response = await axios.get('/api/proserv/classes');
        console.log('Received class options:', response.data);
        setClassOptions(response.data);
      } catch (error) {
        console.error('Error fetching class options:', error);
        if (axios.isAxiosError(error)) {
          console.error('Response data:', error.response?.data);
          console.error('Response status:', error.response?.status);
        }
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClassOptions();
  }, []);

  useEffect(() => {
    const fetchDetailClassifiers = async () => {
      if (!formData.ClassID) {
        setDetailClassifiers([]);
        return;
      }

      try {
        setLoadingDetails(true);
        console.log('Fetching detail classifiers for class:', formData.ClassID);
        const response = await axios.get(`/api/proserv/classes/${formData.ClassID}/detail-classifiers`);
        console.log('Received detail classifiers:', response.data);
        setDetailClassifiers(response.data);
      } catch (error) {
        console.error('Error fetching detail classifiers:', error);
        if (axios.isAxiosError(error)) {
          console.error('Response data:', error.response?.data);
          console.error('Response status:', error.response?.status);
        }
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetailClassifiers();
  }, [formData.ClassID]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith("Nutrition.")) {
      const nutritionField = name.split(".")[1]
      setFormData(prev => ({
        ...prev,
        Nutrition: {
          ...prev.Nutrition,
          [nutritionField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        Price: parseFloat(formData.Price),
        Nutrition: showNutrition ? {
          calories: formData.Nutrition.calories ? parseInt(formData.Nutrition.calories) : undefined,
          protein: formData.Nutrition.protein || undefined,
          sugar: formData.Nutrition.sugar || undefined
        } : undefined
      }

      await axios.post(`/api/proserv/vendor/${vendorID}`, payload)
      navigate(`/dashboard/vendor/${vendorID}/products-services`)
    } catch (error) {
      console.error("Error adding product:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100 text-gray-900">
        <aside className="w-64 bg-white border-r border-slate-200 shadow-md">
          <Sidebar />
        </aside>
        <main className="flex-1 p-8">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Quantum size="200" speed="1.75" color="#3b82f6" />
            <p className="text-slate-600">Adding your product...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-gray-900">
      <aside className="w-64 bg-white border-r border-slate-200 shadow-md">
        <Sidebar />
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => navigate(`/dashboard/vendor/${vendorID}/products-services`)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Add New Product</h1>
              <p className="text-slate-500 mt-1">Create a new product for your vendor</p>
            </div>
          </div>

          <Card className="p-8 bg-white shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="ProductName" className="text-sm font-medium text-slate-700">Product Name</Label>
                  <Input
                    id="ProductName"
                    name="ProductName"
                    value={formData.ProductName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Price" className="text-sm font-medium text-slate-700">Price</Label>
                  <Input
                    id="Price"
                    name="Price"
                    type="number"
                    step="0.01"
                    value={formData.Price}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ClassID" className="text-sm font-medium text-slate-700">Product Class</Label>
                  <select
                    id="ClassID"
                    name="ClassID"
                    value={formData.ClassID}
                    onChange={handleChange}
                    required
                    disabled={loadingClasses}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select a class</option>
                    {classOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  {loadingClasses && (
                    <p className="text-sm text-slate-500">Loading classes...</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="DetailID" className="text-sm font-medium text-slate-700">Detail Classifier</Label>
                  <select
                    id="DetailID"
                    name="DetailID"
                    value={formData.DetailID}
                    onChange={handleChange}
                    required
                    disabled={loadingDetails || !formData.ClassID}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select a detail classifier</option>
                    {detailClassifiers.map(classifier => (
                      <option key={classifier.id} value={classifier.id}>
                        {classifier.id} - {classifier.description}
                      </option>
                    ))}
                  </select>
                  {loadingDetails && (
                    <p className="text-sm text-slate-500">Loading detail classifiers...</p>
                  )}
                  {!loadingDetails && !formData.ClassID && (
                    <p className="text-sm text-slate-500">Select a product class first</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="DistributorID" className="text-sm font-medium text-slate-700">Distributor ID</Label>
                  <Input
                    id="DistributorID"
                    name="DistributorID"
                    value={formData.DistributorID}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {!showNutrition ? (
                <div className="flex justify-center pt-6">
                  <Button
                    type="button"
                    onClick={() => setShowNutrition(true)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Nutrition Information
                  </Button>
                </div>
              ) : (
                <div className="border-t pt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-800">Nutrition Information</h3>
                    <Button
                      type="button"
                      onClick={() => setShowNutrition(false)}
                      variant="ghost"
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="Nutrition.calories" className="text-sm font-medium text-slate-700">Calories</Label>
                      <Input
                        id="Nutrition.calories"
                        name="Nutrition.calories"
                        type="number"
                        value={formData.Nutrition.calories}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter calories"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="Nutrition.protein" className="text-sm font-medium text-slate-700">Protein</Label>
                      <Input
                        id="Nutrition.protein"
                        name="Nutrition.protein"
                        value={formData.Nutrition.protein}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter protein content"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="Nutrition.sugar" className="text-sm font-medium text-slate-700">Sugar</Label>
                      <Input
                        id="Nutrition.sugar"
                        name="Nutrition.sugar"
                        value={formData.Nutrition.sugar}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter sugar content"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/dashboard/vendor/${vendorID}/products-services`)}
                  className="px-6 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
} 